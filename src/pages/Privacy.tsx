import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Section = ({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) => (
  <section style={{ background: alt ? "var(--bg2)" : "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>{children}</div>
  </section>
);

const Block = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <motion.div {...fade()} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "28px", marginBottom: "16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <Icon size={18} style={{ color: "var(--green)" }} />
      <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: 0 }}>{title}</h2>
    </div>
    <div style={{ fontSize: "14px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.75 }}>{children}</div>
  </motion.div>
);

const Li = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: "6px" }}>{children}</li>
);

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <Section>
        <motion.div {...fade()}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Legal</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "12px" }}>Privacy Policy</h1>
          <p style={{ fontSize: "13px", color: "var(--text3)" }}>Last updated: January 2025</p>
        </motion.div>
      </Section>

      <Section alt>
        <Block icon={Lock} title="Introduction">
          <p>Welcome to PSX Ledger Pro. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our trading analytics platform. By using PSX Ledger Pro, you agree to the practices described in this policy.</p>
        </Block>

        <Block icon={Database} title="Information We Collect">
          <p style={{ marginBottom: "12px" }}>We collect the following types of information:</p>
          <p style={{ fontWeight: 500, color: "var(--text)", marginBottom: "8px" }}>Personal Information</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <Li>Email address and authentication credentials</Li>
            <Li>Name and contact information you voluntarily provide</Li>
            <Li>Device information including IP address and browser type</Li>
            <Li>Usage data about how you interact with our platform</Li>
          </ul>
          <p style={{ fontWeight: 500, color: "var(--text)", marginBottom: "8px" }}>Trading Data</p>
          <ul style={{ paddingLeft: "20px" }}>
            <Li>Stock symbols, quantities, and trade prices</Li>
            <Li>Entry and exit dates and times</Li>
            <Li>Trade notes and strategy tags</Li>
            <Li>Calculated profit and loss figures</Li>
            <Li>Portfolio value history and equity curve data</Li>
          </ul>
        </Block>

        <Block icon={Eye} title="How We Use Your Information">
          <ul style={{ paddingLeft: "20px" }}>
            <Li><strong>Service Provision:</strong> To provide and maintain our trading analytics platform.</Li>
            <Li><strong>Account Management:</strong> To authenticate your identity and provide customer support.</Li>
            <Li><strong>Service Improvement:</strong> To analyze usage patterns and improve our features.</Li>
            <Li><strong>Communication:</strong> To send important updates and security alerts.</Li>
            <Li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</Li>
            <Li><strong>Fraud Prevention:</strong> To detect and address security incidents.</Li>
          </ul>
        </Block>

        <Block icon={Cookie} title="Cookies">
          <p style={{ marginBottom: "12px" }}>We use cookies to enhance your experience:</p>
          <ul style={{ paddingLeft: "20px" }}>
            <Li><strong>Essential Cookies:</strong> Required for basic site functionality and security.</Li>
            <Li><strong>Preference Cookies:</strong> Remember your settings and choices.</Li>
            <Li><strong>Analytics Cookies:</strong> Help us understand how visitors use our platform (anonymized).</Li>
          </ul>
        </Block>

        <Block icon={Shield} title="Data Security">
          <ul style={{ paddingLeft: "20px" }}>
            <Li><strong>Encryption:</strong> AES-256 at rest, TLS 1.3 in transit.</Li>
            <Li><strong>Secure Infrastructure:</strong> Servers in secure data centers with 24/7 monitoring.</Li>
            <Li><strong>Access Controls:</strong> Strict controls ensure only authorized personnel can access systems.</Li>
            <Li><strong>Regular Audits:</strong> Security audits and penetration testing conducted regularly.</Li>
            <Li><strong>Data Backup:</strong> Automated daily backups with 30-day retention and point-in-time recovery.</Li>
            <Li><strong>Authentication:</strong> Multi-factor authentication support and secure password hashing.</Li>
          </ul>
        </Block>

        <Block icon={Database} title="Data Retention and Deletion">
          <ul style={{ paddingLeft: "20px" }}>
            <Li>Data retained as long as your account is active or as needed to provide services.</Li>
            <Li>Upon account deletion, personal data is permanently removed within 30 days.</Li>
            <Li>Anonymized, aggregated data may be retained for analytics purposes.</Li>
            <Li>Some information may be retained for legal compliance as required by law.</Li>
          </ul>
        </Block>

        <Block icon={Eye} title="Your Rights">
          <ul style={{ paddingLeft: "20px" }}>
            <Li><strong>Access:</strong> Request a copy of the personal data we hold about you.</Li>
            <Li><strong>Correction:</strong> Request correction of inaccurate data.</Li>
            <Li><strong>Deletion:</strong> Request deletion of your personal data.</Li>
            <Li><strong>Portability:</strong> Request transfer of your data to another service.</Li>
            <Li><strong>Objection:</strong> Object to certain types of data processing.</Li>
          </ul>
        </Block>

        <Block icon={Mail} title="Contact Us">
          <p style={{ marginBottom: "12px" }}>For privacy inquiries, contact us at:</p>
          <div style={{ background: "var(--bg2)", borderRadius: "8px", padding: "16px" }}>
            <p style={{ fontWeight: 500, color: "var(--text)", marginBottom: "8px" }}>PSX Ledger Pro</p>
            <p>Email: <a href="mailto:ahmadjamildhami@gmail.com" style={{ color: "var(--green)", textDecoration: "none" }}>ahmadjamildhami@gmail.com</a></p>
            <p style={{ marginTop: "4px" }}>WhatsApp / Phone: <a href="https://wa.me/923338107788" style={{ color: "var(--green)", textDecoration: "none" }}>+92 333 8107788</a></p>
            <p style={{ marginTop: "4px" }}>Address: Karachi, Pakistan</p>
            <p style={{ marginTop: "4px", color: "var(--text3)", fontSize: "12px" }}>Response time: within 48 hours</p>
          </div>
        </Block>

        <div style={{ background: "rgba(163,196,90,0.08)", border: "1px solid rgba(163,196,90,0.2)", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--text2)" }}>By using PSX Ledger Pro, you acknowledge that you have read and understood this Privacy Policy.</p>
        </div>
      </Section>
    </PublicLayout>
  );
}
