import { useQuery } from "@tanstack/react-query";

export interface PSXQuote {
  symbol: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  currency: string;
  source: "live" | "mock";
}

// ── Parse PSX market-watch text ───────────────────────────────────────────────
// Format per row: SYMBOL<session><indices>open prev high low last change changePct volume
// e.g. "OGDC0820ALLSHR,...274.13 270.00 271.75 262.75 265.62 -8.51 -3.10% 8,371,102"
function parseMarketWatch(text: string): Map<string, PSXQuote> {
  const map = new Map<string, PSXQuote>();
  // Match: SYMBOL + 4-digit session + optional index list + 6 price fields + change + pct + volume
  const re = /([A-Z][A-Z0-9]{1,12})\d{4}[A-Z,]*\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([+-][\d.]+)\s*([+-][\d.]+%)\s*([\d,]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const sym = m[1];
    const open = parseFloat(m[2].replace(/,/g, ""));
    const prev = parseFloat(m[3].replace(/,/g, ""));
    const high = parseFloat(m[4].replace(/,/g, ""));
    const low  = parseFloat(m[5].replace(/,/g, ""));
    const last = parseFloat(m[6].replace(/,/g, ""));
    const chg  = parseFloat(m[7]);
    const vol  = parseInt(m[9].replace(/,/g, ""), 10);
    if (!sym || isNaN(last) || isNaN(chg)) continue;
    map.set(sym, {
      symbol: sym, price: last, prevClose: prev, change: chg,
      changePct: prev > 0 ? (chg / prev) * 100 : 0,
      high, low, open, volume: isNaN(vol) ? 0 : vol,
      currency: "PKR", source: "live",
    });
  }
  return map;
}

// Shared in-memory cache so all cards share one fetch
let cachedMap: Map<string, PSXQuote> | null = null;
let cacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 min

async function getMarketMap(): Promise<Map<string, PSXQuote>> {
  const now = Date.now();
  if (cachedMap && now - cacheTime < CACHE_TTL) return cachedMap;
  try {
    const res = await fetch("https://dps.psx.com.pk/market-watch", {
      credentials: "omit",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const map = parseMarketWatch(text);
    if (map.size > 10) {
      cachedMap = map;
      cacheTime = now;
      return map;
    }
  } catch { /* fall through */ }
  return cachedMap ?? new Map();
}

async function fetchQuote(symbol: string): Promise<PSXQuote> {
  const map = await getMarketMap();
  const live = map.get(symbol.toUpperCase());
  if (live) return live;

  // Deterministic mock fallback
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const price = 50 + (seed % 2000);
  const change = ((seed % 20) - 10) * 0.5;
  return {
    symbol, price, prevClose: price - change, change,
    changePct: price > 0 ? (change / (price - change)) * 100 : 0,
    high: price + Math.abs(change) * 1.5,
    low: price - Math.abs(change) * 1.5,
    open: price - change * 0.5,
    volume: (seed % 500) * 10000,
    currency: "PKR", source: "mock",
  };
}

export function usePSXQuote(symbol: string | null) {
  return useQuery({
    queryKey: ["psx-quote", symbol],
    queryFn: () => fetchQuote(symbol!),
    enabled: !!symbol,
    staleTime: CACHE_TTL,
    gcTime: 1000 * 60 * 15,
    refetchInterval: CACHE_TTL,
  });
}
