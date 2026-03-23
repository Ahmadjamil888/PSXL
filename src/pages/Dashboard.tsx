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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your PSX trading overview</p>
        </div>
        <TradeForm />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.totalPnL)}
          icon={stats.totalPnL >= 0 ? TrendingUp : TrendingDown}
          trend={stats.totalPnL >= 0 ? "up" : "down"}
          subtitle={`${stats.closedTrades} closed trades`}
        />
        <StatCard
          title="Today's P&L"
          value={formatCurrency(stats.todayPnL)}
          icon={DollarSign}
          trend={stats.todayPnL >= 0 ? "up" : stats.todayPnL < 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon={Target}
          trend={stats.winRate >= 50 ? "up" : stats.winRate > 0 ? "down" : "neutral"}
          subtitle={`${stats.wins}W / ${stats.losses}L`}
        />
        <StatCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          icon={Activity}
          trend="neutral"
          subtitle={formatCurrency(stats.totalVolume) + " volume"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Equity Curve */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Equity Curve</h3>
          {stats.equityCurve.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.equityCurve}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(145, 80%, 42%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(145, 80%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 24%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }}
                  formatter={(value: number) => [formatCurrency(value), "Equity"]}
                />
                <Area type="monotone" dataKey="equity" stroke="hsl(145, 80%, 42%)" fill="url(#equityGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              Log trades to see your equity curve
            </div>
          )}
        </motion.div>

        {/* Daily PnL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Daily P&L</h3>
          {stats.dailyPnL.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.dailyPnL}>
                <XAxis dataKey="date" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₨${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 24%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }}
                  formatter={(value: number) => [formatCurrency(value), "P&L"]}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {stats.dailyPnL.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? "hsl(145, 80%, 42%)" : "hsl(0, 72%, 55%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              Log trades to see daily P&L
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Trades */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-5"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Trades</h3>
        {trades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left py-2 px-2">Date</th>
                  <th className="text-left py-2 px-2">Symbol</th>
                  <th className="text-left py-2 px-2">Side</th>
                  <th className="text-right py-2 px-2">Qty</th>
                  <th className="text-right py-2 px-2">Entry</th>
                  <th className="text-right py-2 px-2">Exit</th>
                  <th className="text-right py-2 px-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 10).map((trade) => {
                  const pnl = calcPnL(trade);
                  return (
                    <tr key={trade.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-2 text-muted-foreground">{trade.date}</td>
                      <td className="py-2.5 px-2 font-mono font-medium text-foreground">{trade.symbol}</td>
                      <td className="py-2.5 px-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          trade.side === "buy" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                        }`}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">{trade.quantity}</td>
                      <td className="py-2.5 px-2 text-right font-mono">₨{trade.entry_price}</td>
                      <td className="py-2.5 px-2 text-right font-mono">{trade.exit_price ? `₨${trade.exit_price}` : "—"}</td>
                      <td className={`py-2.5 px-2 text-right font-mono font-medium ${
                        pnl === null ? "text-muted-foreground" : pnl >= 0 ? "text-profit" : "text-loss"
                      }`}>
                        {pnl !== null ? formatCurrency(pnl) : "Open"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No trades yet. Start by logging your first trade!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
