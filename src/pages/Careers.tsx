import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>{children}</div>
  </section>
);

const openings = [
  { title: "Senior Frontend Engineer", type: "Full-time", location: "Karachi / Remote", desc: "Build and improve the PSX Ledger Pro web application using React, TypeScript, and Tailwind. Strong eye for UI/UX required." },
  { title: "Backend Engineer (Supabase / PostgreSQL)", type: "Full-time", location: "Karachi / Remote", desc: "Design and maintain our data infrastructure, APIs, and real-time features. Experience with Supabase or PostgreSQL preferred." },
  { title: "Financial Data Analyst", type: "Part-time", location: "Remote", desc: "Help us improve our tax computation engine and ensure FBR compliance. Background in Pakistani tax law or chartered accountancy preferred." },
];

export default function CareersPage() {
  return (
    <PublicLayout>
      <Section>
        <motion.div {...fade()}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Careers</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "16px" }}>Join the team</h1>
          <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "520px" }}>
            We're a small, focused team building the best trading ledger for Pakistan Stock Exchange investors. If you care about great software and financial tools, we'd love to hear from you.
          </p>
        </motion.div>
      </Section>

      <Section alt>
        <motion.div {...fade()} style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "8px" }}>Open Positions</p>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text)" }}>Current openings</h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {openings.map((job, i) => (
            <motion.div key={i} {...fade(i * 0.1)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>{job.title}</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text3)" }}><Clock size={12} />{job.type}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text3)" }}><MapPin size={12} />{job.location}</span>
                </div>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65, marginBottom: "16px" }}>{job.desc}</p>
              <a href="/contact" className="btn-ghost" style={{ textDecoration: "none", borderRadius: "4px", padding: "10px 20px", fontSize: "11px", display: "inline-block" }}>Apply via Contact</a>
            </motion.div>
          ))}
        </div>

        <motion.div {...fade(0.3)} style={{ marginTop: "32px", padding: "24px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", textAlign: "center" }}>
          <Briefcase size={20} style={{ color: "var(--text3)", marginBottom: "8px" }} />
          <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "8px" }}>Don't see a role that fits? We're always open to hearing from talented people.</p>
          <a href="/contact" style={{ fontSize: "13px", color: "var(--green)", textDecoration: "none" }}>Send us a message →</a>
        </motion.div>
      </Section>
    </PublicLayout>
  );
}
