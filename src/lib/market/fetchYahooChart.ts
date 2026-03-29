import type { ChartPoint } from "./mockSeries";
import { generateMockSeries } from "./mockSeries";

export interface MarketChartPayload {
  points: ChartPoint[];
  source: "live" | "mock";
  currency: string;
  regularMarketPrice: number | null;
  changePct: number | null;
}

/**
 * Fetches EOD historical data from PSX's own public API.
 * Endpoint: https://dps.psx.com.pk/timeseries/eod/{SYMBOL}
 * Returns: [[timestamp, close, volume, open], ...]
 * CORS-open, no auth required, works in production.
 */
export async function fetchMarketChart(psxSymbol: string): Promise<MarketChartPayload> {
  const sym = psxSymbol.trim().toUpperCase();

  try {
    const url = `https://dps.psx.com.pk/timeseries/eod/${encodeURIComponent(sym)}`;
    const res = await fetch(url, {
      credentials: "omit",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    // Response shape: { status: 1, data: [[ts, close, volume, open], ...] }
    const raw: [number, number, number, number][] = json?.data ?? [];

    if (raw.length < 5) throw new Error("Insufficient data");

    // Sort ascending by timestamp
    const sorted = [...raw].sort((a, b) => a[0] - b[0]);
    const points: ChartPoint[] = sorted.map(([t, close]) => ({ t, close }));

    const last = points[points.length - 1]?.close ?? null;
    const prev = points.length > 1 ? points[points.length - 2]?.close : null;
    const changePct = last != null && prev != null && prev > 0
      ? Math.round(((last - prev) / prev) * 10000) / 100
      : null;

    return {
      points,
      source: "live",
      currency: "PKR",
      regularMarketPrice: last,
      changePct,
    };
  } catch {
    // Fallback to deterministic mock
    const points = generateMockSeries(sym);
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
