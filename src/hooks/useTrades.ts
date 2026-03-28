import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Trade {
  id: string;
  user_id: string;
  account_id: string | null;
  date: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  fees: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface TradeInput {
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  entry_price: number;
  exit_price?: number | null;
  fees?: number;
  note?: string;
  date?: string;
}

export function useTrades() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["trades", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useAddTrade() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trade: TradeInput) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("trades")
        .insert({
          user_id: user.id,
          symbol: trade.symbol.toUpperCase(),
          side: trade.side,
          quantity: trade.quantity,
          entry_price: trade.entry_price,
          exit_price: trade.exit_price ?? null,
          fees: trade.fees ?? 0,
          note: trade.note ?? null,
          date: trade.date ?? new Date().toISOString().split("T")[0],
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tradeId: string) => {
      const { error } = await supabase.from("trades").delete().eq("id", tradeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });
}

// Computed helpers
// P&L = (exit - entry) * qty - fees
// entry_price is always the price you entered the position at,
// exit_price is always the price you closed it at.
// A higher exit than entry = profit; lower exit = loss, regardless of side.
export function calcPnL(trade: Trade): number | null {
  if (!trade.exit_price) return null;
  const gross = (trade.exit_price - trade.entry_price) * trade.quantity;
  return gross - (trade.fees ?? 0);
}

export function calcPnLPercent(trade: Trade): number | null {
  if (!trade.exit_price) return null;
  const pnl = calcPnL(trade);
  if (pnl === null) return null;
  return (pnl / (trade.entry_price * trade.quantity)) * 100;
}

// ── Holdings (open positions) ────────────────────────────────────────────────
export interface Holding {
  symbol: string;
  quantity: number;       // net open shares
  avgCost: number;        // weighted average cost per share
  costBasis: number;      // avgCost * quantity
  marketValue: number;    // entry_price used as proxy (no live feed)
  unrealizedPnL: number;
  unrealizedPct: number;
  allocation: number;     // % of total cost basis (filled in by caller)
}

export function computeHoldings(trades: Trade[]): Holding[] {
  // FIFO-lite: track per-symbol buy lots, reduce on sells
  const lots = new Map<string, { qty: number; cost: number }[]>();

  // Process in chronological order
  const sorted = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sorted) {
    const sym = t.symbol.toUpperCase();
    if (!lots.has(sym)) lots.set(sym, []);
    const symLots = lots.get(sym)!;

    if (t.side === "buy") {
      symLots.push({ qty: t.quantity, cost: t.entry_price });
    } else {
      // reduce existing lots FIFO
      let toReduce = t.quantity;
      while (toReduce > 0 && symLots.length > 0) {
        const lot = symLots[0];
        if (lot.qty <= toReduce) {
          toReduce -= lot.qty;
          symLots.shift();
        } else {
          lot.qty -= toReduce;
          toReduce = 0;
        }
      }
    }
  }

  const holdings: Holding[] = [];
  let totalCost = 0;

  for (const [symbol, symLots] of lots.entries()) {
    const totalQty = symLots.reduce((s, l) => s + l.qty, 0);
    if (totalQty <= 0) continue;
    const totalLotCost = symLots.reduce((s, l) => s + l.qty * l.cost, 0);
    const avgCost = totalLotCost / totalQty;
    const costBasis = avgCost * totalQty;

    // Use last known entry price as market proxy
    const lastTrade = [...sorted].reverse().find(t => t.symbol.toUpperCase() === symbol);
    const marketPrice = lastTrade?.exit_price ?? lastTrade?.entry_price ?? avgCost;
    const marketValue = marketPrice * totalQty;
    const unrealizedPnL = marketValue - costBasis;
    const unrealizedPct = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;

    totalCost += costBasis;
    holdings.push({ symbol, quantity: totalQty, avgCost, costBasis, marketValue, unrealizedPnL, unrealizedPct, allocation: 0 });
  }

  // Fill allocation %
  holdings.forEach(h => { h.allocation = totalCost > 0 ? (h.costBasis / totalCost) * 100 : 0; });

  return holdings.sort((a, b) => b.costBasis - a.costBasis);
}

