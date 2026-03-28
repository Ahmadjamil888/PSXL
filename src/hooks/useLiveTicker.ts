import { useState, useEffect } from "react";

export interface TickerItem {
  sym: string;
  val: string;
  chg: string;
  pct: string;
  pos: boolean;
}

// Symbols to show in the ticker (prominent PSX stocks)
const TICKER_SYMBOLS = [
  "OGDC","HBL","PSO","LUCK","SYS","MCB","ENGRO","PPL","EFERT","UBL",
  "MARI","HUBC","FCCL","BAHL","TRG","FFC","MEBL","INDU","SEARL","NESTLE",
];

export const FALLBACK_TICKER: TickerItem[] = [
  { sym:"OGDC",  val:"265.62", chg:"-8.51",  pct:"-3.10%", pos:false },
  { sym:"HBL",   val:"252.90", chg:"-2.26",  pct:"-0.89%", pos:false },
  { sym:"PSO",   val:"351.57", chg:"-8.36",  pct:"-2.32%", pos:false },
  { sym:"LUCK",  val:"362.30", chg:"-4.26",  pct:"-1.16%", pos:false },
  { sym:"SYS",   val:"140.30", chg:"+2.69",  pct:"+1.96%", pos:true  },
  { sym:"MCB",   val:"366.35", chg:"-0.35",  pct:"-0.09%", pos:false },
  { sym:"ENGRO", val:"271.84", chg:"+0.18",  pct:"+0.07%", pos:true  },
  { sym:"PPL",   val:"204.68", chg:"-6.20",  pct:"-2.94%", pos:false },
  { sym:"EFERT", val:"197.75", chg:"-2.20",  pct:"-1.10%", pos:false },
  { sym:"UBL",   val:"344.45", chg:"-3.13",  pct:"-0.90%", pos:false },
  { sym:"MARI",  val:"617.92", chg:"-9.22",  pct:"-1.47%", pos:false },
  { sym:"HUBC",  val:"196.94", chg:"-0.61",  pct:"-0.31%", pos:false },
  { sym:"FCCL",  val:"40.16",  chg:"-0.39",  pct:"-0.96%", pos:false },
  { sym:"BAHL",  val:"152.83", chg:"-2.56",  pct:"-1.65%", pos:false },
  { sym:"TRG",   val:"46.22",  chg:"-0.11",  pct:"-0.24%", pos:false },
  { sym:"FFC",   val:"498.44", chg:"-0.19",  pct:"-0.04%", pos:false },
  { sym:"MEBL",  val:"457.86", chg:"+4.36",  pct:"+0.96%", pos:true  },
  { sym:"INDU",  val:"1800.30",chg:"+6.28",  pct:"+0.35%", pos:true  },
  { sym:"SEARL", val:"81.60",  chg:"-1.96",  pct:"-2.35%", pos:false },
  { sym:"NESTLE",val:"7742.38",chg:"-5.62",  pct:"-0.07%", pos:false },
];

/**
 * Parses the PSX market-watch page text response.
 * Format per entry: SYMBOL<digits><indices>price open high low last change changePct volume
 * e.g. "OGDC0820ALLSHR,...274.13270.00271.75262.75265.62 -8.51 -3.10%8,371,102"
 */
function parseMarketWatch(text: string): Map<string, TickerItem> {
  const map = new Map<string, TickerItem>();
  // Each entry starts with a symbol (uppercase letters/digits, no spaces) followed by digits
  // Pattern: SYMBOL + session_id + indices_list + prices
  // We'll use a regex to extract: SYMBOL, last price, change, changePct
  const re = /([A-Z][A-Z0-9]{1,10})\d{4}[A-Z,]*\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([\d,]+\.?\d*)\s*([+-][\d.]+)\s*([+-][\d.]+%)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const sym = m[1];
    const last = parseFloat(m[6].replace(/,/g, ""));
    const change = parseFloat(m[7]);
    const pctStr = m[8]; // e.g. "-3.10%"
    if (!sym || isNaN(last) || isNaN(change)) continue;
    map.set(sym, {
      sym,
      val: last.toFixed(2),
      chg: change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
      pct: change >= 0 ? pctStr.replace("-", "+") : pctStr,
      pos: change >= 0,
    });
  }
  return map;
}

async function fetchLivePrices(): Promise<TickerItem[] | null> {
  try {
    const res = await fetch("https://dps.psx.com.pk/market-watch", {
      credentials: "omit",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const map = parseMarketWatch(text);
    if (map.size < 5) return null;

    // Build ticker items for our chosen symbols, fall back to any available
    const items: TickerItem[] = [];
    for (const sym of TICKER_SYMBOLS) {
      const item = map.get(sym);
      if (item) items.push(item);
    }
    // If we got fewer than 10, pad with whatever else is in the map
    if (items.length < 10) {
      for (const [, item] of map) {
        if (items.length >= 20) break;
        if (!items.find(i => i.sym === item.sym)) items.push(item);
      }
    }
    return items.length >= 5 ? items : null;
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
      const live = await fetchLivePrices();
      if (cancelled || !live) return;
      setItems(live);
      setIsLive(true);
    }

    load();
    const interval = setInterval(load, 3 * 60 * 1000); // refresh every 3 min
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { items, isLive };
}
