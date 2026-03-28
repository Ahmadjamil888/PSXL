import { useTrades, getTradeStats, calcPnL } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, CartesianGrid, LineChart, Line, Legend,
  Scatter, ScatterChart, ZAxis, ReferenceLine
} from "recharts";
import { BarChart3 } from "lucide-react";

const CARD = "table-container reveal";
const TH = "table-header";

function ChartCard({ title, badge, delay = 0, span2 = false, children }: {
  title: string; badge: string; delay?: number; span2?: boolean; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${CARD}${span2 ? " lg:col-span-2" : ""}`}
    >
      <div className={TH}>
        <span className="table-header-title">{title}</span>
        <span className="table-badge">{badge}</span>
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </motion.div>
  );
}

const tooltipStyle = {
  contentStyle: { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontSize: "12px" },
  itemStyle: { color: "var(--text)" },
  labelStyle: { color: "var(--text)" },
};

export default function Analytics() {
  const { data: trades = [], isLoading } = useTrades();
  const stats = getTradeStats(trades);

  if (isLoading) {
    return (
      <div className="dashboard-app flex min-h-[40vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Symbol performance with buy/sell split
  const symbolMap = new Map<string, { pnl: number; count: number; buy: number; sell: number }>();
  trades.forEach((t) => {
    const pnl = calcPnL(t);
    if (pnl === null) return;
    const e = symbolMap.get(t.symbol) ?? { pnl: 0, count: 0, buy: 0, sell: 0 };
    e.pnl += pnl;
    e.count++;
    if (t.side === "buy") e.buy += pnl; else e.sell += pnl;
    symbolMap.set(t.symbol, e);
  });
  const symbolPerf = Array.from(symbolMap.entries())
    .map(([symbol, d]) => ({ symbol, ...d }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 10);

  const equityStroke = stats.equityCurve.length === 0 ? "var(--chart-line)"
    : stats.totalPnL >= 0 ? "var(--green)" : "var(--red)";

  // Day of week with buy/sell pnl
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dowMap = new Map<string, { trades: number; buy: number; sell: number }>();
  trades.forEach((t) => {
    const pnl = calcPnL(t);
    if (pnl === null) return;
    const day = days[new Date(t.date).getDay()];
    const e = dowMap.get(day) ?? { trades: 0, buy: 0, sell: 0 };
    e.trades++;
    if (t.side === "buy") e.buy += pnl; else e.sell += pnl;
    dowMap.set(day, e);
  });
  const dayOfWeekData = days.filter(d => dowMap.has(d)).map(day => ({ day, ...dowMap.get(day)! }));

  // Streak analysis
  const streakData: { type: string; length: number }[] = [];
  let cur = { type: "", length: 0 };
  trades.filter(t => calcPnL(t) !== null).forEach((t) => {
    const type = calcPnL(t)! >= 0 ? "Win" : "Loss";
    if (cur.type === type) { cur.length++; }
    else { if (cur.type) streakData.push({ ...cur }); cur = { type, length: 1 }; }
  });
  if (cur.type) streakData.push({ ...cur });
  const streakCounts = ["1", "2-3", "4+"].map(s => ({
    streak: s,
    wins: streakData.filter(x => x.type === "Win" && (s === "1" ? x.length === 1 : s === "2-3" ? x.length >= 2 && x.length <= 3 : x.length >= 4)).length,
    losses: streakData.filter(x => x.type === "Loss" && (s === "1" ? x.length === 1 : s === "2-3" ? x.length >= 2 && x.length <= 3 : x.length >= 4)).length,
  }));

  // Risk/reward scatter
  const scatterData = trades.filter(t => calcPnL(t) !== null).map((t, i) => {
    const pnl = calcPnL(t)!;
    const risk = Math.abs(t.entry_price * 0.02) * t.quantity;
    const reward = Math.abs((t.exit_price! - t.entry_price) * t.quantity);
    return { id: i, risk: risk || Math.abs(pnl) * 0.5, reward: reward || Math.abs(pnl), pnl, symbol: t.symbol, side: t.side };
  }).slice(0, 50);

  const hasData = trades.length > 0 && stats.closedTrades > 0;

  const statBox = (label: string, val: string, color?: string) => (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-val" style={color ? { color } : {}}>{val}</div>
    </div>
  );

  return (
    <div className="dashboard-app space-y-5" style={{ color: "var(--text)" }}>
      <div>
        <p className="dash-page-kicker">Insights</p>
        <h1 className="dash-page-title">Analytics</h1>
        <p className="dash-page-desc">Deep insights into your trading performance.</p>
      </div>

      {!hasData ? (
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] py-16 text-center" style={{ color: "var(--text2)" }}>
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No data yet</p>
          <p className="text-sm mt-1">Log some closed trades to unlock analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

          {/* ── Buy vs Sell Summary ── */}
          <ChartCard title="Buy vs Sell Breakdown" badge="Side" delay={0} span2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {[
                { label: "BUY", s: stats.buyStats, color: "var(--green)" },
                { label: "SELL", s: stats.sellStats, color: "var(--red)" },
              ].map(({ label, s, color }) => (
                <div key={label} style={{ background: "var(--bg2)", borderRadius: "8px", padding: "16px", border: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "var(--text3)", marginBottom: "12px" }}>{label} TRADES</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {[
                      ["Closed", s.count],
                      ["Win Rate", `${s.winRate.toFixed(1)}%`],
                      ["Total P&L", formatCurrency(s.pnl)],
                      ["Avg P&L", formatCurrency(s.avgPnL)],
                      ["Wins", s.wins],
                      ["Losses", s.losses],
                    ].map(([k, v]) => (
                      <div key={String(k)}>
                        <p style={{ fontSize: "10px", color: "var(--text3)", marginBottom: "2px" }}>{k}</p>
                        <p style={{ fontSize: "13px", fontWeight: 600, fontFamily: "monospace", color: String(k).includes("P&L") ? (Number(s.pnl) >= 0 ? color : "var(--red)") : "var(--text)" }}>{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* ── Equity Curve ── */}
          <ChartCard title="Equity Curve" badge="Live" delay={0.05}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.equityCurve}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={equityStroke} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={equityStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`} domain={["auto", "auto"]} tickCount={6} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Equity"]} />
                <Area type="monotone" dataKey="equity" stroke={equityStroke} fill="url(#eqGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Win/Loss Pie ── */}
          <ChartCard title="Win vs Loss" badge="Stats" delay={0.1}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[{ name: "Wins", value: stats.wins, fill: "var(--green)" }, { name: "Losses", value: stats.losses, fill: "var(--red)" }]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  <Cell fill="var(--green)" />
                  <Cell fill="var(--red)" />
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ background: "var(--green)" }} /><span style={{ fontSize: "12px", color: "var(--text2)" }}>Wins ({stats.wins})</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ background: "var(--red)" }} /><span style={{ fontSize: "12px", color: "var(--text2)" }}>Losses ({stats.losses})</span></div>
            </div>
          </ChartCard>

          {/* ── Monthly Buy vs Sell ── */}
          <ChartCard title="Monthly Buy vs Sell P&L" badge="Side Split" delay={0.15} span2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthlyBuySell}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [formatCurrency(v)]} />
                <Legend iconType="circle" formatter={(v) => <span style={{ color: "var(--text2)", fontSize: "11px" }}>{v}</span>} />
                <Bar dataKey="buy" name="Buy P&L" fill="var(--green)" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="sell" name="Sell P&L" fill="var(--red)" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Monthly Performance ── */}
          <ChartCard title="Monthly Performance" badge="P&L" delay={0.2}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                  {stats.monthlyData.map((e, i) => <Cell key={i} fill={e.pnl >= 0 ? "var(--green)" : "var(--red)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Symbol Performance ── */}
          <ChartCard title="Top Symbols" badge="Performance" delay={0.25}>
            <div style={{ maxHeight: "240px", overflow: "auto" }}>
              {symbolPerf.map((s) => (
                <div key={s.symbol} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 500, fontSize: "12px", color: "var(--text)" }}>{s.symbol}</span>
                    <span style={{ fontSize: "10px", color: "var(--text3)" }}>{s.count} trades</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "12px", color: s.pnl >= 0 ? "var(--green)" : "var(--red)" }}>{formatCurrency(s.pnl)}</p>
                    <p style={{ fontSize: "10px", color: "var(--text3)" }}>B: {formatCurrency(s.buy)} · S: {formatCurrency(s.sell)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* ── Advanced Stats Summary ── */}
          <ChartCard title="Advanced Statistics" badge="Metrics" delay={0.3} span2>
            <div className="metrics-grid">
              {statBox("Best Trade", formatCurrency(stats.bestTrade), "var(--green)")}
              {statBox("Worst Trade", formatCurrency(stats.worstTrade), "var(--red)")}
              {statBox("Avg Win", formatCurrency(stats.avgWin), "var(--green)")}
              {statBox("Avg Loss", formatCurrency(stats.avgLoss), "var(--red)")}
              {statBox("Profit Factor", stats.profitFactor > 0 ? stats.profitFactor.toFixed(2) : "—", stats.profitFactor >= 1 ? "var(--green)" : "var(--red)")}
              {statBox("Max Drawdown", formatCurrency(stats.maxDrawdown), "var(--red)")}
              {statBox("Avg P&L / Trade", stats.closedTrades > 0 ? formatCurrency(stats.totalPnL / stats.closedTrades) : "—", stats.totalPnL >= 0 ? "var(--green)" : "var(--red)")}
              {statBox("Total Volume", formatCurrency(stats.totalVolume))}
            </div>
          </ChartCard>

          {/* ── Day of Week (Buy vs Sell) ── */}
          <ChartCard title="Trading Days — Buy vs Sell" badge="Activity" delay={0.35}>
            {dayOfWeekData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "var(--text3)", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [formatCurrency(v)]} />
                  <Legend iconType="circle" formatter={(v) => <span style={{ color: "var(--text2)", fontSize: "10px" }}>{v}</span>} />
                  <Bar dataKey="buy" name="Buy P&L" fill="var(--green)" radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Bar dataKey="sell" name="Sell P&L" fill="var(--red)" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[180px] flex items-center justify-center" style={{ color: "var(--text2)", fontSize: "13px" }}>No day-of-week data</div>}
          </ChartCard>

          {/* ── Streak Analysis ── */}
          <ChartCard title="Streak Analysis" badge="Consecutive" delay={0.4}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={streakCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="streak" tick={{ fill: "var(--text3)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="wins" fill="var(--green)" radius={[4, 4, 0, 0]} opacity={0.85} name="Win Streaks" />
                <Bar dataKey="losses" fill="var(--red)" radius={[4, 4, 0, 0]} opacity={0.85} name="Loss Streaks" />
                <Legend iconType="circle" formatter={(v) => <span style={{ color: "var(--text2)", fontSize: "10px" }}>{v}</span>} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Risk/Reward Scatter ── */}
          <ChartCard title="Risk vs Reward" badge="Analysis" delay={0.45} span2>
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis type="number" dataKey="risk" name="Risk" tick={{ fill: "var(--text3)", fontSize: 10 }} tickFormatter={(v) => `₨${v.toFixed(0)}`} label={{ value: "Risk (₨)", position: "bottom", fill: "var(--text3)", fontSize: 10 }} />
                  <YAxis type="number" dataKey="reward" name="Reward" tick={{ fill: "var(--text3)", fontSize: 10 }} tickFormatter={(v) => `₨${v.toFixed(0)}`} label={{ value: "Reward (₨)", angle: -90, position: "left", fill: "var(--text3)", fontSize: 10 }} />
                  <ZAxis type="number" dataKey="pnl" range={[50, 400]} />
                  <Tooltip {...tooltipStyle} formatter={(v: any, name: string) => [`₨${Number(v).toFixed(2)}`, name]} />
                  <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
                  <Scatter name="Buy" data={scatterData.filter(d => d.side === "buy")} fill="var(--green)" fillOpacity={0.65} />
                  <Scatter name="Sell" data={scatterData.filter(d => d.side === "sell")} fill="var(--red)" fillOpacity={0.65} />
                  <Legend iconType="circle" formatter={(v) => <span style={{ color: "var(--text2)", fontSize: "11px" }}>{v}</span>} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : <div className="h-[220px] flex items-center justify-center" style={{ color: "var(--text2)", fontSize: "13px" }}>Log trades to see risk/reward analysis</div>}
          </ChartCard>

          {/* ── Cumulative Returns ── */}
          <ChartCard title="Cumulative Returns" badge="All Time" delay={0.5} span2>
            {stats.equityCurve.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Cumulative P&L"]} />
                  <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="equity" stroke={equityStroke} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="h-[200px] flex items-center justify-center" style={{ color: "var(--text2)", fontSize: "13px" }}>Log more trades to see cumulative returns</div>}
          </ChartCard>

        </div>
      )}
    </div>
  );
}
