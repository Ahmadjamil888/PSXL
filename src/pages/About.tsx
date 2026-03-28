import { motion } from "framer-motion";
import { TrendingUp, Shield, Users, Target, Award, BarChart3, BookOpen, Calculator, FileText, Layers } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>{children}</div>
  </section>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>{children}</p>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-1px", color: "var(--text)", marginBottom: "16px" }}>{children}</h2>
);

const Desc = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "600px" }}>{children}</p>
);

export default function AboutPage() {
  const features = [
    { icon: BookOpen, title: "Trade Entry & History", desc: "Log every buy and sell with full metadata — quantity, rate, brokerage, CDC charges, Zakat, and settlement date. T+2 settlement tracked automatically." },
    { icon: TrendingUp, title: "Real-Time P&L Tracking", desc: "See realised and unrealised gain or loss per position and at portfolio level. Weighted average cost computed automatically using FIFO / WAC." },
    { icon: Layers, title: "Sector & Scrip Breakdown", desc: "View exposure by KSE sector — Cement, Banking, E&P, Tech, and more. Instantly understand concentration risk across your holdings." },
    { icon: Award, title: "Dividend Tracker", desc: "Record cash and bonus dividends, right issues, and stock splits. Adjust cost basis automatically and track dividend yield per holding." },
    { icon: Calculator, title: "Tax Computation", desc: "Capital gains tax, withholding tax on dividends, and Zakat deductions — all calculated per FBR rules. Export a ready report for your tax consultant." },
    { icon: FileText, title: "Export & Reports", desc: "Generate portfolio statements, gain/loss summaries, and broker reconciliation sheets. Export to CSV or PDF in one click." },
  ];

  const values = [
    { title: "Transparency", desc: "Clear, honest communication about how your data is used and how our platform operates." },
    { title: "Innovation", desc: "Continuously improving based on user feedback and emerging technologies." },
    { title: "Reliability", desc: "99.9% uptime, daily automated backups with 30-day retention, and robust data recovery." },
    { title: "Community", desc: "A growing community of informed PSX traders who share knowledge and help each other succeed." },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <Section>
        <motion.div {...fade()}>
          <Kicker>About Us</Kicker>
          <H2>Built for PSX traders,<br />by PSX traders.</H2>
          <Desc>PSX Ledger Pro is the institutional-grade trading ledger built exclusively for Pakistan Stock Exchange investors. We give every trader access to professional-grade analytics — from the first-time investor to the seasoned portfolio manager.</Desc>
        </motion.div>
      </Section>

      {/* Mission */}
      <Section alt>
        <motion.div {...fade()} style={{ marginBottom: "40px" }}>
          <Kicker>Mission</Kicker>
          <H2>Our Mission</H2>
          <Desc>We believe every trader deserves clarity over their portfolio. While international platforms offer generic solutions, none addressed the specific needs of PSX investors — from FBR tax rules to KSE sector mapping. We built the tool we wished existed.</Desc>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {[
            { icon: Target, title: "Precision Analytics", desc: "Track every trade with detailed analytics including P&L calculations, win rates, and performance metrics tailored for PSX." },
            { icon: Shield, title: "Secure & Private", desc: "AES-256 encryption at rest, TLS 1.3 in transit. Your trading data is never shared with third parties." },
            { icon: Users, title: "Built for Traders", desc: "Developed by traders who understand the unique challenges of the Pakistan Stock Exchange." },
          ].map((item, i) => (
            <motion.div key={i} {...fade(i * 0.1)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px" }}>
              <item.icon size={20} style={{ color: "var(--green)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{item.title}</h3>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section>
        <motion.div {...fade()} style={{ marginBottom: "40px" }}>
          <Kicker>Platform</Kicker>
          <H2>Everything you need to trade with confidence</H2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {features.map((f, i) => (
            <motion.div key={i} {...fade(i * 0.07)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px" }}>
              <f.icon size={20} style={{ color: "var(--green)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Story */}
      <Section alt>
        <motion.div {...fade()}>
          <Kicker>Our Story</Kicker>
          <H2>From spreadsheets to a professional desk</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            {[
              "PSX Ledger was born from a simple observation: traders in Pakistan needed better tools to track their investments. While international platforms offered generic solutions, none addressed the specific needs of PSX investors.",
              "Founded in 2024, our team set out to build a comprehensive trading journal and analytics platform specifically designed for the Pakistan Stock Exchange — from calculating capital gains tax to understanding PSX-specific market patterns.",
              "Today, PSX Ledger serves thousands of active traders across Pakistan. We have helped our users track millions of rupees in trades, identify profitable strategies, and become more disciplined investors.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)" }}>{p}</p>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Values */}
      <Section>
        <motion.div {...fade()} style={{ marginBottom: "40px" }}>
          <Kicker>Values</Kicker>
          <H2>What we stand for</H2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {values.map((v, i) => (
            <motion.div key={i} {...fade(i * 0.08)} style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{v.title}</h4>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section alt>
        <motion.div {...fade()} style={{ textAlign: "center" }}>
          <H2>Ready to take control of your trades?</H2>
          <Desc>Join thousands of PSX traders who use PSX Ledger Pro to track, analyse, and improve their performance.</Desc>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "28px", flexWrap: "wrap" }}>
            <a href="/auth" className="btn-primary" style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 28px" }}>Get Started Free</a>
            <a href="/contact" className="btn-ghost" style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 28px" }}>Contact Us</a>
          </div>
        </motion.div>
      </Section>
    </PublicLayout>
  );
}
