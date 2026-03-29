import { useState, useMemo } from "react";
import { usePSXCompanies } from "@/hooks/usePSXCompanies";
import { Search, Building2, RefreshCw } from "lucide-react";

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
        <button onClick={() => refetch()} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: "6px", cursor: "pointer", flexShrink: 0, alignSelf: "flex-start" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by symbol or company name…"
          className="input-field"
          style={{ width: "100%", paddingLeft: "36px" }}
        />
      </div>

      {/* Sector pills */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
        {sectors.map(s => (
          <button key={s} onClick={() => setSector(s)} style={{
            flexShrink: 0, padding: "5px 12px", fontSize: "11px", fontWeight: 600,
            letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: "999px",
            border: `1px solid ${sector === s ? "var(--green)" : "var(--border)"}`,
            background: sector === s ? "rgba(163,196,90,0.12)" : "transparent",
            color: sector === s ? "var(--green)" : "var(--text2)",
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text2)" }}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px" }}>Loading PSX companies…</p>
        </div>
      )}
      {isError && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--red)" }}>
          <p style={{ fontSize: "14px" }}>Failed to load. <button onClick={() => refetch()} style={{ color: "var(--green)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button></p>
        </div>
      )}

      {/* Company list */}
      {!isLoading && !isError && (
        filtered.length > 0 ? (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>
                {filtered.length} {filtered.length === 1 ? "company" : "companies"}
              </span>
              {search && <span style={{ fontSize: "11px", color: "var(--text3)" }}>matching "{search}"</span>}
            </div>
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {filtered.map((company, i) => (
                <div
                  key={company.symbol}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "var(--text)", flexShrink: 0, minWidth: "72px" }}>
                      {company.symbol}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {company.name}
                    </span>
                  </div>
                  {company.sector && (
                    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text3)", flexShrink: 0, marginLeft: "12px" }}>
                      {company.sector}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text2)" }}>
            <Building2 size={40} style={{ opacity: 0.2, margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14px" }}>No companies match "{search}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default Companies;
