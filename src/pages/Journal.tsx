import { useState } from "react";
import { useTrades, calcPnL, calcPnLPercent, useDeleteTrade } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import TradeForm from "@/components/TradeForm";
import { Input } from "@/components/ui/input";
import { Search, Trash2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Journal() {
  const { data: trades = [], isLoading } = useTrades();
  const deleteTrade = useDeleteTrade();
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<"all" | "buy" | "sell">("all");

  const filtered = trades.filter((t) => {
    if (search && !t.symbol.includes(search.toUpperCase()) && !t.note?.toLowerCase().includes(search.toLowerCase())) return false;
    if (sideFilter !== "all" && t.side !== sideFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTrade.mutateAsync(id);
      toast.success("Trade deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trade Journal</h1>
          <p className="text-sm text-muted-foreground">{trades.length} trades logged</p>
        </div>
        <TradeForm />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol or note..."
            className="pl-9 h-10 bg-input border-border"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "buy", "sell"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSideFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sideFilter === s
                  ? s === "buy" ? "bg-profit/20 text-profit" : s === "sell" ? "bg-loss/20 text-loss" : "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Trade List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((trade, i) => {
            const pnl = calcPnL(trade);
            const pnlPct = calcPnLPercent(trade);
            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    trade.side === "buy" ? "bg-profit/10" : "bg-loss/10"
                  }`}>
                    <span className={`text-xs font-bold ${trade.side === "buy" ? "text-profit" : "text-loss"}`}>
                      {trade.side === "buy" ? "B" : "S"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">{trade.symbol}</span>
                      <span className="text-xs text-muted-foreground">{trade.date}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {trade.quantity} × ₨{trade.entry_price}
                      {trade.exit_price ? ` → ₨${trade.exit_price}` : " (Open)"}
                      {trade.note && ` · ${trade.note}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {pnl !== null ? (
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${pnl >= 0 ? "text-profit" : "text-loss"}`}>
                        {formatCurrency(pnl)}
                      </p>
                      <p className={`text-xs ${pnlPct! >= 0 ? "text-profit" : "text-loss"}`}>
                        {formatPercent(pnlPct!)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">OPEN</span>
                  )}
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{trades.length === 0 ? "No trades yet. Log your first trade!" : "No trades match your filters."}</p>
        </div>
      )}
    </div>
  );
}
