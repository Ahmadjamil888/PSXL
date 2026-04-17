import { useTrades, getTradeStats, calcPnL, Trade } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { BarChart3, TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";

const COLORS = {
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const chartColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

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
  contentStyle: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '12px',
    padding: '12px',
  },
  itemStyle: { color: 'var(--text)' },
  labelStyle: { color: 'var(--text2)', fontSize: '11px' },
};

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

  // Core insights - keep it simple
  const closedTrades = trades.filter(t => calcPnL(t) !== null);
  
  // Best stock (by profit)
  const symbolMap = new Map<string, { pnl: number; count: number }>();
  closedTrades.forEach(t => {
    const pnl = calcPnL(t)!;
    const existing = symbolMap.get(t.symbol) || { pnl: 0, count: 0 };
    symbolMap.set(t.symbol, { pnl: existing.pnl + pnl, count: existing.count + 1 });
  });
  const symbolPerf = Array.from(symbolMap.entries())
    .map(([symbol, data]) => ({ symbol, ...data }))
    .sort((a, b) => b.pnl - a.pnl);
  
  const bestStock = symbolPerf[0];
  const worstStock = symbolPerf[symbolPerf.length - 1];
  
  // Best time of day
  const timeMap = new Map<string, { pnl: number; count: number }>();
  closedTrades.forEach(t => {
    const pnl = calcPnL(t)!;
    const hour = new Date(t.date).getHours();
    const timeSlot = hour < 12 ? 'Morning' : hour < 16 ? 'Afternoon' : 'Evening';
    const existing = timeMap.get(timeSlot) || { pnl: 0, count: 0 };
    timeMap.set(timeSlot, { pnl: existing.pnl + pnl, count: existing.count + 1 });
  });
  const timePerf = Array.from(timeMap.entries())
    .map(([time, data]) => ({ time, ...data }))
    .sort((a, b) => b.pnl - a.pnl);
  const bestTime = timePerf[0];
  
  // Mistake frequency
  const mistakeMap = new Map<string, number>();
  closedTrades.forEach(t => {
    if (t.mistake_tag) {
      mistakeMap.set(t.mistake_tag, (mistakeMap.get(t.mistake_tag) || 0) + 1);
    }
  });
  const mistakeFreq = Array.from(mistakeMap.entries())
    .map(([mistake, count]) => ({ mistake: mistake.replace('_', ' '), count }))
    .sort((a, b) => b.count - a.count);
  
  const hasData = closedTrades.length > 0;

  return (
    <div className="space-y-6" style={{ color: "var(--text)" }}>
      {/* Header */}
      <div>
        <p className="dash-page-kicker">Core Insights</p>
        <h1 className="dash-page-title">Performance</h1>
        <p className="dash-page-desc">Simple, actionable insights. No complexity.</p>
      </div>

      {!hasData ? (
        <div className="table-container" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text3)', opacity: 0.5 }} />
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>No data yet</p>
          <p style={{ fontSize: '14px', color: 'var(--text2)' }}>Log some closed trades to see your performance</p>
        </div>
      ) : (
        <>
          {/* Core Insights Cards */}
          <div className="stat-grid">
            {/* Best Stock */}
            <div className="stat-card">
              <span className="stat-label" style={{ color: "var(--text2)" }}>Best Stock</span>
              {bestStock ? (
                <>
                  <span className="stat-val" style={{ color: COLORS.success }}>{bestStock.symbol}</span>
                  <span className="stat-sub">{formatCurrency(bestStock.pnl)}</span>
                  <TrendingUp className="w-4 h-4" style={{ color: COLORS.success, marginTop: '4px' }} />
                </>
              ) : (
                <span className="stat-val">—</span>
              )}
            </div>

            {/* Worst Stock */}
            <div className="stat-card">
              <span className="stat-label" style={{ color: "var(--text2)" }}>Worst Stock</span>
              {worstStock ? (
                <>
                  <span className="stat-val" style={{ color: COLORS.danger }}>{worstStock.symbol}</span>
                  <span className="stat-sub">{formatCurrency(worstStock.pnl)}</span>
                  <TrendingDown className="w-4 h-4" style={{ color: COLORS.danger, marginTop: '4px' }} />
                </>
              ) : (
                <span className="stat-val">—</span>
              )}
            </div>

            {/* Best Time of Day */}
            <div className="stat-card">
              <span className="stat-label" style={{ color: "var(--text2)" }}>Best Time</span>
              {bestTime ? (
                <>
                  <span className="stat-val">{bestTime.time}</span>
                  <span className="stat-sub">{formatCurrency(bestTime.pnl)}</span>
                  <Clock className="w-4 h-4" style={{ color: COLORS.info, marginTop: '4px' }} />
                </>
              ) : (
                <span className="stat-val">—</span>
              )}
            </div>

            {/* Win Rate */}
            <div className="stat-card">
              <span className="stat-label" style={{ color: "var(--text2)" }}>Win Rate</span>
              <span className="stat-val">{stats.winRate.toFixed(1)}%</span>
              <span className="stat-sub">{stats.wins}W / {stats.losses}L</span>
            </div>

            {/* Avg Profit per Trade */}
            <div className="stat-card">
              <span className="stat-label" style={{ color: "var(--text2)" }}>Avg Profit</span>
              <span className="stat-val" style={{ color: COLORS.success }}>{formatCurrency(stats.avgWin)}</span>
              <span className="stat-sub">Per winning trade</span>
            </div>

            {/* Avg Loss per Trade */}
            <div className="stat-card">
              <span className="stat-label" style={{ color: "var(--text2)" }}>Avg Loss</span>
              <span className="stat-val" style={{ color: COLORS.danger }}>{formatCurrency(stats.avgLoss)}</span>
              <span className="stat-sub">Per losing trade</span>
            </div>
          </div>

          {/* Mistake Frequency */}
          {mistakeFreq.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="table-container"
            >
              <div className="table-header">
                <span className="table-header-title">Mistake Frequency</span>
                <span className="table-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>Patterns</span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mistakeFreq}>
                      <XAxis 
                        dataKey="mistake" 
                        tick={{ fill: 'var(--text2)', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--border)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'var(--text2)', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--border)' }}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} fill={COLORS.danger}>
                        {mistakeFreq.map((_, i) => (
                          <Cell key={i} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stock Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="table-container"
          >
            <div className="table-header">
              <span className="table-header-title">Stock Performance</span>
              <span className="table-badge">Top 10</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {symbolPerf.slice(0, 10).map((stock, i) => (
                  <div
                    key={stock.symbol}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < symbolPerf.slice(0, 10).length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: stock.pnl >= 0 ? COLORS.success : COLORS.danger,
                        }}
                      />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{stock.symbol}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text3)' }}>{stock.count} trades</p>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: stock.pnl >= 0 ? COLORS.success : COLORS.danger,
                        fontFamily: 'monospace',
                      }}
                    >
                      {stock.pnl >= 0 ? '+' : ''}{formatCurrency(stock.pnl)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
