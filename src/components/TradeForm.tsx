import { useState } from "react";
import { useAddTrade, TradeInput } from "@/hooks/useTrades";
import { PSX_SYMBOLS } from "@/lib/psx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TradeForm() {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [fees, setFees] = useState("");
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const addTrade = useAddTrade();

  const handleSymbolChange = (val: string) => {
    setSymbol(val.toUpperCase());
    if (val.length > 0) {
      setSuggestions(PSX_SYMBOLS.filter((s) => s.startsWith(val.toUpperCase())).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const reset = () => {
    setSymbol("");
    setSide("buy");
    setQuantity("");
    setEntryPrice("");
    setExitPrice("");
    setFees("");
    setNote("");
    setSuggestions([]);
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
      <button onClick={() => setOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Plus className="w-4 h-4" />
        Log Trade
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
              padding: '16px'
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '0px',
                padding: '24px',
                width: '100%',
                maxWidth: '480px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text)'
                }}>
                  Log Trade
                </h2>
                <button 
                  onClick={() => setOpen(false)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text2)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text2)';
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Symbol with autocomplete */}
                <div style={{ position: 'relative' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: 'var(--text)',
                    marginBottom: '6px'
                  }}>
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => handleSymbolChange(e.target.value)}
                    placeholder="e.g. ENGRO"
                    className="input-field"
                    style={{ 
                      fontFamily: 'monospace',
                      width: '100%'
                    }}
                    required
                  />
                  {suggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      zIndex: 10,
                      width: '100%',
                      marginTop: '4px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '0px',
                      overflow: 'hidden'
                    }}>
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setSymbol(s); setSuggestions([]); }}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            color: 'var(--text)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Side toggle */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: 'var(--text)',
                    marginBottom: '6px'
                  }}>
                    Side
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setSide("buy")}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: '400',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        background: side === "buy" ? 'var(--green)' : 'transparent',
                        color: side === "buy" ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setSide("sell")}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: '400',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        background: side === "sell" ? 'var(--red)' : 'transparent',
                        color: side === "sell" ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      SELL
                    </button>
                  </div>
                </div>

                {/* Qty + Entry + Exit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: 'var(--text)',
                      marginBottom: '6px'
                    }}>
                      Qty
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="100"
                      className="input-field"
                      style={{ 
                        fontFamily: 'monospace',
                        width: '100%'
                      }}
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: 'var(--text)',
                      marginBottom: '6px'
                    }}>
                      Entry ₨
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      placeholder="245.00"
                      className="input-field"
                      style={{ 
                        fontFamily: 'monospace',
                        width: '100%'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: 'var(--text)',
                      marginBottom: '6px'
                    }}>
                      Exit ₨
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={exitPrice}
                      onChange={(e) => setExitPrice(e.target.value)}
                      placeholder="260.00"
                      className="input-field"
                      style={{ 
                        fontFamily: 'monospace',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                {/* Fees + Note */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: 'var(--text)',
                      marginBottom: '6px'
                    }}>
                      Fees (optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      placeholder="0"
                      className="input-field"
                      style={{ 
                        fontFamily: 'monospace',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: 'var(--text)',
                      marginBottom: '6px'
                    }}>
                      Note (optional)
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Breakout trade"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={addTrade.isPending}
                >
                  {addTrade.isPending ? "Logging..." : "Log Trade"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
