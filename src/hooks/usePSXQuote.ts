import { useQuery } from "@tanstack/react-query";
import { toYahooPsxSymbol } from "@/lib/market/yahooSymbol";

export interface PSXQuote {
  symbol: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number | null;
  currency: string;
  source: "live" | "mock";
}

function proxyBase(): string | null {
  const env = import.meta.env.VITE_MARKET_PROXY_URL as string | undefined;
  if (env) return env.replace(/\/$/, "");
  if (import.meta.env.DEV) return "/api/yahoo";
  return null; // production without proxy → mock
}

async function fetchQuote(symbol: string): Promise<PSXQuote> {
  const base = proxyBase();
  const yahoo = toYahooPsxSymbol(symbol);

  if (base) {
    try {
      const url = `${base}/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=5d`;
      const res = await fetch(url, { credentials: "omit", signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (meta?.regularMarketPrice) {
          const price: number = meta.regularMarketPrice;
          const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
          const change = price - prev;
          const changePct = prev > 0 ? (change / prev) * 100 : 0;
          return {
            symbol,
            price,
            prevClose: prev,
            change,
            changePct,
            high: meta.regularMarketDayHigh ?? price,
            low: meta.regularMarketDayLow ?? price,
            volume: meta.regularMarketVolume ?? 0,
            marketCap: meta.marketCap ?? null,
            currency: meta.currency ?? "PKR",
            source: "live",
          };
        }
      }
    } catch { /* fall through to mock */ }
  }

  // Deterministic mock based on symbol hash
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const price = 50 + (seed % 2000);
  const change = ((seed % 20) - 10) * 0.5;
  return {
    symbol, price, prevClose: price - change, change,
    changePct: price > 0 ? (change / (price - change)) * 100 : 0,
    high: price + Math.abs(change) * 1.5,
    low: price - Math.abs(change) * 1.5,
    volume: (seed % 500) * 10000,
    marketCap: null, currency: "PKR", source: "mock",
  };
}

export function usePSXQuote(symbol: string | null) {
  return useQuery({
    queryKey: ["psx-quote", symbol],
    queryFn: () => fetchQuote(symbol!),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 2,   // 2 min
    gcTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 2, // auto-refresh every 2 min
  });
}
