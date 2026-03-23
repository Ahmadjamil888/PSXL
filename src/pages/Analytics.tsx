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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into your trading</p>
      </div>

      {!hasData ? (
        <div className="text-center py-20 text-muted-foreground">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No data yet</p>
          <p className="text-sm mt-1">Log some closed trades to unlock analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Equity Curve */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Equity Curve</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.equityCurve}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(145, 80%, 42%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(145, 80%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 24%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [formatCurrency(v), "Equity"]} />
                <Area type="monotone" dataKey="equity" stroke="hsl(145, 80%, 42%)" fill="url(#eqGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Win/Loss Pie */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Win vs Loss</h3>
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
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 24%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-profit" />
                <span className="text-sm text-muted-foreground">Wins ({stats.wins})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-loss" />
                <span className="text-sm text-muted-foreground">Losses ({stats.losses})</span>
              </div>
            </div>
          </motion.div>

          {/* Monthly Performance */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 24%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }} formatter={(v: number) => [formatCurrency(v), "P&L"]} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? "hsl(145, 80%, 42%)" : "hsl(0, 72%, 55%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Symbol Performance */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Symbols</h3>
            <div className="space-y-3">
              {symbolPerf.map((s) => (
                <div key={s.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-foreground text-sm">{s.symbol}</span>
                    <span className="text-xs text-muted-foreground">{s.count} trades</span>
                  </div>
                  <span className={`font-mono font-semibold text-sm ${s.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                    {formatCurrency(s.pnl)}
                  </span>
                </div>
              ))}
              {symbolPerf.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No symbol data yet</p>
              )}
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-5 lg:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Best Trade</p>
                <p className="text-lg font-mono font-bold text-profit">{formatCurrency(stats.bestTrade)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Worst Trade</p>
                <p className="text-lg font-mono font-bold text-loss">{formatCurrency(stats.worstTrade)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Volume</p>
                <p className="text-lg font-mono font-bold text-foreground">{formatCurrency(stats.totalVolume)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg P&L/Trade</p>
                <p className={`text-lg font-mono font-bold ${stats.closedTrades > 0 && stats.totalPnL / stats.closedTrades >= 0 ? "text-profit" : "text-loss"}`}>
                  {stats.closedTrades > 0 ? formatCurrency(stats.totalPnL / stats.closedTrades) : "—"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
