import { motion } from "framer-motion";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div {...fade()} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "28px", marginBottom: "16px" }}>
    <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "14px" }}>{title}</h2>
    <div style={{ fontSize: "14px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.75 }}>{children}</div>
  </motion.div>
);

export default function DisclaimerPage() {
  return (
    <PublicLayout>
      <section style={{ background: "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <motion.div {...fade()} style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Legal</p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "12px" }}>Disclaimer</h1>
            <p style={{ fontSize: "13px", color: "var(--text3)" }}>Last updated: January 2025</p>
          </motion.div>

          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--red)" }}>Important: PSX Ledger Pro is a record-keeping tool only. It does not provide financial, investment, tax, or legal advice.</p>
          </div>

          <Block title="No Financial Advice">
            <p>The information, analytics, and reports provided by PSX Ledger Pro are for informational and record-keeping purposes only. Nothing on this platform should be construed as financial advice, investment recommendations, or solicitation to buy or sell any securities. All investment decisions are made solely at your own discretion and risk.</p>
          </Block>

          <Block title="No Broker Connection">
            <p>PSX Ledger Pro is a completely manual ledger. It does not connect to your brokerage account, cannot place orders on your behalf, and has no access to your broker login credentials. All data is entered manually by you. We are not responsible for any discrepancies between your broker records and data entered in PSX Ledger Pro.</p>
          </Block>

          <Block title="Tax Calculations">
            <p>Any tax calculations provided by PSX Ledger Pro are based on publicly available FBR rates and are provided as a convenience only. These calculations may not reflect the most current tax rules, your specific tax situation, or applicable exemptions. Always consult a qualified tax consultant or chartered accountant before filing your tax returns. PSX Ledger Pro is not liable for any tax penalties or errors arising from reliance on our calculations.</p>
          </Block>

          <Block title="Past Performance">
            <p>Historical performance data displayed in PSX Ledger Pro reflects your own past trading activity as entered by you. Past performance does not guarantee or predict future results. The Pakistan Stock Exchange is subject to market risks, and the value of investments can go down as well as up.</p>
          </Block>

          <Block title="Data Accuracy">
            <p>PSX Ledger Pro relies on data entered manually by users. We are not responsible for errors, omissions, or inaccuracies in user-entered data. Market data, if displayed, is provided for reference only and may be delayed or inaccurate. Always verify trade details with your official broker contract notes.</p>
          </Block>

          <Block title="Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, PSX Ledger Pro, its operators, employees, and affiliates shall not be liable for any trading losses, financial damages, or other losses arising from your use of this platform or reliance on any information provided herein.</p>
          </Block>

          <Block title="Contact">
            <p>For questions about this disclaimer, contact us at: <strong style={{ color: "var(--text)" }}>legal@psxledger.com</strong></p>
          </Block>
        </div>
      </section>
    </PublicLayout>
  );
}
