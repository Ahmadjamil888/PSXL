import { useState, useRef, useEffect } from "react";
import { useAddTrade, TradeInput } from "@/hooks/useTrades";
import { usePSXCompanies } from "@/hooks/usePSXCompanies";
import { toast } from "sonner";
import { Plus, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/landing.css";

interface Suggestion { symbol: string; name: string; sector?: string; }

export default function TradeForm() {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [fees, setFees] = useState("");
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addTrade = useAddTrade();
  const { data: companies = [] } = usePSXCompanies();

  const getSuggestions = (val: string): Suggestion[] => {
    if (!val.trim()) return [];
    const q = val.trim().toUpperCase();
    const bySymbol = companies.filter(c => c.symbol.startsWith(q));
    const byName = companies.filter(c => !c.symbol.startsWith(q) && c.name.toUpperCase().includes(q));
    return [...bySymbol, ...byName].slice(0, 8);
  };

  const handleSymbolChange = (val: string) => {
    setSymbol(val.toUpperCase());
    setSelectedName("");
    setActiveIdx(-1);
    const s = getSuggestions(val);
    setSuggestions(s);
    setShowSuggestions(s.length > 0);
  };

  const selectSuggestion = (s: Suggestion) => {
    setSymbol(s.symbol);
    setSelectedName(s.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); selectSuggestion(suggestions[activeIdx]); }
    else if (e.key === "Escape") { setShowSuggestions(false); }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const reset = () => {
    setSymbol(""); setSelectedName(""); setSide("buy");
    setQuantity(""); setEntryPrice(""); setExitPrice("");
    setFees(""); setNote(""); setSuggestions([]); setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trade: TradeInput = {
      symbol: symbol.toUpperCase(),
      side,
      quantity: parseInt(quantity),
      entry_price: parseFloat(entryPrice),
      exit_price: exitPrice ? parseFloat(exitPrice) : null,
      fees: fees ? parseFloat(fees) : 0,
      note: note || undefined,
    };
    try {
      await addTrade.mutateAsync(trade);
      toast.success("Trade logged!");
      reset();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add trade");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Plus className="w-4 h-4" />
        Log Trade
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)", overflowY: "auto" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", width: "100%", maxWidth: "480px", margin: "16px", marginBottom: "32px" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)" }}>Log Trade</h2>
                <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", padding: "4px" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Symbol autocomplete */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>
                    Company / Symbol
                  </label>
                  <div style={{ position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={symbol}
                      onChange={e => handleSymbolChange(e.target.value)}
                      onFocus={() => symbol && setShowSuggestions(suggestions.length > 0)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type symbol or company name…"
                      className="input-field"
                      style={{ fontFamily: "monospace", width: "100%", paddingLeft: "30px" }}
                      required
                      autoComplete="off"
                    />
                    {/* Selected company name hint */}
                    {selectedName && (
                      <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "var(--text3)", pointerEvents: "none", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedName}
                      </span>
                    )}

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12 }}
                          style={{
                            position: "absolute", zIndex: 20, width: "100%", top: "calc(100% + 4px)",
                            background: "var(--surface)", border: "1px solid var(--border)",
                            borderRadius: "6px", overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                          }}
                        >
                          {suggestions.map((s, i) => {
                            const q = symbol.toUpperCase();
                            // Highlight matching part of symbol
                            const symMatch = s.symbol.startsWith(q);
                            return (
                              <button
                                key={s.symbol}
                                type="button"
                                onMouseDown={e => { e.preventDefault(); selectSuggestion(s); }}
                                style={{
                                  display: "flex", alignItems: "center", justifyContent: "space-between",
                                  width: "100%", textAlign: "left",
                                  padding: "10px 12px", gap: "10px",
                                  background: i === activeIdx ? "var(--bg2)" : "transparent",
                                  border: "none", cursor: "pointer",
                                  borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                                  transition: "background 0.1s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg2)")}
                                onMouseLeave={e => (e.currentTarget.style.background = i === activeIdx ? "var(--bg2)" : "transparent")}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                                  <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "var(--text)", flexShrink: 0 }}>
                                    {symMatch ? (
                                      <>
                                        <span style={{ color: "var(--green)" }}>{s.symbol.slice(0, q.length)}</span>
                                        {s.symbol.slice(q.length)}
                                      </>
                                    ) : s.symbol}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {s.name}
                                  </span>
                                </div>
                                {s.sector && (
                                  <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text3)", flexShrink: 0 }}>
                                    {s.sector}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Side toggle */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Side</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["buy", "sell"] as const).map(s => (
                      <button key={s} type="button" onClick={() => setSide(s)} style={{
                        flex: 1, padding: "10px", fontSize: "12px", fontWeight: 400,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        background: side === s ? (s === "buy" ? "var(--green)" : "var(--red)") : "transparent",
                        color: side === s ? "#000" : "var(--text2)",
                        border: "1px solid var(--border2)", cursor: "pointer", transition: "all 0.2s",
                      }}>
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qty + Entry + Exit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Qty", val: quantity, set: setQuantity, type: "number", ph: "100", req: true, step: undefined, min: "1" },
                    { label: "Entry ₨", val: entryPrice, set: setEntryPrice, type: "number", ph: "245.00", req: true, step: "0.01", min: undefined },
                    { label: "Exit ₨", val: exitPrice, set: setExitPrice, type: "number", ph: "260.00", req: false, step: "0.01", min: undefined },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>{f.label}</label>
                      <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                        placeholder={f.ph} className="input-field" style={{ fontFamily: "monospace", width: "100%" }}
                        required={f.req} step={f.step} min={f.min} />
                    </div>
                  ))}
                </div>

                {/* Fees + Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Fees (optional)", val: fees, set: setFees, type: "number", ph: "0", step: "0.01" },
                    { label: "Note (optional)", val: note, set: setNote, type: "text", ph: "Breakout trade", step: undefined },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>{f.label}</label>
                      <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                        placeholder={f.ph} className="input-field" style={{ fontFamily: "monospace", width: "100%" }} step={f.step} />
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={addTrade.isPending}>
                  {addTrade.isPending ? "Logging…" : "Log Trade"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
