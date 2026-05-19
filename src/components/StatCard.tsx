import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl ${
        trend === "up" ? "glow-profit" : trend === "down" ? "glow-loss" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-white/60">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
          trend === "up" ? "bg-[var(--success-light)]" : trend === "down" ? "bg-[var(--danger-light)]" : "bg-white/8"
        }`}>
          <Icon className={`w-4 h-4 ${
            trend === "up" ? "text-[var(--success)]" : trend === "down" ? "text-[var(--danger)]" : "text-white/60"
          }`} />
        </div>
      </div>
      <p className={`text-2xl font-bold font-mono ${
        trend === "up" ? "text-[var(--success)]" : trend === "down" ? "text-[var(--danger)]" : "text-white"
      }`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-white/44">{subtitle}</p>
      )}
    </motion.div>
  );
}
