/**
 * Deterministic pseudo-price series when live data is unavailable (offline / CORS / rate limits).
 * Same symbol → same shape so UI is stable between refreshes.
 */
export function seededMulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type ChartPoint = { t: number; close: number };

export function generateMockSeries(symbol: string, tradingDays = 252): ChartPoint[] {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 9973;
  const rand = seededMulberry32(seed);
  const points: ChartPoint[] = [];
  const now = Date.now();
  const dayMs = 86400000;
  let price = 50 + rand() * 450;

  for (let i = tradingDays; i >= 0; i--) {
    const drift = (rand() - 0.48) * 0.025;
    const vol = (rand() - 0.5) * 0.04;
    price = Math.max(1, price * (1 + drift + vol));
    const t = Math.floor((now - i * dayMs) / 1000);
    points.push({ t, close: Math.round(price * 100) / 100 });
  }
  return points;
}
