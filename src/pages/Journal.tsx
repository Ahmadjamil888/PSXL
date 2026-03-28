import { useState } from "react";
import { useTrades, calcPnL, calcPnLPercent, useDeleteTrade } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import TradeForm from "@/components/TradeForm";
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
      <div className="dashboard-app flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="dashboard-app space-y-5" style={{ color: "var(--text)" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="dash-page-kicker">Log</p>
          <h1 className="dash-page-title">Trade Journal</h1>
          <p className="dash-page-desc">{trades.length} trades logged — search, filter, and review.</p>
        </div>
        <div className="w-full shrink-0 sm:w-auto">
          <TradeForm />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text3)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol or note..."
            className="input-field w-full"
            style={{ paddingLeft: "40px", minHeight: "44px" }}
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          {(["all", "buy", "sell"] as const).map((s) => {
            const active = sideFilter === s;
            const base = {
              padding: "10px 14px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "all 0.2s",
              borderRadius: "6px",
              minHeight: "44px",
            };
            if (s === "all") {
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSideFilter(s)}
                  style={{
                    ...base,
                    background: active ? "var(--surface)" : "transparent",
                    color: active ? "var(--text)" : "var(--text2)",
                    borderColor: active ? "var(--border2)" : "var(--border)",
                  }}
                >
                  All
                </button>
              );
            }
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSideFilter(s)}
                style={{
                  ...base,
                  background: active ? (s === "buy" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)") : "transparent",
                  color: active ? (s === "buy" ? "var(--green)" : "var(--red)") : "var(--text2)",
                  borderColor: active ? (s === "buy" ? "var(--green)" : "var(--red)") : "var(--border)",
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2 sm:gap-3">
          {filtered.map((trade, i) => {
            const pnl = calcPnL(trade);
            const pnlPct = calcPnLPercent(trade);
            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="journal-trade-row"
              >
                <div className="flex min-w-0 items-start gap-3 sm:items-center">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--text2)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {trade.side === "buy" ? "B" : "S"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span
                        className="font-mono text-sm font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {trade.symbol}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--text3)" }}>
                        {trade.date}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text2)" }}>
                      {trade.quantity} × ₨{trade.entry_price}
                      {trade.exit_price ? ` → ₨${trade.exit_price}` : " (Open)"}
                      {trade.note && ` · ${trade.note}`}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--border)] pt-3 sm:border-0 sm:pt-0 sm:pl-4">
                  {pnl !== null ? (
                    <div className="text-right sm:text-right">
                      <p
                        className="font-mono text-sm font-semibold tabular-nums"
                        style={{ color: pnl >= 0 ? "var(--green)" : "var(--red)" }}
                      >
                        {formatCurrency(pnl)}
                      </p>
                      <p
                        className="text-[11px] tabular-nums"
                        style={{ color: pnlPct! >= 0 ? "var(--green)" : "var(--red)" }}
                      >
                        {formatPercent(pnlPct!)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium" style={{ color: "var(--text3)" }}>
                      OPEN
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label="Delete trade"
                    className="rounded-md p-2 transition-colors"
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "var(--text2)",
                    }}
                    onClick={() => handleDelete(trade.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--red)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text2)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center" style={{ color: "var(--text2)" }}>
          <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="text-sm">
            {trades.length === 0 ? "No trades yet. Log your first trade!" : "No trades match your filters."}
          </p>
        </div>
      )}
    </div>
  );
}
