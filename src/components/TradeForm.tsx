import { useState, useRef, useEffect } from "react";
import { useAddTrade, TradeInput } from "@/hooks/useTrades";
import { usePSXCompanies } from "@/hooks/usePSXCompanies";
import { toast } from "sonner";
import { Plus, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion { symbol: string; name: string; sector?: string; }
const ACCEPTED_IMAGE_TYPES = "image/*";

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
  const [entryNote, setEntryNote] = useState("");
  const [exitNote, setExitNote] = useState("");
  const [entryTags, setEntryTags] = useState("");
  const [exitTags, setExitTags] = useState("");
  const [entryChartImage, setEntryChartImage] = useState<string | null>(null);
  const [exitChartImage, setExitChartImage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // Behavioral fields
  const [emotion, setEmotion] = useState<"calm" | "fear" | "greedy" | "revenge" | null>(null);
  const [reason, setReason] = useState<"breakout" | "dip_buy" | "news" | "tip" | null>(null);
  const [ruleFollowed, setRuleFollowed] = useState<boolean | null>(null);
  const [mistakeTag, setMistakeTag] = useState<"overtrading" | "late_entry" | "early_exit" | "revenge_trade" | null>(null);
  // Advanced optional fields
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");
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
    setEntryNote(""); setExitNote(""); setEntryTags(""); setExitTags("");
    setEntryChartImage(null); setExitChartImage(null);
    setEmotion(null); setReason(null); setRuleFollowed(null); setMistakeTag(null);
    setStopLoss(""); setTarget("");
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setter(dataUrl);
    } catch {
      toast.error("Failed to read chart image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedEntryTags = parseTags(entryTags);
    const parsedExitTags = parseTags(exitTags);
    const trade: TradeInput = {
      symbol: symbol.toUpperCase(),
      side,
      quantity: parseInt(quantity),
      entry_price: parseFloat(entryPrice),
      exit_price: exitPrice ? parseFloat(exitPrice) : null,
      fees: fees ? parseFloat(fees) : 0,
      note: note.trim() || undefined,
      entry_note: entryNote.trim() || undefined,
      exit_note: exitNote.trim() || undefined,
      entry_tags: parsedEntryTags.length > 0 ? parsedEntryTags : undefined,
      exit_tags: parsedExitTags.length > 0 ? parsedExitTags : undefined,
      entry_chart_image: entryChartImage,
      exit_chart_image: exitChartImage,
      // Behavioral fields
      emotion,
      reason,
      rule_followed: ruleFollowed,
      mistake_tag: mistakeTag,
      // Advanced fields
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
      target: target ? parseFloat(target) : null,
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
      <button
        onClick={() => setOpen(true)}
        className="btn-primary"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <Plus className="w-4 h-4" />
        Log Trade
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", overflowY: "auto" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), var(--bg-card)", border: "1px solid var(--border)", borderRadius: "28px", padding: "24px", width: "100%", maxWidth: "560px", margin: "16px", marginBottom: "32px", boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>PSXL Journal</p>
                  <h2 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text)" }}>Log Trade</h2>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer", padding: "10px", borderRadius: "999px" }}>
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
                            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), var(--bg-card)", border: "1px solid var(--border)",
                            borderRadius: "18px", overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
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
                        background: side === s ? (s === "buy" ? "var(--green)" : "var(--red)") : "rgba(255,255,255,0.03)",
                        color: side === s ? "#000" : "var(--text2)",
                        border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.2s", borderRadius: "999px",
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
                    { label: "Note (optional)", val: note, set: setNote, type: "text", ph: "General trade note", step: undefined },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>{f.label}</label>
                      <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                        placeholder={f.ph} className="input-field" style={{ fontFamily: "monospace", width: "100%" }} step={f.step} />
                    </div>
                  ))}
                </div>

                {/* Entry / Exit Notes, Tags, Charts */}
                <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", marginBottom: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Entry / Exit Journal (Optional)</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Entry note</label>
                      <textarea
                        value={entryNote}
                        onChange={e => setEntryNote(e.target.value)}
                        placeholder="Why did you buy / enter?"
                        className="input-field"
                        style={{ width: "100%", minHeight: "84px", resize: "vertical" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Exit note</label>
                      <textarea
                        value={exitNote}
                        onChange={e => setExitNote(e.target.value)}
                        placeholder="Why did you sell / exit?"
                        className="input-field"
                        style={{ width: "100%", minHeight: "84px", resize: "vertical" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Entry tags</label>
                      <input
                        type="text"
                        value={entryTags}
                        onChange={e => setEntryTags(e.target.value)}
                        placeholder="breakout, support, A+ setup"
                        className="input-field"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Exit tags</label>
                      <input
                        type="text"
                        value={exitTags}
                        onChange={e => setExitTags(e.target.value)}
                        placeholder="target hit, panic sell, trailing stop"
                        className="input-field"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Entry chart pic</label>
                      <input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES}
                        className="input-field"
                        style={{ width: "100%" }}
                        onChange={(e) => handleImageChange(e, setEntryChartImage)}
                      />
                      {entryChartImage && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => window.open(entryChartImage, "_blank", "noopener,noreferrer")}>
                            View Entry Chart
                          </button>
                          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setEntryChartImage(null)}>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Exit chart pic</label>
                      <input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES}
                        className="input-field"
                        style={{ width: "100%" }}
                        onChange={(e) => handleImageChange(e, setExitChartImage)}
                      />
                      {exitChartImage && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => window.open(exitChartImage, "_blank", "noopener,noreferrer")}>
                            View Exit Chart
                          </button>
                          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setExitChartImage(null)}>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Behavioral Fields - Optional */}
                <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", marginBottom: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Behavioral (Optional)</p>
                  
                  {/* Emotion */}
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Emotion before trade</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["calm", "fear", "greedy", "revenge"].map(e => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setEmotion(emotion === e ? null : e as any)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            background: emotion === e ? "var(--accent)" : "transparent",
                            color: emotion === e ? "#000" : "var(--text2)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Reason</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["breakout", "dip_buy", "news", "tip"].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReason(reason === r ? null : r as any)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            background: reason === r ? "var(--accent)" : "transparent",
                            color: reason === r ? "#000" : "var(--text2)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {r.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rule Followed */}
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Rule followed?</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[true, false].map(r => (
                        <button
                          key={String(r)}
                          type="button"
                          onClick={() => setRuleFollowed(ruleFollowed === r ? null : r)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            fontSize: "12px",
                            background: ruleFollowed === r ? (r ? "var(--green)" : "var(--red)") : "transparent",
                            color: ruleFollowed === r ? "#000" : "var(--text2)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {r ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mistake Tag */}
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Mistake tag</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["overtrading", "late_entry", "early_exit", "revenge_trade"].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMistakeTag(mistakeTag === m ? null : m as any)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            background: mistakeTag === m ? "var(--red)" : "transparent",
                            color: mistakeTag === m ? "#000" : "var(--text2)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {m.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Fields - Optional */}
                <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text3)", marginBottom: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Advanced (Optional)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Stop Loss ₨</label>
                      <input
                        type="number"
                        value={stopLoss}
                        onChange={e => setStopLoss(e.target.value)}
                        placeholder="240.00"
                        className="input-field"
                        style={{ fontFamily: "monospace", width: "100%" }}
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "var(--text)", marginBottom: "6px" }}>Target ₨</label>
                      <input
                        type="number"
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        placeholder="270.00"
                        className="input-field"
                        style={{ fontFamily: "monospace", width: "100%" }}
                        step="0.01"
                      />
                    </div>
                  </div>
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

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
