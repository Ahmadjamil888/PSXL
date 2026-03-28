import { useState } from "react";
import CompanySearch from "@/components/CompanySearch";
import CompanyIntelPanel from "@/components/CompanyIntelPanel";
import { PSXCompany } from "@/data/psxCompanies";

type TabId = "search" | "sectors" | "watchlist";

const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState<PSXCompany | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("search");

  const panelBg = "var(--surface)";
  const statBg = "var(--bg2)";

  const tabs: { id: TabId; label: string }[] = [
    { id: "search", label: "Search Companies" },
    { id: "sectors", label: "By Sector" },
    { id: "watchlist", label: "Watchlist" },
  ];

  return (
    <div className="dashboard-app space-y-5" style={{ color: "var(--text)" }}>
      <div>
        <p className="dash-page-kicker">Market</p>
        <h1 className="dash-page-title">PSX Companies</h1>
        <p className="dash-page-desc">
          Browse PSX listings, pull live chart data when available, and review model signals vs your journal — not financial
          advice.
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
        style={{ color: "var(--text)" }}
      >
        {[
          { label: "Total Companies", val: "100+", sub: "Listed companies" },
          { label: "Sectors", val: "15", sub: "Industry sectors" },
          { label: "Market Cap", val: "$8.2T", sub: "Total market cap" },
          { label: "Volume", val: "142M", sub: "Daily avg volume" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-[var(--border)]"
            style={{
              background: statBg,
              padding: "clamp(14px, 3vw, 22px)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text3)",
              }}
            >
              {s.label}
            </span>
            <span
              className="font-mono tabular-nums"
              style={{
                fontSize: "clamp(1.25rem, 4vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--text)",
              }}
            >
              {s.val}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 400 }}>{s.sub}</span>
          </div>
        ))}
      </div>

      <div
        className="-mx-1 flex gap-0 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 px-3 py-3 text-left sm:px-4"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive ? "var(--green)" : "var(--text2)",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid var(--green)" : "2px solid transparent",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
                minHeight: "44px",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "search" && (
        <div className="min-w-0">
          <CompanySearch onCompanySelect={setSelectedCompany} />
        </div>
      )}

      {activeTab === "sectors" && (
        <div
          className="overflow-hidden rounded-[10px] border border-[var(--border)]"
          style={{ background: panelBg }}
        >
          <div
            className="flex flex-col gap-2 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "var(--bg2)" }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text)",
              }}
            >
              Companies by Sector
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--green)",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                padding: "4px 10px",
                borderRadius: "4px",
                width: "fit-content",
              }}
            >
              Browse
            </span>
          </div>
          <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
            <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.6 }}>
              Sector-wise company listing coming soon...
            </p>
          </div>
        </div>
      )}

      {activeTab === "watchlist" && (
        <div
          className="overflow-hidden rounded-[10px] border border-[var(--border)]"
          style={{ background: panelBg }}
        >
          <div
            className="flex flex-col gap-2 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "var(--bg2)" }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text)",
              }}
            >
              Your Watchlist
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--green)",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                padding: "4px 10px",
                borderRadius: "4px",
                width: "fit-content",
              }}
            >
              Track
            </span>
          </div>
          <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
            <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.6 }}>
              Your watchlist is empty. Add companies to track them here.
            </p>
          </div>
        </div>
      )}

      {selectedCompany && (
        <CompanyIntelPanel company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}
    </div>
  );
};

export default Companies;
