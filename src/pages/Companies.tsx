import { useState, useMemo } from "react";
import { usePSXCompanies } from "@/hooks/usePSXCompanies";
import { Search, Building2, RefreshCw } from "lucide-react";

const COLORS = {
  primary: '#10B981',
  primaryLight: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#737373',
  border: '#2A2A2A',
  borderHover: '#3A3A3A',
  bgCard: '#1A1A1A',
  bgInput: '#141414',
};

const Companies = () => {
  const { data: allCompanies = [], isLoading, isError, refetch } = usePSXCompanies();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");

  const sectors = useMemo(() => {
    const s = new Set(allCompanies.map(c => c.sector).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [allCompanies]);

  const filtered = useMemo(() => {
    const q = search.trim().toUpperCase();
    return allCompanies.filter(c => {
      if (sector !== "All" && c.sector !== sector) return false;
      if (q && !c.symbol.startsWith(q) && !c.name.toUpperCase().includes(q)) return false;
      return true;
    });
  }, [allCompanies, search, sector]);

  return (
    <div className="dashboard-app space-y-5" style={{ color: "var(--text)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="dash-page-kicker">Market</p>
          <h1 className="dash-page-title">PSX Companies</h1>
          <p className="dash-page-desc">
            {isLoading ? "Loading…" : `${allCompanies.length} listed companies · ${sectors.length - 1} sectors`}
          </p>
        </div>
        <button onClick={() => refetch()} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.textTertiary, pointerEvents: "none" }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by symbol or company name…"
          className="input-field"
          style={{
            width: "100%",
            padding: "14px 16px 14px 44px",
            fontSize: "14px",
            background: COLORS.bgInput,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            color: COLORS.textPrimary,
            outline: "none",
            transition: "border-color 0.2s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = COLORS.primary}
          onBlur={(e) => e.target.style.borderColor = COLORS.border}
        />
      </div>

      {/* Sector pills */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {sectors.map(s => (
          <button key={s} onClick={() => setSector(s)} style={{
            flexShrink: 0, padding: "8px 16px", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: "999px",
            border: `1px solid ${sector === s ? COLORS.primary : COLORS.border}`,
            background: sector === s ? COLORS.primaryLight : "transparent",
            color: sector === s ? COLORS.primary : COLORS.textSecondary,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s ease",
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.textSecondary }}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px" }}>Loading PSX companies…</p>
        </div>
      )}
      {isError && (
        <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.danger }}>
          <p style={{ fontSize: "14px" }}>Failed to load. <button onClick={() => refetch()} style={{ color: COLORS.primary, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button></p>
        </div>
      )}

      {/* Company list */}
      {!isLoading && !isError && (
        filtered.length > 0 ? (
          <div className="table-container" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <div className="table-header">
              <span className="table-header-title">{filtered.length} {filtered.length === 1 ? "company" : "companies"}</span>
              {search && <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>matching "{search}"</span>}
            </div>
            <div>
              {filtered.map((company, i) => (
                <div
                  key={company.symbol}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#1F1F1F")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary, flexShrink: 0, minWidth: "80px" }}>
                      {company.symbol}
                    </span>
                    <span style={{ fontSize: "14px", color: COLORS.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {company.name}
                    </span>
                  </div>
                  {company.sector && (
                    <span className="status-tag" style={{ flexShrink: 0, marginLeft: "16px", background: "rgba(59, 130, 246, 0.15)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                      {company.sector}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.textSecondary }}>
            <Building2 size={48} style={{ opacity: 0.3, margin: "0 auto 16px" }} />
            <p style={{ fontSize: "14px" }}>No companies match "{search}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default Companies;
