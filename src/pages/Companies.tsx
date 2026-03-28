import { useState, useMemo } from "react";
import { usePSXCompanies } from "@/hooks/usePSXCompanies";
import { Search, Building2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = [
  "#a3c45a","#60a5fa","#f59e0b","#f472b6","#34d399",
  "#a78bfa","#fb923c","#22d3ee","#e879f9","#4ade80",
  "#f87171","#38bdf8","#fbbf24","#c084fc","#6ee7b7",
];

function sectorColor(sector: string) {
  let hash = 0;
  for (let i = 0; i < sector.length; i++) hash = sector.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const Companies = () => {
  const { data: allCompanies = [], isLoading, isError, refetch } = usePSXCompanies();

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [showETF, setShowETF] = useState(false);
  const [showGEM, setShowGEM] = useState(false);

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
    allCompanies.forEach(c => {
      if (!c.isETF && !c.isGEM) map[c.sector] = (map[c.sector] ?? 0) + 1;
    });
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
            {isLoading ? "Loading live data from PSX…" : `${allCompanies.length} securities · ${sectors.length - 1} sectors · live from dps.psx.com.pk`}
          </p>
        </div>
        <button onClick={() => refetch()} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: "6px", cursor: "pointer", flexShrink: 0 }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Summary stats */}
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
          {/* Toggle ETF / GEM */}
          {[
            { label: `ETFs (${etfCount})`, val: showETF, set: setShowETF },
            { label: `GEM (${gemCount})`, val: showGEM, set: setShowGEM },
          ].map(t => (
            <button key={t.label} onClick={() => t.set(!t.val)} style={{
              padding: "0 16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", borderRadius: "6px", border: `1px solid ${t.val ? "var(--green)" : "var(--border)"}`,
              background: t.val ? "rgba(163,196,90,0.12)" : "transparent",
              color: t.val ? "var(--green)" : "var(--text2)", cursor: "pointer", whiteSpace: "nowrap",
              minHeight: "40px",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Sector pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
          {sectors.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{
              flexShrink: 0, padding: "5px 12px", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: "999px",
              border: `1px solid ${sector === s ? sectorColor(s) : "var(--border)"}`,
              background: sector === s ? `${sectorColor(s)}18` : "transparent",
              color: sector === s ? sectorColor(s) : "var(--text2)",
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
            }}>
              {s}{s !== "All" && sectorCounts[s] ? ` (${sectorCounts[s]})` : ""}
            </button>
          ))}
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

      {/* Company grid */}
      {!isLoading && !isError && (
        filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "8px" }}>
            {filtered.map((company, i) => {
              const color = sectorColor(company.sector);
              return (
                <motion.div key={company.symbol}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.008, 0.3) }}
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", cursor: "default", transition: "border-color 0.15s, background 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = "var(--bg2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "var(--text)" }}>{company.symbol}</span>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {company.isETF && <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", color: "#60a5fa", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "3px", padding: "1px 5px" }}>ETF</span>}
                      {company.isGEM && <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "3px", padding: "1px 5px" }}>GEM</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--text2)", lineHeight: 1.4, margin: "0 0 8px" }}>{company.name}</p>
                  {company.sector && (
                    <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: "4px", padding: "2px 6px" }}>
                      {company.sector}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text2)" }}>
            <Building2 size={40} style={{ opacity: 0.2, margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14px" }}>No companies match your search.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Companies;
