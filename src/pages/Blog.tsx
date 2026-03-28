import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const posts = [
  { date: "Mar 2026", tag: "Guide", title: "How to calculate capital gains tax on PSX trades", desc: "A step-by-step guide to computing CGT on your Pakistan Stock Exchange equity trades per FBR rules for the 2025-26 tax year." },
  { date: "Feb 2026", tag: "Strategy", title: "Weighted Average Cost vs FIFO: which method suits PSX traders?", desc: "Understanding the difference between WAC and FIFO cost basis methods and how each affects your reported P&L and tax liability." },
  { date: "Feb 2026", tag: "Platform", title: "Introducing CSV and PDF import for bulk trade entry", desc: "You can now import your entire trade history from any PSX broker in seconds using our new CSV and PDF import feature." },
  { date: "Jan 2026", tag: "Guide", title: "T+2 settlement: what every PSX investor needs to know", desc: "Pakistan Stock Exchange operates on a T+2 settlement cycle. Here's what that means for your cash flow and trade planning." },
  { date: "Jan 2026", tag: "Analytics", title: "Using equity curves to evaluate your trading strategy", desc: "Your equity curve tells the story of your trading performance. Learn how to read it and what patterns to watch for." },
  { date: "Dec 2025", tag: "Security", title: "How we protect your trading data", desc: "A deep dive into the security measures we use to keep your portfolio data safe — from AES-256 encryption to daily backups." },
];

export default function BlogPage() {
  return (
    <PublicLayout>
      <section style={{ background: "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <motion.div {...fade()} style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Blog</p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "16px" }}>Insights for PSX traders</h1>
            <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--text2)", maxWidth: "480px" }}>Guides, strategies, and platform updates from the PSX Ledger Pro team.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {posts.map((post, i) => (
              <motion.div key={i} {...fade(i * 0.07)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border2)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", background: "rgba(163,196,90,0.1)", border: "1px solid rgba(163,196,90,0.2)", borderRadius: "4px", padding: "2px 8px" }}>{post.tag}</span>
                  <span style={{ fontSize: "11px", color: "var(--text3)" }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{post.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade(0.3)} style={{ textAlign: "center", marginTop: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "var(--text3)" }}>
              <BookOpen size={20} />
              <p style={{ fontSize: "14px" }}>More articles coming soon. Subscribe to our newsletter for updates.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
