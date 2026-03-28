import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import { useMarketChart } from "@/hooks/useMarketChart";
import { useTrades } from "@/hooks/useTrades";
import { analyzeInvestment } from "@/lib/market/investmentScore";
import { computeUserSymbolPerformance } from "@/lib/market/userSymbolStats";
import type { PSXCompany } from "@/data/psxCompanies";
import { formatCurrency } from "@/lib/psx";
import { Activity, Gauge, LineChart, ShieldAlert, TrendingUp, User } from "lucide-react";

function dailyReturnHistogram(closes: number[]): { bucket: string; count: number }[] {
  const rets: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const a = closes[i - 1];
    const b = closes[i];
    if (a > 0) rets.push(((b - a) / a) * 100);
  }
  const labels = ["≤−2%", "−2~−1", "−1~−0.5", "−0.5~0", "0~0.5", "0.5~1", "1~2", ">2%"];
  const counts = new Array(labels.length).fill(0);
  for (const r of rets) {
    let idx = 7;
    if (r <= -2) idx = 0;
    else if (r <= -1) idx = 1;
    else if (r <= -0.5) idx = 2;
    else if (r <= 0) idx = 3;
    else if (r <= 0.5) idx = 4;
    else if (r <= 1) idx = 5;
    else if (r <= 2) idx = 6;
    counts[idx]++;
  }
  return labels.map((bucket, i) => ({ bucket, count: counts[i] }));
}

const verdictColor: Record<string, string> = {
  favorable: "var(--green)",
  moderate_positive: "var(--green)",
  neutral: "var(--text2)",
  cautious: "var(--text3)",
  unfavorable: "var(--red)",
};

