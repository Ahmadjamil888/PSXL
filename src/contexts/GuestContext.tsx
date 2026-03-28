import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { Trade, TradeInput } from "@/hooks/useTrades";

const STORAGE_KEY = "psxl_guest_trades";

function loadFromStorage(): Trade[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToStorage(trades: Trade[]) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trades)); } catch {}
}

function makeId() {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface GuestContextType {
  isGuest: boolean;
  guestTrades: Trade[];
  addGuestTrade: (input: TradeInput) => Trade;
  deleteGuestTrade: (id: string) => void;
  clearGuestData: () => void;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(() => {
    return sessionStorage.getItem("psxl_guest_mode") === "true";
  });
  const [guestTrades, setGuestTrades] = useState<Trade[]>(() =>
    sessionStorage.getItem("psxl_guest_mode") === "true" ? loadFromStorage() : []
  );

  // Persist trades whenever they change
  useEffect(() => {
    if (isGuest) saveToStorage(guestTrades);
  }, [guestTrades, isGuest]);

  const enterGuestMode = useCallback(() => {
    sessionStorage.setItem("psxl_guest_mode", "true");
    setIsGuest(true);
    setGuestTrades(loadFromStorage());
  }, []);

  const exitGuestMode = useCallback(() => {
    sessionStorage.removeItem("psxl_guest_mode");
    setIsGuest(false);
  }, []);

  const addGuestTrade = useCallback((input: TradeInput): Trade => {
    const now = new Date().toISOString();
    const trade: Trade = {
      id: makeId(),
      user_id: "guest",
      account_id: null,
      date: input.date ?? now.split("T")[0],
      symbol: input.symbol.toUpperCase(),
      side: input.side,
      quantity: input.quantity,
      entry_price: input.entry_price,
      exit_price: input.exit_price ?? null,
      fees: input.fees ?? 0,
      note: input.note ?? null,
      created_at: now,
      updated_at: now,
    };
    setGuestTrades(prev => [trade, ...prev]);
    return trade;
  }, []);

  const deleteGuestTrade = useCallback((id: string) => {
    setGuestTrades(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearGuestData = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setGuestTrades([]);
  }, []);

  return (
    <GuestContext.Provider value={{ isGuest, guestTrades, addGuestTrade, deleteGuestTrade, clearGuestData, enterGuestMode, exitGuestMode }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used within GuestProvider");
  return ctx;
}

/** Returns guest trades as JSON string for migration to DB after signup */
export function getGuestTradesForMigration(): TradeInput[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const trades: Trade[] = JSON.parse(raw);
    return trades.map(t => ({
      symbol: t.symbol, side: t.side, quantity: t.quantity,
      entry_price: t.entry_price, exit_price: t.exit_price,
      fees: t.fees ?? 0, note: t.note ?? undefined, date: t.date,
    }));
  } catch { return []; }
}
