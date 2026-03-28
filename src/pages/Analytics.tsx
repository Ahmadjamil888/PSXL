import { useTrades, getTradeStats, calcPnL } from "@/hooks/useTrades";
import { formatCurrency } from "@/lib/psx";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, CartesianGrid, LineChart, Line, Legend,
  Scatter, ScatterChart, ZAxis, ReferenceLine
} from "recharts";
import { BarChart3 } from "lucide-react";

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

  // Symbol performance
  const symbolMap = new Map<string, { pnl: number; count: number }>();
  trades.forEach((t) => {
    const pnl = calcPnL(t);
    if (pnl === null) return;
    const existing = symbolMap.get(t.symbol) ?? { pnl: 0, count: 0 };
    symbolMap.set(t.symbol, { pnl: existing.pnl + pnl, count: existing.count + 1 });
  });
  const symbolPerf = Array.from(symbolMap.entries())
    .map(([symbol, data]) => ({ symbol, ...data }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 10);

  const winLossData = [
    { name: "Wins", value: stats.wins, fill: "var(--green)" },
    { name: "Losses", value: stats.losses, fill: "var(--red)" },
  ];

  const equityStroke =
    stats.equityCurve.length === 0
      ? "var(--chart-line)"
      : stats.totalPnL >= 0
        ? "var(--green)"
        : "var(--red)";

  // Monthly performance
  const monthlyMap = new Map<string, number>();
  trades.forEach((t) => {
    const pnl = calcPnL(t);
    if (pnl === null) return;
    const month = t.date.slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + pnl);
  });
  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, pnl]) => ({ month, pnl }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Day of week analysis
  const dayOfWeekMap = new Map<string, { trades: number; pnl: number }>();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  trades.forEach((t) => {
    const pnl = calcPnL(t);
    if (pnl === null) return;
    const date = new Date(t.date);
    const day = days[date.getDay()];
    const existing = dayOfWeekMap.get(day) ?? { trades: 0, pnl: 0 };
    dayOfWeekMap.set(day, { trades: existing.trades + 1, pnl: existing.pnl + pnl });
  });
  const dayOfWeekData = days
    .filter(d => dayOfWeekMap.has(d))
    .map(day => ({ day, ...dayOfWeekMap.get(day)! }));

  // Risk/Reward scatter data
  const tradeScatterData = trades
    .filter(t => calcPnL(t) !== null)
    .map((t, i) => {
      const pnl = calcPnL(t)!;
      const entry = t.entry_price;
      const exit = t.exit_price || entry;
      const risk = Math.abs(entry - (entry * 0.98));
      const reward = Math.abs(exit - entry);
      return {
        id: i,
        risk: risk > 0 ? risk : Math.abs(pnl) * 0.5,
        reward: reward > 0 ? reward : Math.abs(pnl),
        pnl,
        symbol: t.symbol
      };
    })
    .slice(0, 50);

  // Consecutive wins/losses analysis
  let streakData: { type: string; length: number }[] = [];
  let currentStreak = { type: '', length: 0 };
  trades
    .filter(t => calcPnL(t) !== null)
    .forEach((t) => {
      const pnl = calcPnL(t)!;
      const type = pnl >= 0 ? 'Win' : 'Loss';
      if (currentStreak.type === type) {
        currentStreak.length++;
      } else {
        if (currentStreak.type) streakData.push({ ...currentStreak });
        currentStreak = { type, length: 1 };
      }
    });
  if (currentStreak.type) streakData.push({ ...currentStreak });
  const streakCounts = [
    { streak: '1', wins: streakData.filter(s => s.type === 'Win' && s.length === 1).length, losses: streakData.filter(s => s.type === 'Loss' && s.length === 1).length },
    { streak: '2-3', wins: streakData.filter(s => s.type === 'Win' && s.length >= 2 && s.length <= 3).length, losses: streakData.filter(s => s.type === 'Loss' && s.length >= 2 && s.length <= 3).length },
    { streak: '4+', wins: streakData.filter(s => s.type === 'Win' && s.length >= 4).length, losses: streakData.filter(s => s.type === 'Loss' && s.length >= 4).length },
  ];

  const hasData = trades.length > 0 && stats.closedTrades > 0;

  return (
    <div className="dashboard-app space-y-5" style={{ color: "var(--text)" }}>
      <div>
        <p className="dash-page-kicker">Insights</p>
        <h1 className="dash-page-title">Analytics</h1>
        <p className="dash-page-desc">Deep insights into your trading — charts scale on small screens.</p>
      </div>

      {!hasData ? (
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] py-16 text-center" style={{ color: "var(--text2)" }}>
          <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ opacity: '0.2' }} />
          <p className="text-lg font-medium">No data yet</p>
          <p className="text-sm mt-1">Log some closed trades to unlock analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Equity Curve - Compact with gridlines */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Equity Curve</span>
              <span className="table-badge">Live</span>
            </div>
            <div style={{ padding: '16px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stats.equityCurve}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={equityStroke} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={equityStroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                    tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`}
                    domain={['auto', 'auto']}
                    tickCount={6}
                  />
                  <Tooltip contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px', 
                    color: 'var(--text)',
                    fontSize: '12px'
                  }} itemStyle={{ color: 'var(--text)' }} labelStyle={{ color: 'var(--text)' }} formatter={(v: number) => [formatCurrency(v), "Equity"]} />
                  <Area type="monotone" dataKey="equity" stroke={equityStroke} fill="url(#eqGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Win/Loss Pie */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Win vs Loss</span>
              <span className="table-badge">Stats</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }} itemStyle={{ color: 'var(--text)' }} labelStyle={{ color: 'var(--text)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: "var(--green)" }} />
                  <span style={{ fontSize: "12px", color: "var(--text2)" }}>Wins ({stats.wins})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: "var(--red)" }} />
                  <span style={{ fontSize: "12px", color: "var(--text2)" }}>Losses ({stats.losses})</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Monthly Performance */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Monthly Performance</span>
              <span className="table-badge">P&L</span>
            </div>
            <div style={{ padding: '16px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                  <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px', 
                    color: 'var(--text)',
                    fontSize: '12px'
                  }} itemStyle={{ color: 'var(--text)' }} labelStyle={{ color: 'var(--text)' }} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                  <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={index} fill={entry.pnl >= 0 ? "var(--green)" : "var(--red)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Symbol Performance */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Top Symbols</span>
              <span className="table-badge">Performance</span>
            </div>
            <div style={{ padding: '16px', maxHeight: '240px', overflow: 'auto' }}>
              <div className="space-y-2">
                {symbolPerf.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between" style={{ 
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <div className="flex items-center gap-2">
                      <span style={{ 
                        fontFamily: 'monospace',
                        fontWeight: '500',
                        fontSize: '12px',
                        color: 'var(--text)'
                      }}>{s.symbol}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{s.count} trades</span>
                    </div>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      fontSize: '12px',
                      color: s.pnl >= 0 ? 'var(--green)' : 'var(--red)'
                    }}>
                      {formatCurrency(s.pnl)}
                    </span>
                  </div>
                ))}
                {symbolPerf.length === 0 && (
                  <p style={{ fontSize: '12px', color: 'var(--text2)', textAlign: 'center', padding: '16px 0' }}>
                    No symbol data yet
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="table-container reveal lg:col-span-2">
            <div className="table-header">
              <span className="table-header-title">Performance Summary</span>
              <span className="table-badge">Metrics</span>
            </div>
            <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Best Trade</div>
                  <div className="metric-val pos">{formatCurrency(stats.bestTrade)}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Worst Trade</div>
                  <div className="metric-val neg">{formatCurrency(stats.worstTrade)}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total Volume</div>
                  <div className="metric-val">{formatCurrency(stats.totalVolume)}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Avg P&L/Trade</div>
                  <div className={`metric-val ${stats.closedTrades > 0 && stats.totalPnL / stats.closedTrades >= 0 ? 'pos' : 'neg'}`}>
                    {stats.closedTrades > 0 ? formatCurrency(stats.totalPnL / stats.closedTrades) : "—"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Day of Week Analysis */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Trading Days</span>
              <span className="table-badge">Activity</span>
            </div>
            <div style={{ padding: '16px' }}>
              {dayOfWeekData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" tick={{ fill: 'var(--text3)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }} itemStyle={{ color: 'var(--text)' }} labelStyle={{ color: 'var(--text)' }} />
                    <Bar yAxisId="left" dataKey="trades" fill="var(--chart-volume)" radius={[4, 4, 0, 0]} name="Trades" />
                    <Line yAxisId="right" type="monotone" dataKey="pnl" stroke="var(--green)" strokeWidth={2} dot={{ r: 3 }} name="P&L" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                  No day-of-week data
                </div>
              )}
            </div>
          </motion.div>

          {/* Win/Loss Streak Analysis */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Streak Analysis</span>
              <span className="table-badge">Consecutive</span>
            </div>
            <div style={{ padding: '16px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={streakCounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis dataKey="streak" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px', 
                    color: 'var(--text)',
                    fontSize: '12px'
                  }} itemStyle={{ color: 'var(--text)' }} labelStyle={{ color: 'var(--text)' }} />
                  <Bar dataKey="wins" fill="var(--green)" radius={[4, 4, 0, 0]} opacity={0.85} name="Win Streaks" />
                  <Bar dataKey="losses" fill="var(--red)" radius={[4, 4, 0, 0]} opacity={0.85} name="Loss Streaks" />
                  <Legend iconType="circle" formatter={(value) => <span style={{ color: 'var(--text2)', fontSize: '10px' }}>{value}</span>} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Risk/Reward Scatter Plot */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="table-container reveal lg:col-span-2">
            <div className="table-header">
              <span className="table-header-title">Risk vs Reward</span>
              <span className="table-badge">Analysis</span>
            </div>
            <div style={{ padding: '16px' }}>
              {tradeScatterData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis 
                      type="number" 
                      dataKey="risk" 
                      name="Risk" 
                      tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                      tickFormatter={(v) => `₨${v.toFixed(0)}`}
                      label={{ value: 'Risk (₨)', position: 'bottom', fill: 'var(--text3)', fontSize: 10 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="reward" 
                      name="Reward" 
                      tick={{ fill: 'var(--text3)', fontSize: 10 }}
                      tickFormatter={(v) => `₨${v.toFixed(0)}`}
                      label={{ value: 'Reward (₨)', angle: -90, position: 'left', fill: 'var(--text3)', fontSize: 10 }}
                    />
                    <ZAxis type="number" dataKey="pnl" range={[50, 400]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '6px', 
                        color: 'var(--text)',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: 'var(--text)' }}
                      labelStyle={{ color: 'var(--text)' }}
                      formatter={(value: any, name: string, props: any) => {
                        if (name === 'Risk') return [`₨${Number(value).toFixed(2)}`, 'Risk'];
                        if (name === 'Reward') return [`₨${Number(value).toFixed(2)}`, 'Reward'];
                        return [value, name];
                      }}
                      labelFormatter={(props: any) => `${props?.payload?.symbol || 'Trade'}`}
                    />
                    <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
                    <ReferenceLine x={0} stroke="var(--border)" strokeDasharray="3 3" />
                    <Scatter 
                      name="Trades" 
                      data={tradeScatterData} 
                      fill="var(--green)"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                  Log trades with stop losses to see risk/reward analysis
                </div>
              )}
            </div>
          </motion.div>

          {/* Cumulative P&L Line Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="table-container reveal lg:col-span-2">
            <div className="table-header">
              <span className="table-header-title">Cumulative Returns</span>
              <span className="table-badge">All Time</span>
            </div>
            <div style={{ padding: '16px' }}>
              {stats.equityCurve.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.equityCurve}>
                    <defs>
                      <linearGradient id="cumulGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={equityStroke} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={equityStroke} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                      tickLine={false} 
                      axisLine={{ stroke: 'var(--border)' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                      tickLine={false} 
                      axisLine={{ stroke: 'var(--border)' }}
                      tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }} itemStyle={{ color: 'var(--text)' }} labelStyle={{ color: 'var(--text)' }} formatter={(v: number) => [formatCurrency(v), "Cumulative P&L"]} />
                    <Area type="monotone" dataKey="equity" stroke={equityStroke} fill="url(#cumulGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="equity" stroke={equityStroke} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                  Log more trades to see cumulative returns
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
