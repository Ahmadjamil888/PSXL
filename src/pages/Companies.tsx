import { useState, useMemo } from "react";
import { usePSXCompanies, PSXCompany } from "@/hooks/usePSXCompanies";
import { usePSXQuote } from "@/hooks/usePSXQuote";
import { Search, Building2, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import StockPanel from "@/components/StockPanel";

// ── Color helpers ─────────────────────────────────────────────────────────────
const COLORS = ["#a3c45a","#60a5fa","#f59e0b","#f472b6","#34d399","#a78bfa","#fb923c","#22d3ee","#e879f9","#4ade80","#f87171","#38bdf8","#fbbf24","#c084fc","#6ee7b7"];
function sectorColor(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

// ── Individual card with live quote ──────────────────────────────────────────
function CompanyCard({ company, onClick }: { company: PSXCompany; onClick: () => void }) {
  const { data: quote } = usePSXQuote(company.symbol);
  const color = sectorColor(company.sector);
  const isUp = (quote?.changePct ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px",
        padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
        display: "flex", flexDirection: "column", gap: "8px",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = "var(--bg2)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
    >
      {/* Top row: symbol + badges */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "var(--text)" }}>{company.symbol}</span>
        <div style={{ display: "flex", gap: "3px" }}>
          {company.isETF && <span style={{ fontSize: "8px", fontWeight: 700, color: "#60a5fa", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "3px", padding: "1px 4px" }}>ETF</span>}
          {company.isGEM && <span style={{ fontSize: "8px", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "3px", padding: "1px 4px" }}>GEM</span>}
        </div>
      </div>

      {/* Name */}
      <p style={{ fontSize: "11px", color: "var(--text2)", lineHeight: 1.35, margin: 0 }}>{company.name}</p>

      {/* Live price */}
      {quote ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>
            ₨{quote.price.toFixed(2)}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 600, fontFamily: "monospace", color: isUp ? "var(--green)" : "var(--red)" }}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isUp ? "+" : ""}{quote.changePct.toFixed(2)}%
          </span>
        </div>
      ) : (
        <div style={{ height: "20px", background: "var(--bg2)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
      )}

      {/* Sector badge */}
      {company.sector && (
        <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: "4px", padding: "2px 6px", alignSelf: "flex-start" }}>
          {company.sector}
        </span>
      )}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const Companies = () => {
  const { data: allCompanies = [], isLoading, isError, refetch } = usePSXCompanies();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [showETF, setShowETF] = useState(false);
  const [showGEM, setShowGEM] = useState(false);
  const [selected, setSelected] = useState<PSXCompany | null>(null);

  const sectors = useMemo(() => {
    const s = new Set(allCompanies.map(c => c.sector).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [allCompanies]);

  const filtered = useMemo(() => {
    const q = search.toUpperCase().trim();
    return allCompanies.filter(c => {
      if (!showETF && c.isETF) return false;
      if (!showGEM && c.isGEM) return false;
      if (sector !== "All" && c.sector !== sector) return false;
      if (q && !c.symbol.includes(q) && !c.name.toUpperCase().includes(q)) return false;
      return true;
    });
  }, [allCompanies, search, sector, showETF, showGEM]);

  const sectorCounts = useMemo(() => {
    const map: Record<string, number> = {};
    allCompanies.forEach(c => { if (!c.isETF && !c.isGEM) map[c.sector] = (map[c.sector] ?? 0) + 1; });
    return map;
  }, [allCompanies]);

  const equityCount = allCompanies.filter(c => !c.isETF && !c.isDebt && !c.isGEM).length;
  const etfCount = allCompanies.filter(c => c.isETF).length;
  const gemCount = allCompanies.filter(c => c.isGEM).length;

  return (
    <div className="dashboard-app space-y-5" style={{ color: "var(--text)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="dash-page-kicker">Market</p>
          <h1 className="dash-page-title">PSX Companies</h1>
          <p className="dash-page-desc">
            {isLoading ? "Loading live data from PSX…" : `${allCompanies.length} securities · ${sectors.length - 1} sectors · click any card for live chart`}
          </p>
        </div>
        <button onClick={() => refetch()} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: "6px", cursor: "pointer", flexShrink: 0, alignSelf: "flex-start" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {[
          { label: "Total Securities", val: String(allCompanies.length) },
          { label: "Equity", val: String(equityCount) },
          { label: "ETFs", val: String(etfCount) },
          { label: "Showing", val: String(filtered.length) },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span className="stat-label">{s.label}</span>
            <span className="stat-val" style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search symbol or name…" className="input-field"
              style={{ width: "100%", paddingLeft: "36px" }} />
          </div>
          {[
            { label: `ETFs (${etfCount})`, val: showETF, set: setShowETF },
            { label: `GEM (${gemCount})`, val: showGEM, set: setShowGEM },
          ].map(t => (
            <button key={t.label} onClick={() => t.set(!t.val)} style={{
              padding: "0 16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", borderRadius: "6px",
              border: `1px solid ${t.val ? "var(--green)" : "var(--border)"}`,
              background: t.val ? "rgba(163,196,90,0.12)" : "transparent",
              color: t.val ? "var(--green)" : "var(--text2)", cursor: "pointer", whiteSpace: "nowrap", minHeight: "40px",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Sector pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
          {sectors.map(s => {
            const c = sectorColor(s);
            return (
              <button key={s} onClick={() => setSector(s)} style={{
                flexShrink: 0, padding: "5px 12px", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: "999px",
                border: `1px solid ${sector === s ? c : "var(--border)"}`,
                background: sector === s ? `${c}18` : "transparent",
                color: sector === s ? c : "var(--text2)",
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
              }}>
                {s}{s !== "All" && sectorCounts[s] ? ` (${sectorCounts[s]})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text2)" }}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px" }}>Fetching live data from PSX…</p>
        </div>
      )}
      {isError && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--red)" }}>
          <p style={{ fontSize: "14px" }}>Failed to load PSX data. <button onClick={() => refetch()} style={{ color: "var(--green)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button></p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && (
        filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "8px" }}>
            {filtered.map((company, i) => (
              <motion.div key={company.symbol} transition={{ delay: Math.min(i * 0.006, 0.25) }}>
                <CompanyCard company={company} onClick={() => setSelected(company)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text2)" }}>
            <Building2 size={40} style={{ opacity: 0.2, margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14px" }}>No companies match your search.</p>
          </div>
        )
      )}

      {/* Stock panel slide-over */}
      {selected && (
        <StockPanel
          symbol={selected.symbol}
          name={selected.name}
          sector={selected.sector}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default Companies;
