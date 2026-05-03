import { useRef, useState, type CSSProperties, type ChangeEvent } from "react";
import { useTrades, calcPnL, calcPnLPercent, useDeleteTrade, useAddTrade, type Trade } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import TradeForm from "@/components/TradeForm";
import { exportTradesToCSV, parseCSV, parsePDF } from "@/lib/tradeImportExport";
import { Search, Trash2, BookOpen, Download, Upload, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const COLORS = {
  success: "var(--success, #22C55E)",
  successLight: "var(--success-light, rgba(34, 197, 94, 0.15))",
  danger: "var(--danger, #EF4444)",
  dangerLight: "var(--danger-light, rgba(239, 68, 68, 0.15))",
  primary: "var(--primary, #10B981)",
  textPrimary: "var(--text-primary, #FFFFFF)",
  textSecondary: "var(--text-secondary, #A3A3A3)",
  textTertiary: "var(--text-tertiary, #737373)",
  border: "var(--border-default, #2A2A2A)",
  borderHover: "var(--border-hover, #3A3A3A)",
  bgCard: "var(--bg-card, #1A1A1A)",
  bgInput: "var(--bg-input, #141414)",
};

const tagStyle: CSSProperties = {
  fontSize: "11px",
  color: "var(--text2)",
  border: "1px solid var(--border)",
  borderRadius: "999px",
  padding: "4px 8px",
};

type SideFilter = "all" | "buy" | "sell";
type StatusFilter = "all" | "open" | "closed";

export default function Journal() {
  const { data: trades = [], isLoading } = useTrades();
  const deleteTrade = useDeleteTrade();
  const addTrade = useAddTrade();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [symbolFilter, setSymbolFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [minPnl, setMinPnl] = useState("");
  const [maxPnl, setMaxPnl] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{ trades: any[]; errors: string[] } | null>(null);

  const filtered = trades.filter((t) => {
    if (search) {
      const query = search.toLowerCase();
      const searchable = [
        t.symbol,
        t.note ?? "",
        t.entry_note ?? "",
        t.exit_note ?? "",
        ...(t.entry_tags ?? []),
        ...(t.exit_tags ?? []),
      ].join(" ").toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    if (sideFilter !== "all" && t.side !== sideFilter) return false;
    if (statusFilter === "open" && t.exit_price != null) return false;
    if (statusFilter === "closed" && t.exit_price == null) return false;
    if (symbolFilter && !t.symbol.includes(symbolFilter.toUpperCase())) return false;
    if (dateFrom && t.date < dateFrom) return false;
    if (dateTo && t.date > dateTo) return false;
    if (minQty && t.quantity < Number(minQty)) return false;
    if (maxQty && t.quantity > Number(maxQty)) return false;
    const pnl = calcPnL(t);
    if (minPnl && (pnl === null || pnl < Number(minPnl))) return false;
    if (maxPnl && (pnl === null || pnl > Number(maxPnl))) return false;
    return true;
  });

  const activeFilterCount = [
    sideFilter !== "all",
    statusFilter !== "all",
    symbolFilter,
    dateFrom,
    dateTo,
    minQty,
    maxQty,
    minPnl,
    maxPnl,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSideFilter("all");
    setStatusFilter("all");
    setSymbolFilter("");
    setDateFrom("");
    setDateTo("");
    setMinQty("");
    setMaxQty("");
    setMinPnl("");
    setMaxPnl("");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTrade.mutateAsync(id);
      toast.success("Trade deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    const toExport = filtered.length > 0 ? filtered : trades;
    exportTradesToCSV(toExport, `trades-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success(`Exported ${toExport.length} trades`);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImporting(true);
    try {
      const result = file.name.endsWith(".pdf") ? await parsePDF(file) : await parseCSV(file);
      setImportPreview(result);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse file");
    } finally {
      setImporting(false);
    }
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    let success = 0;
    let fail = 0;

    for (const t of importPreview.trades) {
      try {
        await addTrade.mutateAsync(t);
        success++;
      } catch {
        fail++;
      }
    }

    toast.success(`Imported ${success} trades${fail > 0 ? `, ${fail} failed` : ""}`);
    setImportPreview(null);
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
          <p className="dash-page-desc">{trades.length} trades logged - search, filter, and review.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "40px", padding: "0 14px", fontSize: "13px" }}
          >
            <Upload className="w-4 h-4" />
            {importing ? "Parsing..." : "Import"}
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "40px", padding: "0 14px", fontSize: "13px" }}
          >
            <Download className="w-4 h-4" />
            Export{filtered.length !== trades.length ? ` (${filtered.length})` : ""}
          </button>
          <TradeForm />
        </div>
      </div>

      <AnimatePresence>
        {importPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "520px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>Import Preview</h2>
                <button
                  onClick={() => setImportPreview(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textSecondary, padding: "4px", borderRadius: "6px", transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {importPreview.errors.length > 0 && (
                <div style={{ background: COLORS.dangerLight, border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: COLORS.danger, marginBottom: "6px" }}>Errors ({importPreview.errors.length})</p>
                  {importPreview.errors.map((e, i) => (
                    <p key={i} style={{ fontSize: "12px", color: COLORS.danger, opacity: 0.9 }}>{e}</p>
                  ))}
                </div>
              )}

              {importPreview.trades.length > 0 ? (
                <>
                  <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "12px" }}>
                    {importPreview.trades.length} trade{importPreview.trades.length !== 1 ? "s" : ""} ready to import:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                    {importPreview.trades.slice(0, 10).map((t, i) => (
                      <div key={i} style={{ background: "var(--bg2)", borderRadius: "6px", padding: "8px 12px", fontSize: "12px", color: "var(--text2)", fontFamily: "monospace" }}>
                        {t.date || "-"} · {t.symbol} · {t.side.toUpperCase()} · {t.quantity} x Rs.{t.entry_price}
                        {t.exit_price ? ` -> Rs.${t.exit_price}` : ""}
                      </div>
                    ))}
                    {importPreview.trades.length > 10 && (
                      <p style={{ fontSize: "12px", color: "var(--text3)", textAlign: "center" }}>...and {importPreview.trades.length - 10} more</p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={confirmImport} className="btn-primary" style={{ flex: 1 }}>
                      Confirm Import
                    </button>
                    <button onClick={() => setImportPreview(null)} className="btn-secondary" style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontSize: "14px", color: "var(--text2)" }}>No valid trades found in file.</p>
                  <button onClick={() => setImportPreview(null)} className="btn-secondary" style={{ marginTop: "16px" }}>Close</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text3)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol, notes, or tags..."
            className="input-field w-full"
            style={{ paddingLeft: "40px", minHeight: "44px" }}
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          {(["all", "buy", "sell"] as const).map((s) => {
            const active = sideFilter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSideFilter(s)}
                style={{
                  padding: "10px 16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderRadius: "8px",
                  minHeight: "44px",
                  background: active
                    ? s === "buy" ? COLORS.successLight : s === "sell" ? COLORS.dangerLight : COLORS.bgCard
                    : "transparent",
                  color: active
                    ? s === "buy" ? COLORS.success : s === "sell" ? COLORS.danger : COLORS.textPrimary
                    : COLORS.textSecondary,
                  borderColor: active
                    ? s === "buy" ? COLORS.success : s === "sell" ? COLORS.danger : COLORS.borderHover
                    : COLORS.border,
                }}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            style={{
              padding: "10px 16px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: `1px solid ${showFilters || activeFilterCount > 0 ? COLORS.primary : COLORS.border}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderRadius: "8px",
              minHeight: "44px",
              background: showFilters || activeFilterCount > 0 ? "rgba(16, 185, 129, 0.1)" : "transparent",
              color: showFilters || activeFilterCount > 0 ? COLORS.primary : COLORS.textSecondary,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Filters
            {activeFilterCount > 0 && (
              <span style={{ background: COLORS.primary, color: "#fff", borderRadius: "999px", fontSize: "10px", padding: "2px 8px", fontWeight: 700 }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className="w-3 h-3" style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Symbol</label>
                <input
                  type="text"
                  value={symbolFilter}
                  onChange={(e) => setSymbolFilter(e.target.value)}
                  placeholder="e.g. ENGRO"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Min Qty</label>
                <input
                  type="number"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  placeholder="0"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Max Qty</label>
                <input
                  type="number"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  placeholder="infinity"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Min P&L (Rs.)</label>
                <input
                  type="number"
                  value={minPnl}
                  onChange={(e) => setMinPnl(e.target.value)}
                  placeholder="e.g. -5000"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Max P&L (Rs.)</label>
                <input
                  type="number"
                  value={maxPnl}
                  onChange={(e) => setMaxPnl(e.target.value)}
                  placeholder="e.g. 10000"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              {activeFilterCount > 0 && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-secondary w-full"
                    style={{ minHeight: "38px", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <X className="w-3 h-3" /> Clear Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length !== trades.length && (
        <p style={{ fontSize: "13px", color: COLORS.textTertiary }}>
          Showing {filtered.length} of {trades.length} trades
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((trade, i) => {
            const pnl = calcPnL(trade);
            const pnlPct = calcPnLPercent(trade);
            const summary = buildTradeMetaSummary(trade);

            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="journal-trade-row"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.bgCard} 0%, #141414 100%)`,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "12px",
                  padding: "16px 18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.borderHover;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";
                }}
              >
                <div className="flex min-w-0 items-start gap-4 sm:items-center">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: trade.side === "buy" ? COLORS.successLight : COLORS.dangerLight,
                      border: `1px solid ${trade.side === "buy" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: trade.side === "buy" ? COLORS.success : COLORS.danger, letterSpacing: "0.02em" }}>
                      {trade.side === "buy" ? "B" : "S"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                        {trade.symbol}
                      </span>
                      <span className="text-[12px]" style={{ color: COLORS.textTertiary }}>
                        {trade.date}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: COLORS.textSecondary }}>
                      {trade.quantity.toLocaleString()} x Rs.{trade.entry_price}
                      {trade.exit_price ? ` -> Rs.${trade.exit_price}` : " (Open)"}
                      {summary && ` · ${summary}`}
                    </p>
                    {(trade.entry_tags?.length || trade.exit_tags?.length || trade.entry_chart_image || trade.exit_chart_image) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {trade.entry_tags?.map((tag) => (
                          <span key={`entry-${trade.id}-${tag}`} style={tagStyle}>Entry: {tag}</span>
                        ))}
                        {trade.exit_tags?.map((tag) => (
                          <span key={`exit-${trade.id}-${tag}`} style={tagStyle}>Exit: {tag}</span>
                        ))}
                        {trade.entry_chart_image && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ minHeight: "30px", padding: "0 10px", fontSize: "11px" }}
                            onClick={() => window.open(trade.entry_chart_image!, "_blank", "noopener,noreferrer")}
                          >
                            Entry Chart
                          </button>
                        )}
                        {trade.exit_chart_image && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ minHeight: "30px", padding: "0 10px", fontSize: "11px" }}
                            onClick={() => window.open(trade.exit_chart_image!, "_blank", "noopener,noreferrer")}
                          >
                            Exit Chart
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 border-t sm:border-0 sm:pl-4" style={{ borderColor: COLORS.border, paddingTop: "12px" }}>
                  {pnl !== null ? (
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold tabular-nums" style={{ color: pnl >= 0 ? COLORS.success : COLORS.danger }}>
                        {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}
                      </p>
                      <p className="text-[11px] tabular-nums" style={{ color: (pnlPct ?? 0) >= 0 ? COLORS.success : COLORS.danger }}>
                        {(pnlPct ?? 0) >= 0 ? "+" : ""}{formatPercent(pnlPct ?? 0)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold tracking-wider" style={{ color: COLORS.textTertiary }}>OPEN</span>
                  )}
                  <button
                    type="button"
                    aria-label="Delete trade"
                    className="rounded-lg p-2 transition-all"
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                      color: COLORS.textSecondary,
                    }}
                    onClick={() => handleDelete(trade.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = COLORS.danger;
                      e.currentTarget.style.borderColor = COLORS.border;
                      e.currentTarget.style.background = "rgba(239,68,68,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = COLORS.textSecondary;
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background = "transparent";
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
        <div className="text-center py-14 rounded-xl" style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}>
          <BookOpen className="mx-auto mb-3 h-12 w-12" style={{ opacity: 0.3 }} />
          <p className="text-sm">
            {trades.length === 0 ? "No trades yet. Log your first trade!" : "No trades match your filters."}
          </p>
        </div>
      )}
    </div>
  );
}

function buildTradeMetaSummary(trade: Trade) {
  const parts = [
    trade.note,
    trade.entry_note ? `Entry note: ${trade.entry_note}` : null,
    trade.exit_note ? `Exit note: ${trade.exit_note}` : null,
  ].filter(Boolean);

  return parts.join(" | ");
}
