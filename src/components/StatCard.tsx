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
      className={`glass rounded-xl p-5 ${
        trend === "up" ? "glow-profit" : trend === "down" ? "glow-loss" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          trend === "up" ? "bg-profit/10" : trend === "down" ? "bg-loss/10" : "bg-accent"
        }`}>
          <Icon className={`w-4 h-4 ${
            trend === "up" ? "text-profit" : trend === "down" ? "text-loss" : "text-muted-foreground"
          }`} />
        </div>
      </div>
      <p className={`text-2xl font-bold font-mono ${
        trend === "up" ? "text-profit" : trend === "down" ? "text-loss" : "text-foreground"
      }`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
