import type { ChartPoint } from "./mockSeries";
import { generateMockSeries } from "./mockSeries";
import { toYahooPsxSymbol } from "./yahooSymbol";

function marketBaseUrl(): string {
  if (import.meta.env.VITE_FORCE_MARKET_MOCK === "true") return "";
  const custom = import.meta.env.VITE_MARKET_PROXY_URL as string | undefined;
  if (custom) return custom.replace(/\/$/, "");
  // Only use the Vite dev proxy in development — in production Yahoo blocks CORS
  if (import.meta.env.DEV) return "/api/yahoo";
  return ""; // production: always use mock (no proxy available)
}

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: { currency?: string; regularMarketPrice?: number };
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: Array<number | null> }> };
    }>;
    error?: { description?: string };
  };
}

export interface MarketChartPayload {
  points: ChartPoint[];
  source: "live" | "mock";
  currency: string;
  regularMarketPrice: number | null;
  changePct: number | null;
}

function parseYahoo(json: YahooChartResult): ChartPoint[] {
  const r = json.chart?.result?.[0];
  if (!r?.timestamp?.length) return [];
  const closes = r.indicators?.quote?.[0]?.close ?? [];
  const points: ChartPoint[] = [];
  for (let i = 0; i < r.timestamp.length; i++) {
    const c = closes[i];
    if (c != null && Number.isFinite(c)) {
      points.push({ t: r.timestamp[i], close: c });
    }
  }
  return points;
}

/**
 * Fetches ~1y daily bars for a PSX symbol via Yahoo (when proxy/CORS allows).
 * Falls back to deterministic mock series.
 */
export async function fetchMarketChart(psxSymbol: string): Promise<MarketChartPayload> {
  const yahooSym = toYahooPsxSymbol(psxSymbol);
  const base = marketBaseUrl();

  if (!base) {
    const points = generateMockSeries(psxSymbol);
    const last = points[points.length - 1]?.close ?? 0;
    return {
      points,
      source: "mock",
      currency: "PKR",
      regularMarketPrice: last,
      changePct: null,
    };
  }

  const url = `${base}/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=1y`;
  try {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as YahooChartResult;
    if (json.chart?.error) throw new Error(json.chart.error.description ?? "Yahoo error");
    const rawPoints = parseYahoo(json);
    const source: "live" | "mock" = rawPoints.length >= 20 ? "live" : "mock";
    const points = source === "live" ? rawPoints : generateMockSeries(psxSymbol);

    const meta = json.chart?.result?.[0]?.meta;
    const lastClose = points[points.length - 1]?.close ?? null;
    const prevClose = points.length > 5 ? points[points.length - 6]?.close : null;
    let changePct: number | null = null;
    if (lastClose != null && prevClose != null && prevClose > 0) {
      changePct = ((lastClose - prevClose) / prevClose) * 100;
    }

    return {
      points,
      source,
      currency: meta?.currency ?? "PKR",
      regularMarketPrice: meta?.regularMarketPrice ?? lastClose,
      changePct: changePct != null ? Math.round(changePct * 100) / 100 : null,
    };
  } catch {
    const points = generateMockSeries(psxSymbol);
    const last = points[points.length - 1]?.close ?? 0;
    return {
      points,
      source: "mock",
      currency: "PKR",
      regularMarketPrice: last,
      changePct: null,
    };
  }
}
