import { useTrades, getTradeStats, calcPnL, computeHoldings } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import TradeForm from "@/components/TradeForm";
import { BarChart3, HelpCircle, Filter, X, TrendingUp, Package } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid, PieChart, Pie, Legend, RadialBarChart, RadialBar
} from "recharts";
import { useState, useMemo } from "react";

// ── Semantic color palette ───────────────────────────────────────────────────
const COLORS = {
  // Primary palette
  primary: '#10B981',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  // Extended palette for charts
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
  slate: '#64748B',
  // Chart colors array (semantic order)
  chart: [
    '#10B981', // Primary/Green
    '#3B82F6', // Info/Blue
    '#F59E0B', // Warning/Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#64748B', // Slate
    '#22C55E', // Success
  ],
};

// Enhanced tooltip styles
const TT = {
  contentStyle: {
    backgroundColor: '#262626',
    border: '1px solid #3A3A3A',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '12px',
    padding: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
  },
  itemStyle: { color: '#FFFFFF' },
  labelStyle: { color: '#A3A3A3', fontSize: '11px', marginBottom: '4px' },
};

const Card = ({ title, badge, children, delay = 0, span2 = false }: {
  title: string; badge: string; children: React.ReactNode; delay?: number; span2?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`table-container reveal${span2 ? " lg:col-span-2" : ""}`}
    style={{ height: '100%' }}
  >
    <div className="table-header">
      <span className="table-header-title">{title}</span>
      <span className="table-badge">{badge}</span>
    </div>
    {children}
  </motion.div>
);

