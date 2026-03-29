import { useState, useMemo } from "react";
import { X, TrendingUp, TrendingDown, BarChart2, Activity, RefreshCw, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePSXQuote } from "@/hooks/usePSXQuote";
import { useMarketChart } from "@/hooks/useMarketChart";
import { useTrades, calcPnL } from "@/hooks/useTrades";
import { formatCurrency } from "@/lib/psx";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, BarChart, Bar, Cell,
} from "recharts";

interface Props {
  symbol: string;
  name: string;
  sector: string;
  onClose: () => void;
}

type Range = "1W" | "1M" | "3M" | "1Y";
const RANGES: Range[] = ["1W", "1M", "3M", "1Y"];

const TT = {
  contentStyle: { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontSize: "11px" },
  itemStyle: { color: "var(--text)" },
  labelStyle: { color: "var(--text3)", fontSize: "10px" },
};

function fmt(n: number) {
  if (n >= 1e9) return `₨${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `₨${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `₨${(n / 1e3).toFixed(1)}K`;
  return `₨${n.toFixed(2)}`;
}

function fmtDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

export default function StockPanel({ symbol, name, sector, onClose }: Props) {
  const [range, setRange] = useState<Range>("3M");
  const { data: quote, isLoading: qLoading, refetch } = usePSXQuote(symbol);
  const { data: chart, isLoading: cLoading } = useMarketChart(symbol);
  const { data: trades = [] } = useTrades();

  // Merge live price into chart — override last point with real-time price from market-watch
  const mergedPoints = useMemo(() => {
    if (!chart?.points?.length) return [];
    const pts = [...chart.points];
    if (quote?.source === "live" && quote.price > 0) {
      // Replace or append today's point with the live price
      const todayTs = Math.floor(Date.now() / 1000);
      const last = pts[pts.length - 1];
      if (last && todayTs - last.t < 86400 * 2) {
        pts[pts.length - 1] = { ...last, close: quote.price };
      } else {
        pts.push({ t: todayTs, close: quote.price });
      }
    }
    return pts;
  }, [chart?.points, quote?.price, quote?.source]);

  const now = Date.now() / 1000;
  const rangeSecs: Record<Range, number> = { "1W": 7 * 86400, "1M": 30 * 86400, "3M": 90 * 86400, "1Y": 365 * 86400 };
  const chartPoints = mergedPoints
    .filter(p => p.t >= now - rangeSecs[range])
    .map(p => ({ t: p.t, date: fmtDate(p.t), close: p.close }));

  // User's trades for this symbol
  const myTrades = trades.filter(t => t.symbol.toUpperCase() === symbol.toUpperCase());
  const myPnL = myTrades.reduce((s, t) => s + (calcPnL(t) ?? 0), 0);
  const myVolume = myTrades.reduce((s, t) => s + t.entry_price * t.quantity, 0);

  const isUp = (quote?.changePct ?? 0) >= 0;
  const lineColor = isUp ? "var(--green)" : "var(--red)";

  // Simple RSI-like momentum from last 14 points
  const rsiPoints = chart?.points?.slice(-15) ?? [];
  let gains = 0, losses = 0;
  for (let i = 1; i < rsiPoints.length; i++) {
    const d = rsiPoints[i].close - rsiPoints[i - 1].close;
    if (d > 0) gains += d; else losses -= d;
  }
  const rs = losses === 0 ? 100 : gains / losses;
  const rsi = Math.round(100 - 100 / (1 + rs));

  // Volume bars (last 20 days)
  const volBars = (chart?.points ?? []).slice(-20).map(p => ({
    date: fmtDate(p.t), close: p.close,
    vol: Math.round(Math.abs(p.close - (chart?.points?.[chart.points.indexOf(p) - 1]?.close ?? p.close)) * 1000),
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
          width: "min(560px, 100vw)",
          background: "var(--bg)", borderLeft: "1px solid var(--border)",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", background: "var(--chrome-bg)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>{symbol}</span>
                <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", background: "rgba(163,196,90,0.1)", border: "1px solid rgba(163,196,90,0.2)", borderRadius: "4px", padding: "2px 7px" }}>{sector}</span>
                {chart?.source === "mock" && <span style={{ fontSize: "9px", color: "var(--text3)", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "2px 6px" }}>SIMULATED</span>}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text2)", margin: 0 }}>{name}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button onClick={() => refetch()} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex" }}>
                <RefreshCw size={14} />
              </button>
              <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Price */}
          {qLoading ? (
            <div style={{ marginTop: "12px", height: "40px", background: "var(--bg2)", borderRadius: "6px", animation: "pulse 1.5s infinite" }} />
          ) : quote ? (
            <div style={{ marginTop: "12px", display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontSize: "32px", fontWeight: 700, color: "var(--text)", letterSpacing: "-1px" }}>
                ₨{quote.price.toFixed(2)}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 600, color: isUp ? "var(--green)" : "var(--red)", display: "flex", alignItems: "center", gap: "4px" }}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? "+" : ""}{quote.change.toFixed(2)} ({isUp ? "+" : ""}{quote.changePct.toFixed(2)}%)
              </span>
              {quote.source === "live" && <span style={{ fontSize: "9px", color: "var(--green)", background: "rgba(163,196,90,0.1)", border: "1px solid rgba(163,196,90,0.2)", borderRadius: "4px", padding: "2px 6px", fontWeight: 600 }}>LIVE</span>}
            </div>
          ) : null}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Price stats row */}
          {quote && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "8px" }}>
              {[
                { label: "Day High", val: `₨${quote.high.toFixed(2)}`, color: "var(--green)" },
                { label: "Day Low", val: `₨${quote.low.toFixed(2)}`, color: "var(--red)" },
                { label: "Prev Close", val: `₨${quote.prevClose.toFixed(2)}` },
                { label: "Volume", val: fmt(quote.volume) },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "4px" }}>{s.label}</p>
                  <p style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 600, color: s.color ?? "var(--text)" }}>{s.val}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Activity size={13} style={{ color: "var(--text3)" }} />
                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Price Chart</span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {RANGES.map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{
                    padding: "3px 9px", fontSize: "10px", fontWeight: 600, borderRadius: "4px",
                    border: `1px solid ${range === r ? lineColor : "var(--border)"}`,
                    background: range === r ? `${lineColor}18` : "transparent",
                    color: range === r ? lineColor : "var(--text2)", cursor: "pointer",
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 8px 8px" }}>
              {cLoading ? (
                <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: "13px" }}>Loading chart…</div>
              ) : chartPoints.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartPoints}>
                    <defs>
                      <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="date" tick={{ fill: "var(--text3)", fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "var(--text3)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `₨${v.toFixed(0)}`} domain={["auto", "auto"]} width={52} />
                    <Tooltip {...TT} formatter={(v: number) => [`₨${v.toFixed(2)}`, "Price"]} />
                    {quote && <ReferenceLine y={quote.prevClose} stroke="var(--text3)" strokeDasharray="3 3" strokeWidth={1} />}
                    <Area type="monotone" dataKey="close" stroke={lineColor} fill="url(#spGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: "13px" }}>No chart data</div>
              )}
            </div>
          </div>

          {/* Technical indicators */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px" }}>
              <BarChart2 size={13} style={{ color: "var(--text3)" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Technical Indicators</span>
            </div>
            <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px" }}>
              {/* RSI */}
              <div>
                <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "6px" }}>RSI (14)</p>
                <p style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: rsi > 70 ? "var(--red)" : rsi < 30 ? "var(--green)" : "var(--text)" }}>{rsi}</p>
                <p style={{ fontSize: "10px", color: rsi > 70 ? "var(--red)" : rsi < 30 ? "var(--green)" : "var(--text3)", marginTop: "2px" }}>
                  {rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral"}
                </p>
                <div style={{ marginTop: "6px", height: "4px", background: "var(--bg2)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${rsi}%`, height: "100%", background: rsi > 70 ? "var(--red)" : rsi < 30 ? "var(--green)" : "var(--green)", borderRadius: "2px", transition: "width 0.5s" }} />
                </div>
              </div>

              {/* Trend */}
              {chartPoints.length >= 20 && (() => {
                const last20 = chartPoints.slice(-20).map(p => p.close);
                const ma20 = last20.reduce((s, v) => s + v, 0) / 20;
                const last5 = chartPoints.slice(-5).map(p => p.close);
                const ma5 = last5.reduce((s, v) => s + v, 0) / 5;
                const trend = ma5 > ma20 ? "Bullish" : "Bearish";
                return (
                  <div>
                    <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "6px" }}>Trend (MA)</p>
                    <p style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: trend === "Bullish" ? "var(--green)" : "var(--red)" }}>{trend === "Bullish" ? "↑" : "↓"}</p>
                    <p style={{ fontSize: "10px", color: trend === "Bullish" ? "var(--green)" : "var(--red)", marginTop: "2px" }}>{trend}</p>
                    <p style={{ fontSize: "9px", color: "var(--text3)", marginTop: "4px" }}>MA5: ₨{ma5.toFixed(1)} · MA20: ₨{ma20.toFixed(1)}</p>
                  </div>
                );
              })()}

              {/* Volatility */}
              {chartPoints.length >= 10 && (() => {
                const closes = chartPoints.slice(-10).map(p => p.close);
                const mean = closes.reduce((s, v) => s + v, 0) / closes.length;
                const variance = closes.reduce((s, v) => s + (v - mean) ** 2, 0) / closes.length;
                const vol = Math.sqrt(variance);
                const volPct = mean > 0 ? (vol / mean) * 100 : 0;
                return (
                  <div>
                    <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "6px" }}>Volatility</p>
                    <p style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: volPct > 5 ? "var(--red)" : "var(--text)" }}>{volPct.toFixed(1)}%</p>
                    <p style={{ fontSize: "10px", color: "var(--text3)", marginTop: "2px" }}>{volPct > 5 ? "High" : volPct > 2 ? "Medium" : "Low"}</p>
                  </div>
                );
              })()}
            </div>

            {/* Volume bars */}
            {volBars.length > 0 && (
              <div style={{ padding: "0 8px 12px" }}>
                <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", padding: "0 8px 8px" }}>Price Movement (20d)</p>
                <ResponsiveContainer width="100%" height={60}>
                  <BarChart data={volBars} barSize={8}>
                    <Bar dataKey="vol" radius={[2, 2, 0, 0]}>
                      {volBars.map((e, i) => {
                        const prev = volBars[i - 1]?.close ?? e.close;
                        return <Cell key={i} fill={e.close >= prev ? "var(--green)" : "var(--red)"} fillOpacity={0.7} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* My trades for this symbol */}
          {myTrades.length > 0 && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>My {symbol} Trades</span>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text2)" }}>{myTrades.length} trades</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, fontFamily: "monospace", color: myPnL >= 0 ? "var(--green)" : "var(--red)" }}>
                    {myPnL >= 0 ? "+" : ""}{formatCurrency(myPnL)}
                  </span>
                </div>
              </div>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg2)" }}>
                      {["Date", "Side", "Qty", "Entry", "Exit", "P&L"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myTrades.map(t => {
                      const pnl = calcPnL(t);
                      return (
                        <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg2)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <td style={{ padding: "8px 12px", color: "var(--text3)" }}>{t.date}</td>
                          <td style={{ padding: "8px 12px" }}>
                            <span style={{ fontSize: "9px", fontWeight: 700, color: t.side === "buy" ? "var(--green)" : "var(--red)", background: t.side === "buy" ? "rgba(163,196,90,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${t.side === "buy" ? "rgba(163,196,90,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: "3px", padding: "1px 6px" }}>
                              {t.side.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "var(--text)" }}>{t.quantity}</td>
                          <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "var(--text)" }}>₨{t.entry_price}</td>
                          <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "var(--text)" }}>{t.exit_price ? `₨${t.exit_price}` : "—"}</td>
                          <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 600, color: pnl === null ? "var(--text3)" : pnl >= 0 ? "var(--green)" : "var(--red)" }}>
                            {pnl === null ? "Open" : `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {myVolume > 0 && (
                <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", color: "var(--text2)" }}>Total volume: <strong style={{ color: "var(--text)", fontFamily: "monospace" }}>{formatCurrency(myVolume)}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* External links */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "PSX Profile", url: `https://dps.psx.com.pk/company/${symbol}` },
              { label: "Yahoo Finance", url: `https://finance.yahoo.com/quote/${symbol}.PSX` },
            ].map(l => (
              <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 14px", fontSize: "11px", fontWeight: 500, color: "var(--text2)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", textDecoration: "none", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border2)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                {l.label} <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
