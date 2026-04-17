import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { getSortedPosts, formatDate } from "@/data/blogPosts";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px)" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>{children}</div>
  </section>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>{children}</p>
);

const H2 = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-1px", color: "var(--text)", marginBottom: "16px", ...style }}>{children}</h2>
);

const Desc = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "600px", ...style }}>{children}</p>
);

export default function BlogPage() {
  const posts = getSortedPosts();

  return (
    <PublicLayout>
      {/* Hero */}
      <Section>
        <motion.div {...fade()} style={{ textAlign: "center" }}>
          <Kicker>Blog</Kicker>
          <H2 style={{ textAlign: "center" }}>Insights for PSX investors.</H2>
          <Desc style={{ margin: "0 auto" }}>Practical guides on trading, tax, portfolio strategy, and market analysis — written for Pakistan Stock Exchange investors.</Desc>
        </motion.div>
      </Section>

      {/* Posts grid */}
      <Section alt>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "32px", maxWidth: "1200px", margin: "0 auto", textAlign: "left" }}>
          {posts.map((post, i) => (
            <motion.div key={post.slug} {...fade(i * 0.08)}>
              <Link
                to={`/blog/${post.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <article
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "32px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--green)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Category badge */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--green)",
                    background: "rgba(163,196,90,0.1)", padding: "6px 14px",
                    borderRadius: "6px", alignSelf: "flex-start",
                  }}>
                    <Tag size={11} />
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text)", lineHeight: 1.3, margin: 0, textAlign: "left" }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, flex: 1, margin: 0, textAlign: "left" }}>
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text2)" }}>
                        <Calendar size={12} />
                        {formatDate(post.date)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text2)" }}>
                        <User size={12} />
                        {post.author}
                      </span>
                    </div>
                    <ArrowRight size={16} style={{ color: "var(--green)" }} />
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <motion.div {...fade()} style={{ textAlign: "center" }}>
          <H2 style={{ textAlign: "center" }}>Ready to track your trades?</H2>
          <Desc style={{ margin: "0 auto", textAlign: "center" }}>Join thousands of PSX traders who use PSX Ledger Pro to manage their portfolio with precision.</Desc>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
            <a href="/auth" className="btn-primary" style={{ textDecoration: "none", borderRadius: "6px", padding: "16px 32px" }}>Get Started Free</a>
            <a href="/contact" className="btn-ghost" style={{ textDecoration: "none", borderRadius: "6px", padding: "16px 32px" }}>Contact Us</a>
          </div>
        </motion.div>
      </Section>
    </PublicLayout>
  );
}
