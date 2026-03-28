import { useState, useRef } from "react";
import { useTrades, calcPnL, calcPnLPercent, useDeleteTrade, useAddTrade } from "@/hooks/useTrades";
import { formatCurrency, formatPercent } from "@/lib/psx";
import TradeForm from "@/components/TradeForm";
import { exportTradesToCSV, parseCSV, parsePDF } from "@/lib/tradeImportExport";
import { Search, Trash2, BookOpen, Download, Upload, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type SideFilter = "all" | "buy" | "sell";
type StatusFilter = "all" | "open" | "closed";

export default function Journal() {
  const { data: trades = [], isLoading } = useTrades();
  const deleteTrade = useDeleteTrade();
  const addTrade = useAddTrade();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
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

  // Import state
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{ trades: any[]; errors: string[] } | null>(null);

  const filtered = trades.filter((t) => {
    if (search && !t.symbol.includes(search.toUpperCase()) && !t.note?.toLowerCase().includes(search.toLowerCase())) return false;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImporting(true);
    try {
      let result;
      if (file.name.endsWith(".pdf")) {
        result = await parsePDF(file);
      } else {
        result = await parseCSV(file);
      }
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="dash-page-kicker">Log</p>
          <h1 className="dash-page-title">Trade Journal</h1>
          <p className="dash-page-desc">{trades.length} trades logged — search, filter, and review.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0 items-center">
          {/* Import */}
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
            {importing ? "Parsing…" : "Import"}
          </button>
          {/* Export */}
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

      {/* Import Preview Modal */}
      <AnimatePresence>
        {importPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "520px", maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>Import Preview</h2>
                <button onClick={() => setImportPreview(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {importPreview.errors.length > 0 && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--red)", marginBottom: "6px" }}>Errors ({importPreview.errors.length})</p>
                  {importPreview.errors.map((e, i) => (
                    <p key={i} style={{ fontSize: "12px", color: "var(--red)", opacity: 0.8 }}>{e}</p>
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
                        {t.date || "—"} · {t.symbol} · {t.side.toUpperCase()} · {t.quantity} × ₨{t.entry_price}
                        {t.exit_price ? ` → ₨${t.exit_price}` : ""}
                      </div>
                    ))}
                    {importPreview.trades.length > 10 && (
                      <p style={{ fontSize: "12px", color: "var(--text3)", textAlign: "center" }}>…and {importPreview.trades.length - 10} more</p>
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

      {/* Search + Quick Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text3)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol or note…"
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
                  padding: "10px 14px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderRadius: "6px",
                  minHeight: "44px",
                  background: active
                    ? s === "buy" ? "rgba(34,197,94,0.12)" : s === "sell" ? "rgba(239,68,68,0.12)" : "var(--surface)"
                    : "transparent",
                  color: active
                    ? s === "buy" ? "var(--green)" : s === "sell" ? "var(--red)" : "var(--text)"
                    : "var(--text2)",
                  borderColor: active
                    ? s === "buy" ? "var(--green)" : s === "sell" ? "var(--red)" : "var(--border2)"
                    : "var(--border)",
                }}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
          {/* Advanced filters toggle */}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            style={{
              padding: "10px 14px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: `1px solid ${showFilters || activeFilterCount > 0 ? "var(--primary)" : "var(--border)"}`,
              cursor: "pointer",
              transition: "all 0.2s",
              borderRadius: "6px",
              minHeight: "44px",
              background: showFilters || activeFilterCount > 0 ? "rgba(var(--primary-rgb,99,102,241),0.1)" : "transparent",
              color: showFilters || activeFilterCount > 0 ? "var(--primary)" : "var(--text2)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Filters
            {activeFilterCount > 0 && (
              <span style={{ background: "var(--primary)", color: "#fff", borderRadius: "999px", fontSize: "10px", padding: "1px 6px", fontWeight: 700 }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className="w-3 h-3" style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
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
              {/* Status */}
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

              {/* Symbol */}
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

              {/* Date From */}
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

              {/* Date To */}
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

              {/* Min Qty */}
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

              {/* Max Qty */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Max Qty</label>
                <input
                  type="number"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  placeholder="∞"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              {/* Min P&L */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Min P&L (₨)</label>
                <input
                  type="number"
                  value={minPnl}
                  onChange={(e) => setMinPnl(e.target.value)}
                  placeholder="e.g. -5000"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              {/* Max P&L */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Max P&L (₨)</label>
                <input
                  type="number"
                  value={maxPnl}
                  onChange={(e) => setMaxPnl(e.target.value)}
                  placeholder="e.g. 10000"
                  className="input-field w-full"
                  style={{ minHeight: "38px", fontSize: "13px" }}
                />
              </div>

              {/* Clear */}
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

      {/* Results count */}
      {filtered.length !== trades.length && (
        <p style={{ fontSize: "12px", color: "var(--text3)" }}>
          Showing {filtered.length} of {trades.length} trades
        </p>
      )}

      {/* Trade List */}
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
                    style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text2)", letterSpacing: "0.02em" }}>
                      {trade.side === "buy" ? "B" : "S"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-mono text-sm font-semibold" style={{ color: "var(--text)" }}>
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
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold tabular-nums" style={{ color: pnl >= 0 ? "var(--green)" : "var(--red)" }}>
                        {formatCurrency(pnl)}
                      </p>
                      <p className="text-[11px] tabular-nums" style={{ color: pnlPct! >= 0 ? "var(--green)" : "var(--red)" }}>
                        {formatPercent(pnlPct!)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium" style={{ color: "var(--text3)" }}>OPEN</span>
                  )}
                  <button
                    type="button"
                    aria-label="Delete trade"
                    className="rounded-md p-2 transition-colors"
                    style={{ background: "transparent", border: "1px solid transparent", color: "var(--text2)" }}
                    onClick={() => handleDelete(trade.id)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.borderColor = "transparent"; }}
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
