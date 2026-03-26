import { useTrades, getTradeStats, calcPnL } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import StatCard from "@/components/StatCard";
import TradeForm from "@/components/TradeForm";
import { TrendingUp, TrendingDown, Target, BarChart3, DollarSign, Activity, HelpCircle, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid, PieChart, Pie, LineChart, Line, Legend
} from "recharts";
import { useState, useMemo } from "react";

export default function Dashboard() {
  const { data: trades = [], isLoading } = useTrades();
  const stats = getTradeStats(trades);
  
  // Filter states
  const [symbolFilter, setSymbolFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pnlMin, setPnlMin] = useState("");
  const [pnlMax, setPnlMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtered trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const pnl = calcPnL(trade);
      
      // Symbol filter
      if (symbolFilter && !trade.symbol.toLowerCase().includes(symbolFilter.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (dateFrom && trade.date < dateFrom) return false;
      if (dateTo && trade.date > dateTo) return false;
      
      // P&L range filter (only for closed trades)
      if (pnl !== null) {
        if (pnlMin && pnl < parseFloat(pnlMin)) return false;
        if (pnlMax && pnl > parseFloat(pnlMax)) return false;
      }
      
      return true;
    });
  }, [trades, symbolFilter, dateFrom, dateTo, pnlMin, pnlMax]);
  
  const displayedTrades = filteredTrades.slice(0, 10);
  
  // Win rate tooltip content
  const getWinRateTip = (winRate: number) => {
    if (winRate >= 60) return "Excellent! You're consistently profitable.";
    if (winRate >= 50) return "Good progress. Focus on cutting losses quickly.";
    if (winRate >= 40) return "Work on your entry timing and risk management.";
    return "Review your strategy. Consider paper trading to refine entries.";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ 
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '700',
            letterSpacing: '-1px',
            lineHeight: '1.1',
            color: 'var(--text)',
            marginBottom: '8px'
          }}>
            Dashboard
          </h1>
          <p style={{ 
            fontSize: '14px',
            fontWeight: '300',
            lineHeight: '1.6',
            color: 'var(--text2)'
          }}>
            Your PSX trading overview
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <TradeForm />
        </div>
      </div>

      {/* Stat Cards - Responsive grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border)' }}>
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
        {/* Win Rate Stat Card with Tooltip */}
        <div className="stat-card" style={{ position: 'relative' }}>
          <span className="stat-label">
            Win Rate
            <HelpCircle 
              className="w-3 h-3 ml-1 inline-block" 
              style={{ color: 'var(--text3)', cursor: 'help' }}
              title={getWinRateTip(stats.winRate)}
            />
          </span>
          <span className={`stat-val ${stats.winRate >= 50 ? 'pos' : 'neg'}`}>
            {stats.winRate.toFixed(1)}%
          </span>
          <span className="stat-sub">{stats.wins}W / {stats.losses}L</span>
          <div 
            className="win-rate-tip" 
            style={{
              fontSize: '10px',
              color: 'var(--text2)',
              marginTop: '4px',
              padding: '4px 8px',
              background: 'var(--bg2)',
              borderRadius: '4px',
              border: '1px solid var(--border)'
            }}
          >
            {getWinRateTip(stats.winRate)}
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Trades</span>
          <span className="stat-val">{stats.totalTrades}</span>
          <span className="stat-sub">{formatCurrency(stats.totalVolume)} volume</span>
        </div>
      </div>

      {/* Charts Row - Compact sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div style={{ padding: '16px' }}>
            {stats.equityCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stats.equityCurve}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--green)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
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
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Equity"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="var(--green)" 
                    fill="url(#equityGrad)" 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                Log trades to see your equity curve
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily PnL - Compact */}
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
          <div style={{ padding: '16px' }}>
            {stats.dailyPnL.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.dailyPnL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                    tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`}
                    tickCount={6}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), "P&L"]}
                  />
                  <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                    {stats.dailyPnL.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={entry.pnl >= 0 ? "var(--green)" : "var(--red)"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                Log trades to see daily P&L
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Symbol Performance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="table-container reveal"
        >
          <div className="table-header">
            <span className="table-header-title">Top Symbols</span>
            <span className="table-badge">P&L</span>
          </div>
          <div style={{ padding: '16px', height: '200px' }}>
            {stats.symbolPerformance && stats.symbolPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.symbolPerformance.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="symbol" 
                    type="category" 
                    tick={{ fill: 'var(--text)', fontSize: 11 }} 
                    tickLine={false} 
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), "P&L"]}
                  />
                  <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                    {stats.symbolPerformance.slice(0, 5).map((entry, index) => (
                      <Cell key={index} fill={entry.pnl >= 0 ? "var(--green)" : "var(--red)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                No symbol data
              </div>
            )}
          </div>
        </motion.div>

        {/* Win/Loss Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="table-container reveal"
        >
          <div className="table-header">
            <span className="table-header-title">Win/Loss</span>
            <span className="table-badge">Ratio</span>
          </div>
          <div style={{ padding: '16px', height: '200px' }}>
            {stats.totalTrades > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="winGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--green)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="var(--green)" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--red)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="var(--red)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={[
                      { name: 'Wins', value: stats.wins, fill: 'url(#winGrad)' },
                      { name: 'Losses', value: stats.losses, fill: 'url(#lossGrad)' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="url(#winGrad)" />
                    <Cell fill="url(#lossGrad)" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={20}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: 'var(--text2)', fontSize: '11px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                No trades yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Trade Volume by Day */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="table-container reveal"
        >
          <div className="table-header">
            <span className="table-header-title">Trading Days</span>
            <span className="table-badge">Volume</span>
          </div>
          <div style={{ padding: '16px', height: '200px' }}>
            {stats.dayOfWeekData && stats.dayOfWeekData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value} trades`, "Count"]}
                  />
                  <Bar dataKey="count" fill="var(--green)" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                No activity data
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="table-container reveal"
        >
          <div className="table-header">
            <span className="table-header-title">Monthly Trend</span>
            <span className="table-badge">2025</span>
          </div>
          <div style={{ padding: '16px', height: '200px' }}>
            {stats.monthlyData && stats.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyData}>
                  <defs>
                    <linearGradient id="monthlyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--green)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'var(--text3)', fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      color: 'var(--text)',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), "P&L"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="var(--green)" 
                    fill="url(#monthlyGrad)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="var(--green)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--green)', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: 'var(--green)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: 'var(--text2)', fontSize: '13px' }}>
                Monthly data pending
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Trades - Compact with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="table-container reveal"
      >
        <div className="table-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="table-header-title">Recent Trades</span>
            <span className="table-badge">Latest</span>
            {filteredTrades.length !== trades.length && (
              <span style={{ fontSize: '11px', color: 'var(--text2)' }}>
                ({filteredTrades.length} of {trades.length})
              </span>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              background: showFilters ? 'var(--surface)' : 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            <Filter className="w-3 h-3" />
            Filters
          </button>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg2)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <input
                type="text"
                placeholder="Symbol..."
                value={symbolFilter}
                onChange={(e) => setSymbolFilter(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '4px'
                }}
              />
              <input
                type="date"
                placeholder="From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '4px'
                }}
              />
              <input
                type="date"
                placeholder="To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '4px'
                }}
              />
              <input
                type="number"
                placeholder="Min P&L"
                value={pnlMin}
                onChange={(e) => setPnlMin(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '4px'
                }}
              />
              <input
                type="number"
                placeholder="Max P&L"
                value={pnlMax}
                onChange={(e) => setPnlMax(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: '4px'
                }}
              />
              <button
                onClick={() => {
                  setSymbolFilter("");
                  setDateFrom("");
                  setDateTo("");
                  setPnlMin("");
                  setPnlMax("");
                }}
                style={{
                  padding: '6px 10px',
                  fontSize: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          </motion.div>
        )}
        
        {displayedTrades.length > 0 ? (
          <div className="table-scroll" style={{ maxHeight: '320px', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ fontSize: '12px', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 8px' }}>Date</th>
                  <th style={{ padding: '10px 8px' }}>Symbol</th>
                  <th style={{ padding: '10px 8px' }}>Side</th>
                  <th style={{ padding: '10px 8px' }}>Qty</th>
                  <th style={{ padding: '10px 8px' }}>Entry</th>
                  <th style={{ padding: '10px 8px' }}>Exit</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>P&L</th>
                </tr>
              </thead>
              <tbody>
                {displayedTrades.map((trade) => {
                  const pnl = calcPnL(trade);
                  const isPositive = pnl !== null && pnl > 0;
                  const isNegative = pnl !== null && pnl < 0;
                  return (
                    <tr key={trade.id} style={{ 
                      background: isPositive ? 'rgba(163, 196, 90, 0.05)' : isNegative ? 'rgba(239, 68, 68, 0.05)' : undefined
                    }}>
                      <td style={{ color: 'var(--text3)', padding: '8px' }}>{trade.date}</td>
                      <td className="sym" style={{ padding: '8px', fontWeight: 600 }}>{trade.symbol}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          color: trade.side === "buy" ? '#22c55e' : '#ef4444',
                          fontWeight: '600',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          background: trade.side === "buy" ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                        }}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '8px', fontFamily: 'monospace' }}>{trade.quantity}</td>
                      <td style={{ padding: '8px', fontFamily: 'monospace' }}>₨{trade.entry_price}</td>
                      <td style={{ padding: '8px', fontFamily: 'monospace' }}>{trade.exit_price ? `₨${trade.exit_price}` : "—"}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        {pnl !== null ? (
                          <span style={{
                            color: pnl >= 0 ? '#22c55e' : '#ef4444',
                            fontWeight: '700',
                            fontFamily: 'monospace',
                            fontSize: '13px'
                          }}>
                            {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text3)', fontSize: '11px' }}>Open</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--text2)' }}>
            <BarChart3 className="w-10 h-10 mx-auto mb-2" style={{ opacity: '0.3' }} />
            <p style={{ fontSize: '13px' }}>No trades match your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
