import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div {...fade()} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "28px", marginBottom: "16px" }}>
    <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "14px" }}>{title}</h2>
    <div style={{ fontSize: "14px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.75 }}>{children}</div>
  </motion.div>
);

export default function TermsPage() {
  return (
    <PublicLayout>
      <section style={{ background: "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <motion.div {...fade()} style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Legal</p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "12px" }}>Terms of Service</h1>
            <p style={{ fontSize: "13px", color: "var(--text3)" }}>Last updated: January 2025</p>
          </motion.div>

          <Block title="1. Acceptance of Terms">
            <p>By accessing or using PSX Ledger Pro, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of any changes.</p>
          </Block>

          <Block title="2. Description of Service">
            <p>PSX Ledger Pro is a trading journal and analytics platform designed for Pakistan Stock Exchange investors. We provide tools for logging trades, tracking portfolio performance, and generating reports. PSX Ledger Pro is a manual ledger tool — it does not connect to brokerage accounts, execute trades, or provide financial advice.</p>
          </Block>

          <Block title="3. User Accounts">
            <ul style={{ paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>You must provide accurate and complete information when creating an account.</li>
              <li style={{ marginBottom: "6px" }}>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li style={{ marginBottom: "6px" }}>You are responsible for all activity that occurs under your account.</li>
              <li style={{ marginBottom: "6px" }}>You must notify us immediately of any unauthorized use of your account.</li>
              <li>You must be at least 18 years old to use this service.</li>
            </ul>
          </Block>

          <Block title="4. Acceptable Use">
            <p style={{ marginBottom: "12px" }}>You agree not to:</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>Use the platform for any unlawful purpose or in violation of any regulations.</li>
              <li style={{ marginBottom: "6px" }}>Attempt to gain unauthorized access to any part of the platform.</li>
              <li style={{ marginBottom: "6px" }}>Transmit any harmful, offensive, or disruptive content.</li>
              <li style={{ marginBottom: "6px" }}>Reverse engineer or attempt to extract the source code of our software.</li>
              <li>Use automated tools to scrape or extract data from the platform.</li>
            </ul>
          </Block>

          <Block title="5. Data and Privacy">
            <p>Your use of PSX Ledger Pro is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We take the security of your trading data seriously and implement industry-standard measures to protect it. All data is encrypted at rest and in transit, and automatically backed up daily with 30-day retention.</p>
          </Block>

          <Block title="6. Disclaimer of Financial Advice">
            <p>PSX Ledger Pro is a record-keeping and analytics tool only. Nothing on this platform constitutes financial, investment, tax, or legal advice. All trading decisions are made solely by you. Past performance data shown in the platform does not guarantee future results. Always consult a qualified financial advisor before making investment decisions.</p>
          </Block>

          <Block title="7. Limitation of Liability">
            <p>To the maximum extent permitted by law, PSX Ledger Pro and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to loss of profits, data, or trading opportunities.</p>
          </Block>

          <Block title="8. Termination">
            <p>We reserve the right to suspend or terminate your account at any time for violation of these terms. You may also delete your account at any time through your account settings. Upon termination, your data will be deleted within 30 days as described in our Privacy Policy.</p>
          </Block>

          <Block title="9. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Karachi, Pakistan.</p>
          </Block>

          <Block title="10. Contact">
            <p>For questions about these Terms, contact us at: <strong style={{ color: "var(--text)" }}>legal@psxledger.com</strong></p>
          </Block>
        </div>
      </section>
    </PublicLayout>
  );
}
