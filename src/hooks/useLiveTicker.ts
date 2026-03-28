import { useState, useEffect } from "react";

export interface TickerItem {
  sym: string;
  val: string;
  chg: string;
  pct: string;
  pos: boolean;
}

const TICKER_SYMBOLS = [
  "OGDC", "HBL", "PSO", "LUCK", "SYS", "MCB", "ENGRO",
  "PPL", "EFERT", "UBL", "MARI", "HUBC", "FCCL", "BAHL", "TRG",
];

// Fallback static data — shown while loading or if API unavailable
export const FALLBACK_TICKER: TickerItem[] = [
  { sym: "OGDC",  val: "187.40",  chg: "+2.30",  pct: "+1.24%", pos: true  },
  { sym: "HBL",   val: "221.15",  chg: "-3.20",  pct: "-1.43%", pos: false },
  { sym: "PSO",   val: "312.80",  chg: "+5.60",  pct: "+1.82%", pos: true  },
  { sym: "LUCK",  val: "924.50",  chg: "+12.70", pct: "+1.39%", pos: true  },
  { sym: "SYS",   val: "582.30",  chg: "+8.90",  pct: "+1.55%", pos: true  },
  { sym: "MCB",   val: "344.20",  chg: "-1.80",  pct: "-0.52%", pos: false },
  { sym: "ENGRO", val: "326.40",  chg: "+4.10",  pct: "+1.27%", pos: true  },
  { sym: "PPL",   val: "142.60",  chg: "-2.40",  pct: "-1.66%", pos: false },
  { sym: "EFERT", val: "128.30",  chg: "+2.10",  pct: "+1.66%", pos: true  },
  { sym: "UBL",   val: "278.90",  chg: "-4.20",  pct: "-1.48%", pos: false },
  { sym: "MARI",  val: "2340.50", chg: "+34.70", pct: "+1.50%", pos: true  },
  { sym: "HUBC",  val: "118.70",  chg: "+1.40",  pct: "+1.19%", pos: true  },
  { sym: "FCCL",  val: "38.20",   chg: "-0.60",  pct: "-1.55%", pos: false },
  { sym: "BAHL",  val: "103.40",  chg: "+2.80",  pct: "+2.78%", pos: true  },
  { sym: "TRG",   val: "156.80",  chg: "+3.20",  pct: "+2.08%", pos: true  },
];

// Try fetching via the Vite dev proxy (/api/yahoo) or a VITE_MARKET_PROXY_URL env var.
// In production without a proxy, this will fail and we fall back to static data.
async function fetchQuote(sym: string): Promise<TickerItem | null> {
  const proxyBase = import.meta.env.VITE_MARKET_PROXY_URL
    ? (import.meta.env.VITE_MARKET_PROXY_URL as string).replace(/\/$/, "")
    : import.meta.env.DEV
      ? "/api/yahoo"
      : null;

  if (!proxyBase) return null;

  const yahoo = `${sym}.KA`;
  const url = `${proxyBase}/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=1d&range=5d`;

  try {
    const res = await fetch(url, { credentials: "omit", signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;

    const price: number = meta.regularMarketPrice;
    const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prev;
    const pct = prev > 0 ? (change / prev) * 100 : 0;

    return {
      sym,
      val: price.toFixed(2),
      chg: `${change >= 0 ? "+" : ""}${change.toFixed(2)}`,
      pct: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
      pos: change >= 0,
    };
  } catch {
    return null;
  }
}

export function useLiveTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_TICKER);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Probe first symbol — if it fails, skip the rest
      const probe = await fetchQuote(TICKER_SYMBOLS[0]);
      if (cancelled || !probe) return;

      const results = await Promise.all(TICKER_SYMBOLS.map(fetchQuote));
      if (cancelled) return;

      const live = results.filter((r): r is TickerItem => r !== null);
      if (live.length >= 5) {
        setItems(live);
        setIsLive(true);
      }
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { items, isLive };
}
