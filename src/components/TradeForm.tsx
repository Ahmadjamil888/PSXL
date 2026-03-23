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
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Log Trade
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Log Trade</h2>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Symbol with autocomplete */}
                <div className="relative">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Symbol</label>
                  <Input
                    value={symbol}
                    onChange={(e) => handleSymbolChange(e.target.value)}
                    placeholder="e.g. ENGRO"
                    className="h-11 bg-input border-border font-mono"
                    required
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 glass-strong rounded-lg overflow-hidden">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setSymbol(s); setSuggestions([]); }}
                          className="block w-full text-left px-3 py-2 text-sm font-mono text-foreground hover:bg-accent transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Side toggle */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Side</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSide("buy")}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        side === "buy"
                          ? "bg-profit text-profit-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setSide("sell")}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        side === "sell"
                          ? "bg-loss text-loss-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      SELL
                    </button>
                  </div>
                </div>

                {/* Qty + Entry + Exit */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Qty</label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="100"
                      className="h-11 bg-input border-border font-mono"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Entry ₨</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      placeholder="245.00"
                      className="h-11 bg-input border-border font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Exit ₨</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={exitPrice}
                      onChange={(e) => setExitPrice(e.target.value)}
                      placeholder="260.00"
                      className="h-11 bg-input border-border font-mono"
                    />
                  </div>
                </div>

                {/* Fees + Note */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Fees (optional)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      placeholder="0"
                      className="h-11 bg-input border-border font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Note (optional)</label>
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Breakout trade"
                      className="h-11 bg-input border-border"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11" disabled={addTrade.isPending}>
                  {addTrade.isPending ? "Logging..." : "Log Trade"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
