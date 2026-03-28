import { motion } from "framer-motion";
import { Check } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const plans = [
  {
    name: "Starter", price: "Free", note: "", desc: "For investors just getting organised.",
    features: ["Up to 100 trade entries", "Basic P&L report", "3 symbols tracked", "CSV export"],
    inactive: ["Dividend tracker", "Tax report", "Broker reconciliation"],
    cta: "Start Free", href: "/auth", featured: false,
  },
  {
    name: "Pro", price: "₨1,499", note: "/ month", desc: "For active traders who need the full picture.",
    features: ["Unlimited trade entries", "Full P&L & analytics dashboard", "Unlimited symbols", "CSV & PDF export", "Dividend & corporate actions", "FBR tax computation", "Broker reconciliation", "Daily auto-backup (30d)"],
    inactive: [],
    cta: "Get Pro", href: "/auth", featured: true, badge: "Most Popular",
  },
  {
    name: "Firm", price: "₨5,999", note: "/ month", desc: "For advisory firms and family offices.",
    features: ["Everything in Pro", "Multi-account management", "Client-level reporting", "PDF branded statements", "Priority support", "Audit trail & permissions", "Custom data export"],
    inactive: [],
    cta: "Contact Sales", href: "/contact", featured: false,
  },
];

export default function PricingPage() {
  return (
    <PublicLayout>
      <section style={{ background: "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <motion.div {...fade()} style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Pricing</p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "16px" }}>Simple, transparent pricing</h1>
            <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--text2)", maxWidth: "480px", margin: "0 auto" }}>Start free. Upgrade when you need more. No hidden fees.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", alignItems: "start" }}>
            {plans.map((plan, i) => (
              <motion.div key={i} {...fade(i * 0.1)} style={{
                background: plan.featured ? "var(--surface)" : "var(--bg2)",
                border: `1px solid ${plan.featured ? "var(--green)" : "var(--border)"}`,
                borderRadius: "12px", padding: "28px", position: "relative",
                boxShadow: plan.featured ? "0 0 0 1px var(--green)" : "none",
              }}>
                {plan.badge && (
                  <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "var(--green)", color: "#000", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "999px" }}>
                    {plan.badge}
                  </span>
                )}
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "8px" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-1px" }}>{plan.price}</span>
                  {plan.note && <span style={{ fontSize: "13px", color: "var(--text3)" }}>{plan.note}</span>}
                </div>
                <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "24px" }}>{plan.desc}</p>
                <div style={{ height: "1px", background: "var(--border)", marginBottom: "20px" }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text)" }}>
                      <Check size={14} style={{ color: "var(--green)", flexShrink: 0 }} />{f}
                    </li>
                  ))}
                  {plan.inactive.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text3)", textDecoration: "line-through" }}>
                      <span style={{ width: "14px", height: "14px", flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <a href={plan.href} className={plan.featured ? "btn-primary" : "btn-ghost"}
                  style={{ display: "block", textAlign: "center", textDecoration: "none", borderRadius: "4px", padding: "12px" }}>
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade(0.3)} style={{ textAlign: "center", marginTop: "48px", padding: "24px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
            <p style={{ fontSize: "14px", color: "var(--text2)" }}>All plans include daily automated backups with 30-day retention. Your data is always safe.</p>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
