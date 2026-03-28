import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Layers, Award, Calculator, FileText, Shield, RefreshCw, BarChart3 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>{children}</div>
  </section>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--green)", background: "rgba(163,196,90,0.1)", border: "1px solid rgba(163,196,90,0.25)", borderRadius: "4px", padding: "3px 8px" }}>{children}</span>
);

const features = [
  {
    num: "01", icon: BookOpen, title: "Trade Entry & History", tag: "T+2 Settlement",
    desc: "Log buy and sell transactions with full metadata — quantity, rate, brokerage, CDC charges, Zakat, and settlement date. Nothing is left unaccounted. T+2 settlement dates are tracked automatically.",
    details: ["Buy and sell entries with full charge breakdown", "CDC charges, Zakat, and brokerage fees", "T+2 settlement date tracking", "Notes and strategy tags per trade", "Bulk CSV and PDF import"],
  },
  {
    num: "02", icon: TrendingUp, title: "Real-Time P&L Tracking", tag: "FIFO / WAC",
    desc: "See your realised and unrealised gain or loss per position and at portfolio level, updated with each entry. Weighted average cost computed automatically.",
    details: ["Realised and unrealised P&L per position", "Portfolio-level P&L summary", "Weighted Average Cost (WAC) method", "FIFO cost basis calculation", "Daily and monthly P&L breakdown"],
  },
  {
    num: "03", icon: Layers, title: "Sector & Scrip Breakdown", tag: "KSE-100 Mapped",
    desc: "View exposure by KSE sector — Cement, Banking, E&P, Tech, and more. Instantly understand concentration risk across your holdings.",
    details: ["KSE-100 sector mapping", "Concentration risk analysis", "Sector-level P&L breakdown", "Scrip-level performance ranking", "Portfolio allocation charts"],
  },
  {
    num: "04", icon: Award, title: "Dividend Tracker", tag: "Corporate Actions",
    desc: "Record cash and bonus dividends, right issues, and stock splits. Adjust cost basis automatically and track dividend yield per holding.",
    details: ["Cash and bonus dividend recording", "Right issue and stock split tracking", "Automatic cost basis adjustment", "Dividend yield per holding", "Corporate action history"],
  },
  {
    num: "05", icon: Calculator, title: "Tax Computation", tag: "FBR Compliant",
    desc: "Capital gains tax, withholding tax on dividends, and Zakat deductions — all calculated per FBR rules. Export a ready report for your tax consultant.",
    details: ["Capital gains tax per FBR rates", "Withholding tax on dividends", "Zakat deduction calculation", "Exportable tax report for consultant", "Annual tax summary"],
  },
  {
    num: "06", icon: FileText, title: "Export & Reports", tag: "CSV · PDF",
    desc: "Generate portfolio statements, gain/loss summaries, and broker reconciliation sheets. Export to CSV or PDF in one click.",
    details: ["Portfolio statement export", "Gain/loss summary report", "Broker reconciliation sheet", "CSV and PDF export formats", "Date-range filtered exports"],
  },
  {
    num: "07", icon: BarChart3, title: "Advanced Analytics", tag: "Charts",
    desc: "Equity curve, win/loss ratio, monthly performance, streak analysis, risk/reward scatter — all the charts a serious trader needs.",
    details: ["Equity curve over time", "Win/loss ratio and win rate", "Monthly performance bar chart", "Streak analysis (win/loss runs)", "Risk vs reward scatter plot"],
  },
  {
    num: "08", icon: Shield, title: "Security & Backup", tag: "AES-256",
    desc: "All data encrypted at rest with AES-256 and in transit with TLS 1.3. Automated daily backups with 30-day retention.",
    details: ["AES-256 encryption at rest", "TLS 1.3 in transit", "Daily automated backups", "30-day backup retention", "Point-in-time recovery"],
  },
  {
    num: "09", icon: RefreshCw, title: "Auto Backup", tag: "Daily",
    desc: "All data is automatically backed up daily with 30 days of retention. Export your entire ledger at any time as a safety net.",
    details: ["Daily automated backup", "30-day retention window", "Manual export at any time", "CSV and PDF export", "Zero data loss guarantee"],
  },
];

export default function FeaturesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <Section>
        <motion.div {...fade()}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Platform</p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.0, color: "var(--text)", marginBottom: "20px" }}>
            Everything a PSX trader needs.<br />
            <span style={{ color: "var(--green)" }}>Nothing they don't.</span>
          </h1>
          <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "560px", marginBottom: "28px" }}>
            PSX Ledger Pro is built from the ground up for Pakistan Stock Exchange investors. Every feature addresses a real need — from FBR tax compliance to KSE sector mapping.
          </p>
          <a href="/auth" className="btn-primary" style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 28px", display: "inline-block" }}>
            Start for Free
          </a>
        </motion.div>
      </Section>

      {/* Feature grid */}
      <Section alt>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {features.map((f, i) => (
            <motion.div key={i} {...fade(i * 0.05)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text3)", fontFamily: "monospace" }}>{f.num}</span>
                  <f.icon size={18} style={{ color: "var(--green)" }} />
                </div>
                <Tag>{f.tag}</Tag>
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                {f.details.map((d, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text2)" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <motion.div {...fade()} style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-1px", color: "var(--text)", marginBottom: "16px" }}>Ready to get started?</h2>
          <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--text2)", marginBottom: "28px" }}>Free to use. No credit card required.</p>
          <a href="/auth" className="btn-primary" style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 32px", display: "inline-block" }}>Create Free Account</a>
        </motion.div>
      </Section>
    </PublicLayout>
  );
}
