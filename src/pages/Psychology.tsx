import { useTrades, Trade } from "@/hooks/useTrades";
import { formatCurrency } from "@/lib/psx";
import { Brain, TrendingDown, AlertTriangle, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = {
  calm: '#10B981',
  fear: '#EF4444',
  greedy: '#F59E0B',
  revenge: '#DC2626',
};

const REASON_COLORS = {
  breakout: '#3B82F6',
  dip_buy: '#10B981',
  news: '#8B5CF6',
  tip: '#EC4899',
};

const MISTAKE_COLORS = {
  overtrading: '#EF4444',
  late_entry: '#F59E0B',
  early_exit: '#8B5CF6',
  revenge_trade: '#DC2626',
};

export default function Psychology() {
  const { data: trades = [], isLoading } = useTrades();

  const psychologyData = useMemo(() => {
    const closedTrades = trades.filter(t => t.exit_price !== null);
    
    // Emotion analysis
    const emotionMap = new Map<string, { count: number; pnl: number; winRate: number }>();
    closedTrades.forEach(t => {
      if (t.emotion) {
        const pnl = (t.exit_price! - t.entry_price) * t.quantity - (t.fees || 0);
        const isWin = pnl > 0;
        const existing = emotionMap.get(t.emotion) || { count: 0, pnl: 0, winRate: 0 };
        emotionMap.set(t.emotion, {
          count: existing.count + 1,
          pnl: existing.pnl + pnl,
          winRate: existing.count > 0 ? (existing.winRate * existing.count + (isWin ? 1 : 0)) / (existing.count + 1) : (isWin ? 1 : 0),
        });
      }
    });

    // Reason analysis
    const reasonMap = new Map<string, { count: number; pnl: number }>();
    closedTrades.forEach(t => {
      if (t.reason) {
        const pnl = (t.exit_price! - t.entry_price) * t.quantity - (t.fees || 0);
        const existing = reasonMap.get(t.reason) || { count: 0, pnl: 0 };
        reasonMap.set(t.reason, {
          count: existing.count + 1,
          pnl: existing.pnl + pnl,
        });
      }
    });

    // Mistake analysis
    const mistakeMap = new Map<string, { count: number; cost: number }>();
    closedTrades.forEach(t => {
      if (t.mistake_tag) {
        const pnl = (t.exit_price! - t.entry_price) * t.quantity - (t.fees || 0);
        const cost = pnl < 0 ? Math.abs(pnl) : 0;
        const existing = mistakeMap.get(t.mistake_tag) || { count: 0, cost: 0 };
        mistakeMap.set(t.mistake_tag, {
          count: existing.count + 1,
          cost: existing.cost + cost,
        });
      }
    });

    // Discipline score calculation
    const totalTrades = closedTrades.length;
    const ruleFollowedCount = closedTrades.filter(t => t.rule_followed === true).length;
    const revengeTrades = closedTrades.filter(t => t.emotion === 'revenge').length;
    const overtradingCount = closedTrades.filter(t => t.mistake_tag === 'overtrading').length;
    
    let disciplineScore = 0;
    if (totalTrades > 0) {
      const ruleScore = (ruleFollowedCount / totalTrades) * 50;
      const emotionScore = Math.max(0, 50 - (revengeTrades / totalTrades) * 50);
      const overtradingScore = Math.max(0, 50 - (overtradingCount / totalTrades) * 50);
      disciplineScore = Math.round(ruleScore + emotionScore + overtradingScore);
    }

    // Revenge trade cost calculation
    const revengeTradeCost = closedTrades
      .filter(t => t.emotion === 'revenge' || t.mistake_tag === 'revenge_trade')
      .reduce((sum, t) => {
        const pnl = (t.exit_price! - t.entry_price) * t.quantity - (t.fees || 0);
        return sum + (pnl < 0 ? Math.abs(pnl) : 0);
      }, 0);

    return {
      emotionData: Array.from(emotionMap.entries()).map(([emotion, data]) => ({
        emotion,
        count: data.count,
        pnl: data.pnl,
        winRate: (data.winRate * 100).toFixed(1),
        lossRate: (100 - data.winRate * 100).toFixed(1),
      })),
      reasonData: Array.from(reasonMap.entries()).map(([reason, data]) => ({
        reason: reason.replace('_', ' '),
        count: data.count,
        pnl: data.pnl,
      })),
      mistakeData: Array.from(mistakeMap.entries()).map(([mistake, data]) => ({
        mistake: mistake.replace('_', ' '),
        count: data.count,
        cost: data.cost,
      })),
      disciplineScore,
      revengeTradeCost,
      totalTrades,
    };
  }, [trades]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ color: "var(--text)" }}>
      {/* Header */}
      <div>
        <p className="dash-page-kicker">Your Secret Weapon</p>
        <h1 className="dash-page-title">Psychology Dashboard</h1>
        <p className="dash-page-desc">Emotional trading patterns and discipline metrics.</p>
      </div>

      {/* Discipline Score */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Discipline Score</span>
          <span className="table-badge" style={{ background: psychologyData.disciplineScore >= 70 ? 'rgba(16, 185, 129, 0.2)' : psychologyData.disciplineScore >= 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: psychologyData.disciplineScore >= 70 ? '#10B981' : psychologyData.disciplineScore >= 50 ? '#F59E0B' : '#EF4444' }}>
            {psychologyData.disciplineScore >= 70 ? 'Excellent' : psychologyData.disciplineScore >= 50 ? 'Good' : 'Needs Work'}
          </span>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--bg2)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={psychologyData.disciplineScore >= 70 ? '#10B981' : psychologyData.disciplineScore >= 50 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="3"
                  strokeDasharray={`${psychologyData.disciplineScore}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>{psychologyData.disciplineScore}</span>
                <span style={{ fontSize: '10px', color: 'var(--text2)' }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '12px' }}>
                Based on rule following, overtrading, and revenge trades
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--bg2)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px' }}>Total Trades</p>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>{psychologyData.totalTrades}</p>
                </div>
                {psychologyData.revengeTradeCost > 0 && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <p style={{ fontSize: '11px', color: '#EF4444', marginBottom: '4px' }}>Revenge Trade Cost</p>
                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#EF4444' }}>{formatCurrency(psychologyData.revengeTradeCost)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emotional Trading Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Emotional Trading Heatmap</span>
          <span className="table-badge">Loss Rate by Emotion</span>
        </div>
        <div style={{ padding: '20px' }}>
          {psychologyData.emotionData.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {psychologyData.emotionData.map((item) => (
                <div
                  key={item.emotion}
                  style={{
                    background: 'var(--bg2)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS[item.emotion as keyof typeof COLORS] || 'var(--border)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[item.emotion as keyof typeof COLORS] }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{item.emotion}</span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text3)' }}>Loss Rate</p>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: parseFloat(item.lossRate) > 50 ? '#EF4444' : '#10B981' }}>{item.lossRate}%</p>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                    {parseFloat(item.lossRate) > 50 ? (
                      <span style={{ color: '#EF4444' }}>When you're {item.emotion} → {item.lossRate}% loss rate</span>
                    ) : (
                      <span style={{ color: '#10B981' }}>{item.winRate}% win rate when {item.emotion}</span>
                    )}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text3)' }}>
                    {item.count} trades
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text2)', textAlign: 'center' }}>Log trades with emotions to see patterns</p>
          )}
        </div>
      </motion.div>

      {/* Mistake Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Mistake Patterns</span>
          <span className="table-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>Cost Analysis</span>
        </div>
        <div style={{ padding: '20px' }}>
          {psychologyData.mistakeData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={psychologyData.mistakeData}>
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
                    tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--text)'
                    }}
                    formatter={(v: number) => [formatCurrency(v), 'Cost']}
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {psychologyData.mistakeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MISTAKE_COLORS[entry.mistake.replace(' ', '_') as keyof typeof MISTAKE_COLORS] || '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text2)', textAlign: 'center' }}>No mistakes tagged yet</p>
          )}
        </div>
      </motion.div>

      {/* Reason Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Trade Reasons</span>
          <span className="table-badge">Distribution</span>
        </div>
        <div style={{ padding: '20px' }}>
          {psychologyData.reasonData.length > 0 ? (
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={psychologyData.reasonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {psychologyData.reasonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={REASON_COLORS[entry.reason.replace(' ', '_') as keyof typeof REASON_COLORS] || '#8B5CF6'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--text)'
                    }}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: 'var(--text2)', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text2)', textAlign: 'center' }}>Log trades with reasons to see distribution</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
