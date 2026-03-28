import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart, Activity, Target, Calendar } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay } });

const charts = [
  { icon: TrendingUp, title: "Equity Curve", desc: "Track your cumulative P&L over time. See exactly when your strategy started working — or when it didn't." },
  { icon: BarChart3, title: "Daily & Monthly P&L", desc: "Bar charts showing your profit and loss by day and by month. Identify your best and worst trading periods at a glance." },
  { icon: PieChart, title: "Win / Loss Ratio", desc: "Donut chart showing your win rate across all closed trades. Drill down by buy vs sell side." },
  { icon: Activity, title: "Streak Analysis", desc: "Visualise consecutive winning and losing streaks. Understand your psychological patterns and risk exposure." },
  { icon: Target, title: "Risk vs Reward Scatter", desc: "Plot every trade's risk against its reward. Identify outliers and refine your position sizing." },
  { icon: Calendar, title: "Trading Days Heatmap", desc: "See which days of the week you trade most and perform best. Optimise your schedule around your edge." },
];

export default function AnalyticsInfoPage() {
  return (
    <PublicLayout>
      <section style={{ background: "var(--bg)", padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <motion.div {...fade()} style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", marginBottom: "12px" }}>Analytics</p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: "16px" }}>Deep insights into your trading</h1>
            <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "var(--text2)", maxWidth: "560px" }}>
              PSX Ledger Pro's analytics dashboard gives you 10+ charts and metrics to understand your performance, identify patterns, and improve your strategy.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "48px" }}>
            {charts.map((c, i) => (
              <motion.div key={i} {...fade(i * 0.07)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px" }}>
                <c.icon size={18} style={{ color: "var(--green)", marginBottom: "12px" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{c.title}</h3>
                <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.65 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade(0.3)} style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "16px" }}>See it in action</h2>
            <p style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "24px" }}>Create a free account and start logging trades to unlock the full analytics dashboard.</p>
            <a href="/auth" className="btn-primary" style={{ textDecoration: "none", borderRadius: "4px", padding: "14px 32px", display: "inline-block" }}>Get Started Free</a>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