export function getTradeStats(trades: Trade[]) {
  const closed = trades.filter((t) => t.exit_price != null);
  const pnls = closed.map((t) => calcPnL(t)!);
  const totalPnL = pnls.reduce((sum, p) => sum + p, 0);
  const wins = pnls.filter((p) => p > 0).length;
  const winRate = closed.length > 0 ? (wins / closed.length) * 100 : 0;
  const totalVolume = trades.reduce((sum, t) => sum + t.entry_price * t.quantity, 0);

  // Buy / Sell breakdown
  const buyClosed = closed.filter((t) => t.side === "buy");
  const sellClosed = closed.filter((t) => t.side === "sell");
  const buyPnLs = buyClosed.map((t) => calcPnL(t)!);
  const sellPnLs = sellClosed.map((t) => calcPnL(t)!);
  const buyPnL = buyPnLs.reduce((s, p) => s + p, 0);
  const sellPnL = sellPnLs.reduce((s, p) => s + p, 0);
  const buyWins = buyPnLs.filter((p) => p > 0).length;
  const sellWins = sellPnLs.filter((p) => p > 0).length;
  const buyWinRate = buyClosed.length > 0 ? (buyWins / buyClosed.length) * 100 : 0;
  const sellWinRate = sellClosed.length > 0 ? (sellWins / sellClosed.length) * 100 : 0;
  const avgBuyPnL = buyClosed.length > 0 ? buyPnL / buyClosed.length : 0;
  const avgSellPnL = sellClosed.length > 0 ? sellPnL / sellClosed.length : 0;

  // Equity curve
  const sortedClosed = [...closed].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let cumPnL = 0;
  const equityCurve = sortedClosed.map((t) => {
    cumPnL += calcPnL(t)!;
    return { date: t.date, equity: cumPnL };
  });

  // Daily PnL
  const dailyMap = new Map<string, number>();
  closed.forEach((t) => {
    const pnl = calcPnL(t)!;
    dailyMap.set(t.date, (dailyMap.get(t.date) ?? 0) + pnl);
  });
  const dailyPnL = Array.from(dailyMap.entries())
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Today's PnL
  const today = new Date().toISOString().split("T")[0];
  const todayPnL = dailyMap.get(today) ?? 0;

  // Best/worst trade
  const bestTrade = pnls.length > 0 ? Math.max(...pnls) : 0;
  const worstTrade = pnls.length > 0 ? Math.min(...pnls) : 0;

  // Avg win / avg loss
  const winPnLs = pnls.filter((p) => p > 0);
  const lossPnLs = pnls.filter((p) => p < 0);
  const avgWin = winPnLs.length > 0 ? winPnLs.reduce((s, p) => s + p, 0) / winPnLs.length : 0;
  const avgLoss = lossPnLs.length > 0 ? lossPnLs.reduce((s, p) => s + p, 0) / lossPnLs.length : 0;
  const profitFactor = Math.abs(avgLoss) > 0 ? Math.abs(avgWin * winPnLs.length) / Math.abs(avgLoss * lossPnLs.length) : 0;

  // Max drawdown
  let peak = 0;
  let maxDrawdown = 0;
  equityCurve.forEach(({ equity }) => {
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    if (dd > maxDrawdown) maxDrawdown = dd;
  });

  // Symbol performance (for Top Symbols chart)
  const symbolMap = new Map<string, number>();
  closed.forEach((t) => {
    const pnl = calcPnL(t)!;
    symbolMap.set(t.symbol, (symbolMap.get(t.symbol) ?? 0) + pnl);
  });
  const symbolPerformance = Array.from(symbolMap.entries())
    .map(([symbol, pnl]) => ({ symbol, pnl }))
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl));

  // Day of week data (for Trading Days chart)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeekMap = new Map<string, number>();
  trades.forEach((t) => {
    const date = new Date(t.date);
    const day = days[date.getDay()];
    dayOfWeekMap.set(day, (dayOfWeekMap.get(day) ?? 0) + 1);
  });
  const dayOfWeekData = days
    .filter(d => dayOfWeekMap.has(d))
    .map(day => ({ day, count: dayOfWeekMap.get(day)! }));

  // Monthly data (for Monthly Trend chart)
  const monthlyMap = new Map<string, number>();
  closed.forEach((t) => {
    const pnl = calcPnL(t)!;
    const month = t.date.slice(0, 7); // YYYY-MM
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + pnl);
  });
  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, pnl]) => ({ month, pnl }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Buy vs Sell monthly breakdown
  const monthlyBuySellMap = new Map<string, { buy: number; sell: number }>();
  closed.forEach((t) => {
    const pnl = calcPnL(t)!;
    const month = t.date.slice(0, 7);
    const existing = monthlyBuySellMap.get(month) ?? { buy: 0, sell: 0 };
    if (t.side === "buy") existing.buy += pnl;
    else existing.sell += pnl;
    monthlyBuySellMap.set(month, existing);
  });
  const monthlyBuySell = Array.from(monthlyBuySellMap.entries())
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalPnL,
    todayPnL,
    winRate,
    totalTrades: trades.length,
    closedTrades: closed.length,
    totalVolume,
    wins,
    losses: closed.length - wins,
    equityCurve,
    dailyPnL,
    bestTrade,
    worstTrade,
    avgWin,
    avgLoss,
    profitFactor,
    maxDrawdown,
    symbolPerformance,
    dayOfWeekData,
    monthlyData,
    monthlyBuySell,
    // Buy/Sell breakdown
    buyStats: {
      count: buyClosed.length,
      pnl: buyPnL,
      wins: buyWins,
      losses: buyClosed.length - buyWins,
      winRate: buyWinRate,
      avgPnL: avgBuyPnL,
    },
    sellStats: {
      count: sellClosed.length,
      pnl: sellPnL,
      wins: sellWins,
      losses: sellClosed.length - sellWins,
      winRate: sellWinRate,
      avgPnL: avgSellPnL,
    },
  };
}
