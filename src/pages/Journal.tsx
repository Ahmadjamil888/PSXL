import { useState } from "react";
import { useTrades, calcPnL, calcPnLPercent, useDeleteTrade } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import TradeForm from "@/components/TradeForm";
import { Input } from "@/components/ui/input";
import { Search, Trash2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import "./Landing.css";

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
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
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
            Trade Journal
          </h1>
          <p style={{ 
            fontSize: '15px',
            fontWeight: '300',
            lineHeight: '1.7',
            color: 'var(--text2)'
          }}>
            {trades.length} trades logged
          </p>
        </div>
        <TradeForm />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol or note..."
            className="input-field"
            style={{ 
              paddingLeft: '36px',
              width: '100%'
            }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "buy", "sell"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSideFilter(s)}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '400',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: sideFilter === s 
                  ? s === "buy" ? 'var(--green)' : s === "sell" ? 'var(--red)' : 'var(--surface)'
                  : 'transparent',
                color: sideFilter === s 
                  ? s === "buy" || s === "sell" ? '#000' : 'var(--text)'
                  : 'var(--text2)',
                border: '1px solid var(--border2)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Trade List */}
      {filtered.length > 0 ? (
        <div className="space-y-1" style={{ background: 'var(--border)' }}>
          {filtered.map((trade, i) => {
            const pnl = calcPnL(trade);
            const pnlPct = calcPnLPercent(trade);
            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="stat-card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shrink: 0,
                    background: trade.side === "buy" ? 'var(--green)' : 'var(--red)',
                    background: trade.side === "buy" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: trade.side === "buy" ? 'var(--green)' : 'var(--red)'
                    }}>
                      {trade.side === "buy" ? "B" : "S"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: 'var(--text)'
                      }}>{trade.symbol}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{trade.date}</span>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'var(--text2)', 
                      marginTop: '2px' 
                    }}>
                      {trade.quantity} × ₨{trade.entry_price}
                      {trade.exit_price ? ` → ₨${trade.exit_price}` : " (Open)"}
                      {trade.note && ` · ${trade.note}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {pnl !== null ? (
                    <div className="text-right">
                      <p style={{
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: pnl >= 0 ? 'var(--green)' : 'var(--red)'
                      }}>
                        {formatCurrency(pnl)}
                      </p>
                      <p style={{
                        fontSize: '11px',
                        color: pnlPct! >= 0 ? 'var(--green)' : 'var(--red)'
                      }}>
                        {formatPercent(pnlPct!)}
                      </p>
                    </div>
                  ) : (
                    <span style={{ 
                      fontSize: '11px', 
                      color: 'var(--text3)', 
                      fontWeight: '500' 
                    }}>
                      OPEN
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(trade.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text2)',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--red)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: 'var(--text2)' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ opacity: '0.3' }} />
          <p>{trades.length === 0 ? "No trades yet. Log your first trade!" : "No trades match your filters."}</p>
        </div>
      )}
    </div>
  );
}
