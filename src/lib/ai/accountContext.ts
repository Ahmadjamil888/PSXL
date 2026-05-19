import {
  calcPnL,
  computeHoldings,
  getTradeStats,
  type Holding,
  type Trade as AppTrade,
} from "@/hooks/useTrades";
import type {
  AIAnalysisRequest,
  PortfolioHolding,
  Trade,
} from "@/lib/ai/gemini";

export function toAITrades(trades: AppTrade[]): Trade[] {
  return trades.map((trade) => ({
    id: trade.id,
    symbol: trade.symbol.toUpperCase(),
    type: trade.side.toUpperCase() as "BUY" | "SELL",
    qty: trade.quantity,
    rate: trade.entry_price,
    date: trade.date,
    charges: trade.fees ?? 0,
    pl: calcPnL(trade),
  }));
}

export function toAIHoldings(holdings: Holding[]): PortfolioHolding[] {
  return holdings.map((holding) => ({
    symbol: holding.symbol.toUpperCase(),
    qty: holding.quantity,
    avgCost: holding.avgCost,
    currentPrice: holding.quantity > 0 ? holding.marketValue / holding.quantity : holding.avgCost,
    marketValue: holding.marketValue,
    unrealizedPL: holding.unrealizedPnL,
  }));
}

export function buildBehavioralPatterns(trades: AppTrade[]): AIAnalysisRequest["behavioralPatterns"] {
  const recentTrades = trades.slice(0, 12);
  const revengeCount = recentTrades.filter(
    (trade) => trade.emotion === "revenge" || trade.mistake_tag === "revenge_trade"
  ).length;
  const mistakeCount = recentTrades.filter(
    (trade) => trade.mistake_tag === "overtrading" || trade.mistake_tag === "late_entry" || trade.mistake_tag === "early_exit"
  ).length;
  const emotionalCount = recentTrades.filter(
    (trade) => trade.emotion === "fear" || trade.emotion === "greedy" || trade.emotion === "revenge"
  ).length;
  const ruleBreaks = recentTrades.filter((trade) => trade.rule_followed === false).length;

  let riskManagement: "good" | "fair" | "poor" = "good";
  if (ruleBreaks >= 3 || revengeCount >= 2) {
    riskManagement = "poor";
  } else if (ruleBreaks > 0 || emotionalCount > 0 || mistakeCount > 1) {
    riskManagement = "fair";
  }

  return {
    revengeTrading: revengeCount > 0,
    overtrading: mistakeCount >= 2 || recentTrades.length >= 10,
    emotionalDecisions: emotionalCount > 0,
    riskManagement,
  };
}

export function buildAccountSnapshot(trades: AppTrade[]): AIAnalysisRequest["accountSnapshot"] {
  const holdings = computeHoldings(trades);
  const stats = getTradeStats(trades);
  const realizedPnL = stats.totalPnL;
  const unrealizedPnL = holdings.reduce((sum, holding) => sum + holding.unrealizedPnL, 0);

  const symbolPnL = new Map<string, number>();
  for (const trade of trades) {
    const pnl = calcPnL(trade);
    if (pnl === null) continue;
    const symbol = trade.symbol.toUpperCase();
    symbolPnL.set(symbol, (symbolPnL.get(symbol) ?? 0) + pnl);
  }

  const sortedSymbols = [...symbolPnL.entries()].sort((a, b) => b[1] - a[1]);
  const biggestPosition = holdings[0];
  const recurringMistakes = Array.from(
    new Set(
      trades
        .map((trade) => trade.mistake_tag)
        .filter((tag): tag is NonNullable<AppTrade["mistake_tag"]> => Boolean(tag))
    )
  );

  const disciplineFlags: string[] = [];
  if (stats.winRate < 45 && stats.closedTrades >= 5) {
    disciplineFlags.push("win rate is below 45%");
  }
  if (realizedPnL < 0) {
    disciplineFlags.push("realized P&L is negative");
  }
  if (biggestPosition && biggestPosition.allocation >= 45) {
    disciplineFlags.push(`${biggestPosition.symbol} dominates allocation`);
  }
  if (trades.filter((trade) => trade.rule_followed === false).length >= 2) {
    disciplineFlags.push("multiple trades broke the plan");
  }

  return {
    totalTrades: stats.totalTrades,
    closedTrades: stats.closedTrades,
    openPositions: holdings.length,
    winRate: stats.winRate,
    realizedPnL,
    unrealizedPnL,
    concentrationSymbol: biggestPosition?.symbol,
    concentrationPct: biggestPosition?.allocation,
    bestSymbol: sortedSymbols[0]?.[0],
    worstSymbol: sortedSymbols.at(-1)?.[0],
    recurringMistakes,
    disciplineFlags,
  };
}

export function buildLocalFindings(trades: AppTrade[], holdings: Holding[]) {
  const stats = getTradeStats(trades);
  const findings: Array<{ title: string; detail: string }> = [];

  if (stats.closedTrades >= 5) {
    findings.push({
      title: stats.winRate < 50 ? "Win rate is under pressure" : "Win rate is holding up",
      detail:
        stats.winRate < 50
          ? `${stats.winRate.toFixed(1)}% across ${stats.closedTrades} closed trades. Loss control needs more attention than frequency.`
          : `${stats.winRate.toFixed(1)}% across ${stats.closedTrades} closed trades. Protect process quality before sizing up.`,
    });
  }

  if (holdings[0]) {
    findings.push({
      title: `${holdings[0].symbol} is your biggest position`,
      detail: `${holdings[0].allocation.toFixed(1)}% of open capital sits in one name. Review whether that concentration is intentional.`,
    });
  }

  const recentMistakes = trades.filter((trade) => trade.mistake_tag).slice(0, 4);
  if (recentMistakes.length > 0) {
    findings.push({
      title: "Recent execution mistakes are visible",
      detail: recentMistakes
        .map((trade) => `${trade.symbol}: ${String(trade.mistake_tag).replaceAll("_", " ")}`)
        .join(" | "),
    });
  }

  if (findings.length === 0) {
    findings.push({
      title: "Not enough account history yet",
      detail: "Log a few closed trades with notes and rule tags so Gemini can point out real patterns instead of surface-level guesses.",
    });
  }

  return findings.slice(0, 3);
}
