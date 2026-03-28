import type { ChartPoint } from "./mockSeries";

export type InvestmentVerdict =
  | "favorable"
  | "moderate_positive"
  | "neutral"
  | "cautious"
  | "unfavorable";

export interface InvestmentAnalysis {
  score: number;
  verdict: InvestmentVerdict;
  label: string;
  summary: string;
  metrics: {
    return1yPct: number | null;
    volatilityAnnualPct: number | null;
    sharpeLike: number | null;
    maxDrawdownPct: number | null;
    momentum20dPct: number | null;
  };
  /** 0–100 sub-scores for radar chart */
  dimensions: {
    trend: number;
    riskAdjusted: number;
    stability: number;
    momentum: number;
  };
}

function dailyReturns(closes: number[]): number[] {
  const r: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const a = closes[i - 1];
    const b = closes[i];
    if (a > 0) r.push((b - a) / a);
  }
  return r;
}

function mean(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(mean(arr.map((x) => (x - m) ** 2)));
}

function maxDrawdown(closes: number[]): number {
  if (closes.length < 2) return 0;
  let peak = closes[0];
  let maxDd = 0;
  for (const c of closes) {
    if (c > peak) peak = c;
    const dd = peak > 0 ? (c - peak) / peak : 0;
    if (dd < maxDd) maxDd = dd;
  }
  return maxDd * 100;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function verdictFromScore(score: number): { verdict: InvestmentVerdict; label: string } {
  if (score >= 72) return { verdict: "favorable", label: "Favorable" };
  if (score >= 58) return { verdict: "moderate_positive", label: "Moderate — positive" };
  if (score >= 45) return { verdict: "neutral", label: "Neutral" };
  if (score >= 30) return { verdict: "cautious", label: "Cautious" };
  return { verdict: "unfavorable", label: "Unfavorable" };
}

/**
 * Heuristic model from price history only — not fundamental analysis.
 * Educational; not financial advice.
 */
export function analyzeInvestment(points: ChartPoint[]): InvestmentAnalysis {
  const closes = points.map((p) => p.close).filter((c) => Number.isFinite(c) && c > 0);
  if (closes.length < 30) {
    return {
      score: 50,
      verdict: "neutral",
      label: "Insufficient data",
      summary: "Need more trading days to score risk/return reliably.",
      metrics: {
        return1yPct: null,
        volatilityAnnualPct: null,
        sharpeLike: null,
        maxDrawdownPct: null,
        momentum20dPct: null,
      },
      dimensions: { trend: 50, riskAdjusted: 50, stability: 50, momentum: 50 },
    };
  }

  const first = closes[0];
  const last = closes[closes.length - 1];
  const return1yPct = first > 0 ? ((last - first) / first) * 100 : 0;

  const rets = dailyReturns(closes);
  const volDaily = stdDev(rets);
  const volatilityAnnualPct = volDaily * Math.sqrt(252) * 100;

  const meanDaily = mean(rets);
  const sharpeLike =
    volDaily > 1e-8 ? (meanDaily / volDaily) * Math.sqrt(252) : meanDaily >= 0 ? 2 : -2;

  const mdd = maxDrawdown(closes);

  const n = closes.length;
  const win20 = Math.max(0, n - 20);
  const prior20 = Math.max(0, n - 40);
  const slice20 = closes.slice(win20);
  const prev20 = closes.slice(prior20, win20);
  let momentum20dPct = 0;
  if (slice20.length >= 2 && prev20.length >= 2) {
    const a = prev20[0] > 0 ? (prev20[prev20.length - 1] - prev20[0]) / prev20[0] : 0;
    const b = slice20[0] > 0 ? (slice20[slice20.length - 1] - slice20[0]) / slice20[0] : 0;
    momentum20dPct = (b - a) * 100;
  }

  // Dimension scores 0–100 (smooth, interpretable)
  const trendScore = clamp(50 + return1yPct * 1.1, 0, 100);
  const riskAdj = sharpeLike;
  const riskAdjScore = clamp(50 + riskAdj * 18, 0, 100);
  const stabilityScore = clamp(100 - Math.min(80, volatilityAnnualPct * 0.9), 0, 100);
  const momentumScore = clamp(50 + momentum20dPct * 2.5, 0, 100);

  // Drawdown penalty blended into composite
  const ddPenalty = clamp(40 + mdd * 1.2, 0, 100);

  const score = clamp(
    trendScore * 0.28 +
      riskAdjScore * 0.22 +
      stabilityScore * 0.2 +
      momentumScore * 0.18 +
      ddPenalty * 0.12,
    0,
    100
  );

  const { verdict, label } = verdictFromScore(score);

  const summary = buildSummary({
    return1yPct,
    volatilityAnnualPct,
    sharpeLike,
    maxDrawdownPct: mdd,
    momentum20dPct,
    label,
  });

  return {
    score: Math.round(score * 10) / 10,
    verdict,
    label,
    summary,
    metrics: {
      return1yPct: Math.round(return1yPct * 100) / 100,
      volatilityAnnualPct: Math.round(volatilityAnnualPct * 100) / 100,
      sharpeLike: Math.round(sharpeLike * 100) / 100,
      maxDrawdownPct: Math.round(mdd * 100) / 100,
      momentum20dPct: Math.round(momentum20dPct * 100) / 100,
    },
    dimensions: {
      trend: Math.round(trendScore),
      riskAdjusted: Math.round(riskAdjScore),
      stability: Math.round(stabilityScore),
      momentum: Math.round(momentumScore),
    },
  };
}

function buildSummary(m: {
  return1yPct: number;
  volatilityAnnualPct: number;
  sharpeLike: number;
  maxDrawdownPct: number;
  momentum20dPct: number;
  label: string;
}): string {
  const parts = [
    `Approx. 1y return ${m.return1yPct >= 0 ? "+" : ""}${m.return1yPct.toFixed(1)}%.`,
    `Annualised volatility ~${m.volatilityAnnualPct.toFixed(1)}%.`,
    `Risk-adjusted momentum (Sharpe-like) ${m.sharpeLike.toFixed(2)}.`,
    `Max drawdown ~${m.maxDrawdownPct.toFixed(1)}%.`,
    `Short-term momentum vs prior window ${m.momentum20dPct >= 0 ? "+" : ""}${m.momentum20dPct.toFixed(1)}%.`,
  ];
  return `${parts.join(" ")} Signal: ${m.label} — heuristic only, not advice.`;
}
