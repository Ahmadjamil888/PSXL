import { useTrades, getTradeStats, calcPnL } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import StatCard from "@/components/StatCard";
import TradeForm from "@/components/TradeForm";
import { TrendingUp, TrendingDown, Target, BarChart3, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import "./Landing.css";

export default function Dashboard() {
  const { data: trades = [], isLoading } = useTrades();
  const stats = getTradeStats(trades);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ 
            fontSize: 'clamp(36px, 4vw, 60px)',
            fontWeight: '700',
            letterSpacing: '-2px',
            lineHeight: '1.0',
            color: 'var(--text)',
            marginBottom: '8px'
          }}>
            Dashboard
          </h1>
          <p style={{ 
            fontSize: '15px',
            fontWeight: '300',
            lineHeight: '1.7',
            color: 'var(--text2)'
          }}>
            Your PSX trading overview
          </p>
        </div>
        <TradeForm />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1" style={{ background: 'var(--border)' }}>
        <div className="stat-card">
          <span className="stat-label">Total P&L</span>
          <span className={`stat-val ${stats.totalPnL >= 0 ? 'pos' : 'neg'}`}>
            {formatCurrency(stats.totalPnL)}
          </span>
          <span className="stat-sub">{stats.closedTrades} closed trades</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Today's P&L</span>
          <span className={`stat-val ${stats.todayPnL >= 0 ? 'pos' : stats.todayPnL < 0 ? 'neg' : ''}`}>
            {formatCurrency(stats.todayPnL)}
          </span>
          <span className="stat-sub">Real-time tracking</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Win Rate</span>
          <span className={`stat-val ${stats.winRate >= 50 ? 'pos' : ''}`}>
            {stats.winRate.toFixed(1)}%
          </span>
          <span className="stat-sub">{stats.wins}W / {stats.losses}L</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Trades</span>
          <span className="stat-val">{stats.totalTrades}</span>
          <span className="stat-sub">{formatCurrency(stats.totalVolume)} volume</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="table-container reveal"
        >
          <div className="table-header">
            <span className="table-header-title">Equity Curve</span>
            <span className="table-badge">Live</span>
          </div>
          <div style={{ padding: '32px' }}>
            {stats.equityCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.equityCurve}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '0px', 
                      color: 'var(--text)' 
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Equity"]}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#22c55e" fill="url(#equityGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '14px' }}>
                Log trades to see your equity curve
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily PnL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="table-container reveal"
        >
          <div className="table-header">
            <span className="table-header-title">Daily P&L</span>
            <span className="table-badge">Live</span>
          </div>
          <div style={{ padding: '32px' }}>
            {stats.dailyPnL.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.dailyPnL}>
                  <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '0px', 
                      color: 'var(--text)' 
                    }}
                    formatter={(value: number) => [formatCurrency(value), "P&L"]}
                  />
                  <Bar dataKey="pnl" radius={[0, 0, 0, 0]}>
                    {stats.dailyPnL.map((entry, index) => (
                      <Cell key={index} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '14px' }}>
                Log trades to see daily P&L
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Trades */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="table-container reveal"
      >
        <div className="table-header">
          <span className="table-header-title">Recent Trades</span>
          <span className="table-badge">Latest</span>
        </div>
        {trades.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Qty</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 10).map((trade) => {
                  const pnl = calcPnL(trade);
                  return (
                    <tr key={trade.id}>
                      <td style={{ color: 'var(--text3)', fontSize: '11px' }}>{trade.date}</td>
                      <td className="sym">{trade.symbol}</td>
                      <td>
                        <span style={{
                          color: trade.side === "buy" ? 'var(--green)' : 'var(--red)',
                          fontWeight: '500',
                          fontSize: '11px'
                        }}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td>{trade.quantity}</td>
                      <td>₨{trade.entry_price}</td>
                      <td>{trade.exit_price ? `₨${trade.exit_price}` : "—"}</td>
                      <td className={pnl === null ? "" : pnl >= 0 ? "pos" : "neg"}>
                        {pnl !== null ? formatCurrency(pnl) : "Open"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: 'var(--text2)' }}>
            <BarChart3 className="w-12 h-12 mx-auto mb-3" style={{ opacity: '0.3' }} />
            <p>No trades yet. Start by logging your first trade!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
