import { useTrades, getTradeStats, calcPnL } from "@/hooks/useTrades";
import { formatCurrency } from "@/lib/psx";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  const { data: trades = [], isLoading } = useTrades();
  const stats = getTradeStats(trades);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    { name: "Wins", value: stats.wins, fill: "hsl(145, 80%, 42%)" },
    { name: "Losses", value: stats.losses, fill: "hsl(0, 72%, 55%)" },
  ];

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

  const hasData = trades.length > 0 && stats.closedTrades > 0;

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      <div>
        <h1 style={{ 
          fontSize: 'clamp(36px, 4vw, 60px)',
          fontWeight: '700',
          letterSpacing: '-2px',
          lineHeight: '1.0',
          color: 'var(--text)',
          marginBottom: '8px'
        }}>
          Analytics
        </h1>
        <p style={{ 
          fontSize: '15px',
          fontWeight: '300',
          lineHeight: '1.7',
          color: 'var(--text2)'
        }}>
          Deep insights into your trading
        </p>
      </div>

      {!hasData ? (
        <div className="text-center py-20" style={{ color: 'var(--text2)' }}>
          <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ opacity: '0.2' }} />
          <p className="text-lg font-medium">No data yet</p>
          <p className="text-sm mt-1">Log some closed trades to unlock analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equity Curve */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="table-container reveal">
            <div className="table-header">
              <span className="table-header-title">Equity Curve</span>
              <span className="table-badge">Live</span>
            </div>
            <div style={{ padding: '32px' }}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={stats.equityCurve}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '0px', 
                    color: 'var(--text)' 
                  }} formatter={(v: number) => [formatCurrency(v), "Equity"]} />
                  <Area type="monotone" dataKey="equity" stroke="#22c55e" fill="url(#eqGrad)" strokeWidth={2} />
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
            <div style={{ padding: '32px' }}>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill === "hsl(145, 80%, 42%)" ? "#22c55e" : "#ef4444"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '0px', 
                      color: 'var(--text)' 
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Wins ({stats.wins})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Losses ({stats.losses})</span>
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
            <div style={{ padding: '32px' }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '0px', 
                    color: 'var(--text)' 
                  }} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                  <Bar dataKey="pnl" radius={[0, 0, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={index} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
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
            <div style={{ padding: '32px' }}>
              <div className="space-y-3">
                {symbolPerf.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between" style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <div className="flex items-center gap-3">
                      <span style={{ 
                        fontFamily: 'monospace',
                        fontWeight: '500',
                        fontSize: '13px',
                        color: 'var(--text)'
                      }}>{s.symbol}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.count} trades</span>
                    </div>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      fontSize: '13px',
                      color: s.pnl >= 0 ? 'var(--green)' : 'var(--red)'
                    }}>
                      {formatCurrency(s.pnl)}
                    </span>
                  </div>
                ))}
                {symbolPerf.length === 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--text2)', textAlign: 'center', padding: '16px 0' }}>
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
            <div style={{ padding: '32px' }}>
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
        </div>
      )}
    </div>
  );
}
