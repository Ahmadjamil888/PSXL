import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Clock, CheckCircle, ExternalLink } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>{children}</div>
  </section>
);

const faqs = [
  { q: "How do I get started?", a: "Create a free account, verify your email, and start logging your trades. Our interface makes it easy to begin tracking your PSX investments right away." },
  { q: "Is my trading data secure?", a: "Yes. We use AES-256 encryption at rest and TLS 1.3 in transit. Your data is never shared with third parties." },
  { q: "Can I export my data?", a: "Yes — export your complete trade history as CSV at any time from the Journal page. PDF reports are also available." },
  { q: "Is PSX Ledger free?", a: "Yes, PSX Ledger Pro is completely free to use. All features are available without any charges." },
  { q: "How is data backed up?", a: "All data is automatically backed up daily with 30 days of retention. You can also manually export your ledger at any time." },
  { q: "How do I report a bug?", a: "Email us or message on WhatsApp. We aim to respond within 24 hours." },
];

export default function ContactPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <Section>
        <motion.div {...fade()}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Contact</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "16px" }}>Get in touch</h1>
          <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "520px" }}>
            Have questions, feedback, or need support? Reach out directly — we respond fast.
          </p>
        </motion.div>
      </Section>

      {/* Contact cards */}
      <Section alt>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          {/* Email */}
          <motion.div {...fade(0)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
            <Mail size={20} style={{ color: "var(--green)", marginBottom: "14px" }} />
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "8px" }}>Email</p>
            <a href="mailto:ahmadjamildhami@gmail.com" style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
              ahmadjamildhami@gmail.com
              <ExternalLink size={12} style={{ color: "var(--text3)" }} />
            </a>
            <p style={{ fontSize: "12px", color: "var(--text3)" }}>For general inquiries & support</p>
          </motion.div>

          {/* WhatsApp / Phone */}
          <motion.div {...fade(0.1)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
            <MessageCircle size={20} style={{ color: "#25d366", marginBottom: "14px" }} />
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "8px" }}>WhatsApp</p>
            <a href="https://wa.me/923338107788" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#25d366")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
              +92 333 8107788
              <ExternalLink size={12} style={{ color: "var(--text3)" }} />
            </a>
            <p style={{ fontSize: "12px", color: "var(--text3)" }}>Chat with us on WhatsApp</p>
          </motion.div>

          {/* Phone */}
          <motion.div {...fade(0.2)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
            <Phone size={20} style={{ color: "var(--green)", marginBottom: "14px" }} />
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "8px" }}>Phone</p>
            <a href="tel:+923338107788" style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
              0333 8107788
              <ExternalLink size={12} style={{ color: "var(--text3)" }} />
            </a>
            <p style={{ fontSize: "12px", color: "var(--text3)" }}>Call or SMS</p>
          </motion.div>

          {/* Response time */}
          <motion.div {...fade(0.3)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
            <Clock size={20} style={{ color: "var(--green)", marginBottom: "14px" }} />
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "8px" }}>Response Time</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>Within 24 hours</p>
            <p style={{ fontSize: "12px", color: "var(--text3)" }}>Mon – Sat, 9am – 9pm PKT</p>
          </motion.div>
        </div>

        {/* Quick action buttons */}
        <motion.div {...fade(0.35)} style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <a href="mailto:ahmadjamildhami@gmail.com" className="btn-primary"
            style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <Mail size={14} /> Send Email
          </a>
          <a href="https://wa.me/923338107788" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#25d366", color: "#fff", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
            <MessageCircle size={14} /> WhatsApp
          </a>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section>
        <motion.div {...fade()} style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>FAQ</p>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-1px", color: "var(--text)" }}>Frequently asked questions</h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fade(i * 0.07)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle size={16} style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>{faq.q}</p>
                  <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </PublicLayout>
  );
}
