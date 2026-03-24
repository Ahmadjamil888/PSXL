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

export function useTrades(limit: number = 1000) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["trades", user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
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

export function useTradesCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["trades-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("trades")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
export function calcPnL(trade: Trade): number | null {
  if (!trade.exit_price) return null;
  const gross = trade.side === "buy"
    ? (trade.exit_price - trade.entry_price) * trade.quantity
    : (trade.entry_price - trade.exit_price) * trade.quantity;
  return gross - (trade.fees ?? 0);
}

export function calcPnLPercent(trade: Trade): number | null {
  if (!trade.exit_price) return null;
  const pnl = calcPnL(trade);
  if (pnl === null) return null;
  return (pnl / (trade.entry_price * trade.quantity)) * 100;
}

export function getTradeStats(trades: Trade[]) {
  const closed = trades.filter((t) => t.exit_price != null);
  const pnls = closed.map((t) => calcPnL(t)!);
  const totalPnL = pnls.reduce((sum, p) => sum + p, 0);
  const wins = pnls.filter((p) => p > 0).length;
  const winRate = closed.length > 0 ? (wins / closed.length) * 100 : 0;
  const totalVolume = trades.reduce((sum, t) => sum + t.entry_price * t.quantity, 0);

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
  };
}
