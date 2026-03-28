import type { Trade } from "@/hooks/useTrades";
import { calcPnL } from "@/hooks/useTrades";

export interface UserSymbolPerformance {
  tradeCount: number;
  closedTrades: number;
  closedPnlSum: number;
  /** Simple average of buy entry prices (informational, not full FIFO) */
  avgBuyPrice: number | null;
  openLotsApprox: boolean;
  /** vs current market: (price - avgBuy) / avgBuy */
  unrealizedVsAvgPct: number | null;
  /** Sum of (qty * entry) for buys minus sells — rough net exposure indicator */
  netSharesHint: number;
}

export function computeUserSymbolPerformance(
  trades: Trade[],
  symbol: string,
  currentPrice: number | null
): UserSymbolPerformance {
  const sym = symbol.toUpperCase();
  const rel = trades.filter((t) => t.symbol.toUpperCase() === sym);
  let closedPnlSum = 0;
  let closedTrades = 0;
  let buyQty = 0;
  let buyCost = 0;
  let sellQty = 0;

  for (const t of rel) {
    const p = calcPnL(t);
    if (p !== null) {
      closedPnlSum += p;
      closedTrades++;
    }
    if (t.side === "buy") {
      buyQty += t.quantity;
      buyCost += t.entry_price * t.quantity;
    } else {
      sellQty += t.quantity;
    }
  }

  const avgBuyPrice = buyQty > 0 ? buyCost / buyQty : null;
  const netSharesHint = buyQty - sellQty;
  const unrealizedVsAvgPct =
    avgBuyPrice != null && currentPrice != null && avgBuyPrice > 0
      ? ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100
      : null;

  return {
    tradeCount: rel.length,
    closedTrades,
    closedPnlSum: Math.round(closedPnlSum * 100) / 100,
    avgBuyPrice: avgBuyPrice != null ? Math.round(avgBuyPrice * 10000) / 10000 : null,
    openLotsApprox: rel.some((t) => t.exit_price == null),
    unrealizedVsAvgPct:
      unrealizedVsAvgPct != null ? Math.round(unrealizedVsAvgPct * 100) / 100 : null,
    netSharesHint,
  };
}