export default function CompanyIntelPanel({ company, onClose }: { company: PSXCompany; onClose?: () => void }) {
  const { data, isLoading, isError } = useMarketChart(company.symbol);
  const { data: trades = [] } = useTrades();

  const analysis = useMemo(() => {
    if (!data?.points.length) return null;
    return analyzeInvestment(data.points);
  }, [data?.points]);

  const chartRows = useMemo(() => {
    if (!data?.points.length) return [];
    return data.points.map((p) => ({
      price: p.close,
      date: new Date(p.t * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    }));
  }, [data?.points]);

  const histo = useMemo(() => {
    if (!data?.points.length) return [];
    return dailyReturnHistogram(data.points.map((p) => p.close));
  }, [data?.points]);

  const radarData = useMemo(() => {
    if (!analysis) return [];
    const d = analysis.dimensions;
    return [
      { metric: "Trend", value: d.trend, full: 100 },
      { metric: "Risk-adj.", value: d.riskAdjusted, full: 100 },
      { metric: "Stability", value: d.stability, full: 100 },
      { metric: "Momentum", value: d.momentum, full: 100 },
    ];
  }, [analysis]);

  const currentPrice = data?.regularMarketPrice ?? data?.points[data.points.length - 1]?.close ?? null;
  const userPerf = useMemo(
    () => computeUserSymbolPerformance(trades, company.symbol, currentPrice),
    [trades, company.symbol, currentPrice]
  );

  const vc = analysis ? verdictColor[analysis.verdict] ?? "var(--text2)" : "var(--text3)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]"
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset" }}
    >
      <div
        className="flex flex-col gap-3 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        style={{ background: "var(--bg2)" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          {company.logo ? (
            <img
              src={company.logo}
              alt=""
              className="h-10 w-10 shrink-0 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <div className="min-w-0">
            <h2 className="truncate font-semibold" style={{ color: "var(--text)", fontSize: "clamp(1rem, 3vw, 1.125rem)" }}>
              {company.name}
            </h2>
            <p className="text-xs" style={{ color: "var(--text3)" }}>
              {company.symbol} · {company.sector}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {data?.source === "live" && (
            <span
              className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--green)" }}
            >
              Live data
            </span>
          )}
          {data?.source === "mock" && (
            <span
              className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text3)" }}
            >
              Demo series
            </span>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[var(--border)] px-3 py-2 text-xs font-medium"
              style={{ color: "var(--text2)" }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--green)] border-t-transparent" />
          </div>
        )}

        {isError && (
          <p className="text-center text-sm" style={{ color: "var(--text2)" }}>
            Could not load market data. Try again later.
          </p>
        )}

        {!isLoading && data && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg2)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
                  Last / ref.
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                  {currentPrice != null ? `₨${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg2)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
                  5d chg. (est.)
                </p>
                <p
                  className="mt-1 font-mono text-lg font-semibold tabular-nums"
                  style={{ color: data.changePct != null && data.changePct >= 0 ? "var(--green)" : "var(--red)" }}
                >
                  {data.changePct != null ? `${data.changePct >= 0 ? "+" : ""}${data.changePct.toFixed(2)}%` : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg2)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
                  Model score
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums" style={{ color: vc }}>
                  {analysis ? analysis.score : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg2)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
                  Verdict
                </p>
                <p className="mt-1 text-sm font-semibold leading-tight" style={{ color: vc }}>
                  {analysis?.label ?? "—"}
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-2 rounded-lg border border-[var(--border)] p-3 text-xs leading-relaxed"
              style={{ background: "rgba(239, 68, 68, 0.06)", color: "var(--text2)" }}
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--red)" }} />
              <span>
                <strong style={{ color: "var(--text)" }}>Not financial advice.</strong> Scores use price history only (return,
                volatility, drawdown, momentum). They do not include fundamentals, news, or liquidity. For education and
                journaling — confirm with your own research.
              </span>
            </div>

            {analysis && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--text2)" }}>
                {analysis.summary}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg)" }}>
                <div className="mb-2 flex items-center gap-2">
                  <LineChart className="h-4 w-4" style={{ color: "var(--green)" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>
                    Price (1y daily)
                  </span>
                </div>
                <div className="h-[220px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartRows}>
                      <defs>
                        <linearGradient id="intelPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                      <XAxis dataKey="date" tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: "var(--text3)", fontSize: 10 }}
                        tickLine={false}
                        tickFormatter={(v) => `₨${(v / 1000).toFixed(1)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "var(--text)",
                        }}
                        formatter={(v: number) => [`₨${v.toFixed(2)}`, "Close"]}
                      />
                      <Area type="monotone" dataKey="price" stroke="var(--chart-line)" fill="url(#intelPrice)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg)" }}>
                <div className="mb-2 flex items-center gap-2">
                  <Gauge className="h-4 w-4" style={{ color: "var(--green)" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>
                    Signal shape (0–100)
                  </span>
                </div>
                <div className="h-[220px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--text3)", fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--text3)", fontSize: 9 }} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="var(--green)"
                        fill="var(--green)"
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg)" }}>
                <div className="mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" style={{ color: "var(--green)" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>
                    Daily return distribution (%)
                  </span>
                </div>
                <div className="h-[200px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={histo}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.35} vertical={false} />
                      <XAxis dataKey="bucket" tick={{ fill: "var(--text3)", fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={56} />
                      <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {histo.map((_, i) => (
                          <Cell key={i} fill="var(--chart-volume)" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border)] p-3" style={{ background: "var(--bg)" }}>
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" style={{ color: "var(--green)" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>
                    Your journal vs price
                  </span>
                </div>
                {userPerf.tradeCount === 0 ? (
                  <p className="py-8 text-center text-sm" style={{ color: "var(--text3)" }}>
                    No trades for {company.symbol} in your ledger yet.
                  </p>
                ) : (
                  <div className="space-y-3 text-sm" style={{ color: "var(--text2)" }}>
                    <div className="flex justify-between gap-2">
                      <span>Trades logged</span>
                      <span className="font-mono font-medium tabular-nums" style={{ color: "var(--text)" }}>
                        {userPerf.tradeCount}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Closed P&amp;L (sum)</span>
                      <span
                        className="font-mono font-semibold tabular-nums"
                        style={{ color: userPerf.closedPnlSum >= 0 ? "var(--green)" : "var(--red)" }}
                      >
                        {formatCurrency(userPerf.closedPnlSum)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Avg. buy (approx.)</span>
                      <span className="font-mono tabular-nums" style={{ color: "var(--text)" }}>
                        {userPerf.avgBuyPrice != null ? `₨${userPerf.avgBuyPrice.toFixed(2)}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Vs last price</span>
                      <span
                        className="font-mono font-semibold tabular-nums"
                        style={{
                          color:
                            userPerf.unrealizedVsAvgPct == null
                              ? "var(--text3)"
                              : userPerf.unrealizedVsAvgPct >= 0
                                ? "var(--green)"
                                : "var(--red)",
                        }}
                      >
                        {userPerf.unrealizedVsAvgPct != null
                          ? `${userPerf.unrealizedVsAvgPct >= 0 ? "+" : ""}${userPerf.unrealizedVsAvgPct.toFixed(2)}%`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] leading-snug" style={{ color: "var(--text3)" }}>
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Net shares (buys − sells): {userPerf.netSharesHint}. Open positions:{" "}
                      {userPerf.openLotsApprox ? "yes (check journal)" : "likely flat / closed"}.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analysis && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { k: "1y return", v: analysis.metrics.return1yPct, pct: true },
                  { k: "Ann. vol.", v: analysis.metrics.volatilityAnnualPct, pct: true },
                  { k: "Sharpe-like", v: analysis.metrics.sharpeLike, pct: false },
                  { k: "Max DD", v: analysis.metrics.maxDrawdownPct, pct: true },
                  { k: "Mom. 20d", v: analysis.metrics.momentum20dPct, pct: true },
                ].map((row) => (
                  <div key={row.k} className="rounded-md border border-[var(--border)] px-2 py-2 text-center" style={{ background: "var(--bg2)" }}>
                    <p className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: "var(--text3)" }}>
                      {row.k}
                    </p>
                    <p className="mt-1 font-mono text-xs font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                      {row.v == null
                        ? "—"
                        : row.pct
                          ? `${row.v >= 0 ? "+" : ""}${row.v.toFixed(1)}%`
                          : row.v.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