export default function Dashboard() {
  const { data: trades = [], isLoading } = useTrades();
  const stats = getTradeStats(trades);
  const holdings = useMemo(() => computeHoldings(trades), [trades]);

  const totalCostBasis = holdings.reduce((s, h) => s + h.costBasis, 0);
  const totalMarketValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  const totalUnrealized = totalMarketValue - totalCostBasis;

  // Filter states
  const [symbolFilter, setSymbolFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pnlMin, setPnlMin] = useState("");
  const [pnlMax, setPnlMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrades = useMemo(() => trades.filter((t) => {
    const pnl = calcPnL(t);
    if (symbolFilter && !t.symbol.toLowerCase().includes(symbolFilter.toLowerCase())) return false;
    if (dateFrom && t.date < dateFrom) return false;
    if (dateTo && t.date > dateTo) return false;
    if (pnl !== null) {
      if (pnlMin && pnl < parseFloat(pnlMin)) return false;
      if (pnlMax && pnl > parseFloat(pnlMax)) return false;
    }
    return true;
  }), [trades, symbolFilter, dateFrom, dateTo, pnlMin, pnlMax]);

  const displayedTrades = filteredTrades.slice(0, 10);

  const equityStroke = stats.equityCurve.length === 0 ? '#64748B'
    : stats.totalPnL >= 0 ? COLORS.success : COLORS.danger;

  const getWinRateTip = (w: number) => w >= 60 ? "Excellent! Consistently profitable." : w >= 50 ? "Good progress. Cut losses quickly." : w >= 40 ? "Work on entry timing and risk management." : "Review your strategy.";

  // Allocation pie data
  const allocData = holdings.slice(0, 8).map((h, i) => ({
    name: h.symbol,
    value: parseFloat(h.allocation.toFixed(1)),
    fill: COLORS.chart[i % COLORS.chart.length]
  }));
  if (holdings.length > 8) {
    const rest = holdings.slice(8).reduce((s, h) => s + h.allocation, 0);
    allocData.push({ name: "Others", value: parseFloat(rest.toFixed(1)), fill: '#525252' });
  }

  // Win/loss semantic pie
  const winLossPie = [
    { name: "Wins", value: stats.wins, fill: COLORS.success },
    { name: "Losses", value: stats.losses, fill: COLORS.danger },
    { name: "Open", value: trades.length - stats.closedTrades, fill: COLORS.info },
  ].filter(d => d.value > 0);

  // Symbol P&L chart data
  const symPnlData = stats.symbolPerformance.slice(0, 6).map((s, i) => ({
    ...s,
    fill: s.pnl >= 0 ? COLORS.success : COLORS.danger
  }));

  if (isLoading) return (
    <div className="dashboard-app flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="dashboard-app space-y-6" style={{ color: "var(--text)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="dash-page-kicker">Overview</p>
          <h1 className="dash-page-title">Dashboard</h1>
          <p className="dash-page-desc">Your PSX trading overview and latest activity.</p>
        </div>
        <div className="w-full sm:w-auto sm:shrink-0" style={{ position: "relative" }}>
          <TradeForm />
          <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card" style={{ padding: "20px 22px", overflow: "hidden" }}>
          <span className="stat-label" style={{ color: "var(--text2)" }}>Portfolio P&L</span>
          <span className={`stat-val ${stats.totalPnL >= 0 ? "pos" : "neg"}`}
            style={{ fontSize: "clamp(1.1rem, 3.5vw, 2rem)", wordBreak: "break-all", lineHeight: 1.2 }}>
            {formatCurrency(stats.totalPnL)}
          </span>
          <span className="stat-sub">{stats.closedTrades} closed trades</span>
        </div>
        <div className="stat-card" style={{ padding: "20px 22px", overflow: "hidden" }}>
          <span className="stat-label" style={{ color: "var(--text2)" }}>Today's Profit</span>
          <span className={`stat-val ${stats.todayPnL >= 0 ? "pos" : stats.todayPnL < 0 ? "neg" : ""}`}
            style={{ fontSize: "clamp(1.1rem, 3.5vw, 2rem)", wordBreak: "break-all", lineHeight: 1.2 }}>
            {formatCurrency(stats.todayPnL)}
          </span>
          <span className="stat-sub">Real-time tracking</span>
        </div>
        <div className="stat-card" style={{ padding: "20px 22px", overflow: "hidden" }}>
          <span className="stat-label" style={{ color: "var(--text2)" }}>Win Rate <HelpCircle className="w-3 h-3 ml-1 inline-block" style={{ color: "var(--text3)" }} /></span>
          <span className="stat-val" style={{ fontSize: "clamp(1.1rem, 3.5vw, 2rem)", lineHeight: 1.2 }}>{stats.winRate.toFixed(1)}%</span>
          <span className="stat-sub">{stats.wins}W / {stats.losses}L</span>
        </div>
        <div className="stat-card" style={{ padding: "20px 22px", overflow: "hidden" }}>
          <span className="stat-label" style={{ color: "var(--text2)" }}>Total Trades</span>
          <span className="stat-val" style={{ fontSize: "clamp(1.1rem, 3.5vw, 2rem)", lineHeight: 1.2 }}>{stats.totalTrades}</span>
          <span className="stat-sub">{formatCurrency(stats.totalVolume)} volume</span>
        </div>
      </div>

      {/* ── Holdings Summary ── */}
      {holdings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Package size={14} style={{ color: "var(--text3)" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)" }}>Open Holdings</span>
          </div>
          {/* Holdings summary stat row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {[
              { label: "Positions", val: String(holdings.length), sub: "open" },
              { label: "Cost Basis", val: formatCurrency(totalCostBasis), sub: "invested" },
              { label: "Market Value", val: formatCurrency(totalMarketValue), sub: "current est." },
              { label: "Unrealized P&L", val: formatCurrency(totalUnrealized), sub: totalCostBasis > 0 ? `${((totalUnrealized / totalCostBasis) * 100).toFixed(2)}%` : "—", color: totalUnrealized >= 0 ? COLORS.success : COLORS.danger },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="stat-label">{s.label}</span>
                <span className="stat-val" style={s.color ? { color: s.color } : {}}>{s.val}</span>
                <span className="stat-sub">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* Holdings table */}
          <div className="table-container">
            <div className="table-header">
              <span className="table-header-title">Holdings</span>
              <span className="table-badge">{holdings.length} positions</span>
            </div>
            <div className="table-scroll" style={{ overflowX: "auto" }}>
              <table style={{ fontSize: "14px", minWidth: "700px", width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #2A2A2A" }}>
                    {["Symbol", "Qty", "Avg Cost", "Cost Basis", "Mkt Value*", "Unrealized P&L", "Alloc %"].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 16px",
                          textAlign: h === "Alloc %" || h === "Unrealized P&L" ? "right" : "left",
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: "#737373"
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr
                      key={h.symbol}
                      style={{
                        transition: "background 0.15s ease",
                        cursor: "default",
                        borderBottom: "1px solid #1F1F1F"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#1F1F1F")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#FFFFFF" }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: COLORS.chart[i % COLORS.chart.length],
                            marginRight: "10px"
                          }}
                        />
                        {h.symbol}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
                        {h.quantity.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", color: "#A3A3A3", fontVariantNumeric: "tabular-nums" }}>
                        ₨{h.avgCost.toFixed(2)}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(h.costBasis)}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(h.marketValue)}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            color: h.unrealizedPnL >= 0 ? COLORS.success : COLORS.danger,
                            fontVariantNumeric: "tabular-nums"
                          }}
                        >
                          {h.unrealizedPnL >= 0 ? "+" : ""}{formatCurrency(h.unrealizedPnL)}
                        </span>
                        <br />
                        <span style={{ fontSize: "11px", fontWeight: 400, color: "#737373" }}>
                          {formatPercent(h.unrealizedPct)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                          <div style={{ width: "48px", height: "4px", background: "#1F1F1F", borderRadius: "2px", overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${Math.min(h.allocation, 100)}%`,
                                height: "100%",
                                background: COLORS.chart[i % COLORS.chart.length],
                                borderRadius: "2px"
                              }}
                            />
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
                            {h.allocation.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 16px", borderTop: "1px solid #2A2A2A", background: "#141414" }}>
              <p style={{ fontSize: "11px", color: "#737373" }}>* Market value uses last known trade price as proxy. No live market feed.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Charts row 1: Equity + Daily PnL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Equity Curve" badge="Live" delay={0.2}>
          <div style={{ padding: "20px" }}>
            {stats.equityCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={stats.equityCurve}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={equityStroke} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={equityStroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#737373", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#2A2A2A" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#737373", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#2A2A2A" }}
                    tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`}
                    domain={["auto", "auto"]}
                    tickCount={6}
                  />
                  <Tooltip {...TT} />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke={equityStroke}
                    strokeWidth={2.5}
                    fill="url(#eqGrad)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "14px" }}>
                Log trades to see your equity curve
              </div>
            )}
          </div>
        </Card>

        <Card title="Daily P&L" badge="Live" delay={0.25}>
          <div style={{ padding: "20px" }}>
            {stats.dailyPnL.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.dailyPnL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#737373", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#2A2A2A" }}
                  />
                  <YAxis
                    tick={{ fill: "#737373", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#2A2A2A" }}
                    tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`}
                    tickCount={6}
                  />
                  <Tooltip {...TT} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                  <Bar dataKey="pnl" radius={[3, 3, 0, 0]} barSize={20}>
                    {stats.dailyPnL.map((e, i) => (
                      <Cell key={i} fill={e.pnl >= 0 ? COLORS.success : COLORS.danger} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "14px" }}>
                Log trades to see daily P&L
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Charts row 2: 4 semantic color charts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio Allocation Pie */}
        <Card title="Allocation" badge="Holdings" delay={0.3}>
          <div style={{ padding: "16px", height: "220px" }}>
            {allocData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocData}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip {...TT} formatter={(v: number) => [`${v}%`, "Allocation"]} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ color: "#A3A3A3", fontSize: "10px" }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "13px" }}>No open positions</div>}
          </div>
        </Card>

        {/* Trade Status pie */}
        <Card title="Trade Status" badge="All" delay={0.35}>
          <div style={{ padding: "16px", height: "220px" }}>
            {trades.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossPie}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {winLossPie.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip {...TT} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ color: "#A3A3A3", fontSize: "10px" }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "13px" }}>No trades yet</div>}
          </div>
        </Card>

        {/* Symbol P&L bars with semantic colors */}
        <Card title="Top Symbols" badge="P&L" delay={0.4}>
          <div style={{ padding: "20px", height: "220px" }}>
            {symPnlData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symPnlData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" opacity={0.5} horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="symbol"
                    type="category"
                    tick={{ fill: "#FFFFFF", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip {...TT} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                  <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={20}>
                    {symPnlData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "13px" }}>No symbol data</div>}
          </div>
        </Card>

        {/* Monthly trend */}
        <Card title="Monthly Trend" badge={new Date().getFullYear().toString()} delay={0.45}>
          <div style={{ padding: "20px", height: "220px" }}>
            {stats.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" opacity={0.5} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#737373", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip {...TT} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                  <Bar dataKey="pnl" radius={[3, 3, 0, 0]} barSize={24}>
                    {stats.monthlyData.map((e, i) => (
                      <Cell key={i} fill={e.pnl >= 0 ? COLORS.success : COLORS.danger} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "13px" }}>Monthly data pending</div>}
          </div>
        </Card>
      </div>

      {/* ── Radial allocation chart + Trading days ── */}
      {holdings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Portfolio Allocation" badge="Radial" delay={0.5}>
            <div style={{ padding: "20px", height: "240px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  data={allocData.map((d, i) => ({ ...d, fill: COLORS.chart[i % COLORS.chart.length] }))}
                >
                  <RadialBar
                    dataKey="value"
                    label={{ position: "insideStart", fill: "#FFFFFF", fontSize: 10 }}
                    background={{ fill: "#1F1F1F" }}
                  >
                    {allocData.map((e, i) => <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />)}
                  </RadialBar>
                  <Tooltip {...TT} formatter={(v: number) => [`${v}%`, "Allocation"]} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ color: "#A3A3A3", fontSize: "10px" }}>{v}</span>}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Trading Days" badge="Activity" delay={0.5}>
            <div style={{ padding: "20px", height: "240px" }}>
              {stats.dayOfWeekData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" opacity={0.5} vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#737373", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip {...TT} formatter={(v: number) => [`${v} trades`, "Count"]} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                      {stats.dayOfWeekData.map((_, i) => (
                        <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center" style={{ color: "#A3A3A3", fontSize: "13px" }}>No activity data</div>}
            </div>
          </Card>
        </div>
      )}

      {/* ── Recent Trades ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="table-container reveal"
      >
        <div
          className="table-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="table-header-title">Recent Trades</span>
            <span className="table-badge">Latest</span>
            {filteredTrades.length !== trades.length && (
              <span style={{ fontSize: "12px", color: "#A3A3A3" }}>
                ({filteredTrades.length} of {trades.length})
              </span>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-ghost"
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              border: showFilters ? "1px solid #2A2A2A" : "1px solid transparent",
              borderRadius: "6px",
              background: showFilters ? "#1A1A1A" : "transparent"
            }}
          >
            <Filter className="w-3 h-3" /> Filters
          </button>
        </div>

        {showFilters && (
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #2A2A2A",
              background: "#141414"
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
              {[
                { ph: "Symbol…", val: symbolFilter, set: setSymbolFilter, type: "text" },
                { ph: "From", val: dateFrom, set: setDateFrom, type: "date" },
                { ph: "To", val: dateTo, set: setDateTo, type: "date" },
                { ph: "Min P&L", val: pnlMin, set: setPnlMin, type: "number" },
                { ph: "Max P&L", val: pnlMax, set: setPnlMax, type: "number" },
              ].map((f, i) => (
                <input
                  key={i}
                  type={f.type}
                  placeholder={f.ph}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    fontSize: "13px",
                    background: "#0A0A0A",
                    border: "1px solid #2A2A2A",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10B981"}
                  onBlur={(e) => e.target.style.borderColor = "#2A2A2A"}
                />
              ))}
              <button
                onClick={() => {
                  setSymbolFilter("");
                  setDateFrom("");
                  setDateTo("");
                  setPnlMin("");
                  setPnlMax("");
                }}
                className="btn-ghost"
                style={{
                  padding: "10px 14px",
                  fontSize: "13px",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px"
                }}
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>
        )}

        {displayedTrades.length > 0 ? (
          <div className="table-scroll" style={{ maxHeight: "320px", overflow: "auto" }}>
            <table style={{ fontSize: "14px", minWidth: "600px", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #2A2A2A" }}>
                  {["Date", "Symbol", "Side", "Qty", "Entry", "Exit", "P&L"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 16px",
                        textAlign: i === 6 ? "right" : "left",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#737373"
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedTrades.map((trade) => {
                  const pnl = calcPnL(trade);
                  return (
                    <tr
                      key={trade.id}
                      style={{
                        transition: "background 0.15s ease",
                        cursor: "default",
                        borderBottom: "1px solid #1F1F1F"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#1F1F1F")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ color: "#737373", padding: "16px" }}>{trade.date}</td>
                      <td style={{ padding: "16px", fontWeight: 600, color: "#FFFFFF" }}>{trade.symbol}</td>
                      <td style={{ padding: "16px" }}>
                        <span
                          className={trade.side === "buy" ? "status-tag status-tag-success" : "status-tag status-tag-danger"}
                        >
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "16px", fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: "tabular-nums" }}>
                        {trade.quantity.toLocaleString()}
                      </td>
                      <td style={{ padding: "16px", fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: "tabular-nums" }}>
                        ₨{trade.entry_price}
                      </td>
                      <td style={{ padding: "16px", fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: "tabular-nums" }}>
                        {trade.exit_price ? `₨${trade.exit_price}` : "—"}
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        {pnl !== null ? (
                          <span
                            style={{
                              color: pnl >= 0 ? COLORS.success : COLORS.danger,
                              fontWeight: 700,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "14px",
                              fontVariantNumeric: "tabular-nums"
                            }}
                          >
                            {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}
                          </span>
                        ) : (
                          <span style={{ color: "#737373", fontSize: "12px" }}>Open</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: "#A3A3A3" }}>
            <BarChart3 className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3 }} />
            <p style={{ fontSize: "14px" }}>No trades match your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
