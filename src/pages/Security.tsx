import { motion } from "framer-motion";
import { Shield, Lock, Clock, Eye, Server, RefreshCw } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>{children}</div>
  </section>
);

const items = [
  { icon: Lock, title: "End-to-End Encryption", desc: "All ledger data encrypted at rest with AES-256 and in transit with TLS 1.3. Your trading data is unreadable to anyone without your credentials." },
  { icon: Clock, title: "Immutable Audit Trail", desc: "Every change is timestamped and logged. Your historical record can never be silently altered. Full audit trail available on request." },
  { icon: Eye, title: "No Broker Access", desc: "PSX Ledger Pro is a manual ledger. It never connects to your brokerage account or places orders on your behalf. Zero broker API access." },
  { icon: Shield, title: "Zero Data Selling", desc: "Your portfolio data is never shared with third parties, advertisers, or financial institutions. Your data is yours, period." },
  { icon: RefreshCw, title: "Daily Automated Backups", desc: "All data is automatically backed up daily with 30 days of retention. Point-in-time recovery ensures you never lose your trading history." },
  { icon: Server, title: "Secure Infrastructure", desc: "Hosted on ISO 27001-certified infrastructure with 24/7 monitoring, DDoS protection, and physical security controls." },
];

const status = [
  { key: "Encryption", val: "AES-256-GCM ✓", ok: true },
  { key: "Transport", val: "TLS 1.3 ✓", ok: true },
  { key: "Auth", val: "MFA Enabled ✓", ok: true },
  { key: "Backup", val: "Daily · 30d Retention", ok: true },
  { key: "Uptime (30d)", val: "99.97%", ok: true },
  { key: "Data Residency", val: "Pakistan · ISO 27001", ok: true },
  { key: "Broker Access", val: "None · Read-only", ok: true },
  { key: "Last Audit", val: "Feb 2026", ok: true },
];

export default function SecurityPage() {
  return (
    <PublicLayout>
      <Section>
        <motion.div {...fade()}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Security</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "16px" }}>Your data is safe with us.</h1>
          <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "560px" }}>
            We treat your trading data with the same care you treat your portfolio. Enterprise-grade security, zero broker access, and daily backups — built in from day one.
          </p>
        </motion.div>
      </Section>

      <Section alt>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          {items.map((item, i) => (
            <motion.div key={i} {...fade(i * 0.07)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px" }}>
              <item.icon size={18} style={{ color: "var(--green)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{item.title}</h3>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Status board */}
        <motion.div {...fade(0.2)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)" }}>Security Status</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {status.map((s, i) => (
              <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                <p style={{ fontSize: "10px", color: "var(--text3)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.key}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)", fontFamily: "monospace" }}>{s.val}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      <Section>
        <motion.div {...fade()} style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-1px", color: "var(--text)", marginBottom: "16px" }}>Questions about security?</h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px" }}>Contact our security team at:</p>
          <div style={{ background: "var(--bg2)", borderRadius: "8px", padding: "16px", marginBottom: "24px", display: "inline-block" }}>
            <p>Email: <a href="mailto:ahmadjamildhami@gmail.com" style={{ color: "var(--green)", textDecoration: "none" }}>ahmadjamildhami@gmail.com</a></p>
            <p style={{ marginTop: "4px" }}>WhatsApp: <a href="https://wa.me/923338107788" style={{ color: "var(--green)", textDecoration: "none" }}>+92 333 8107788</a></p>
          </div>
          <a href="/contact" className="btn-ghost" style={{ textDecoration: "none", borderRadius: "4px", padding: "12px 24px", display: "inline-block" }}>Contact Us</a>
        </motion.div>
      </Section>
    </PublicLayout>
  );
}
