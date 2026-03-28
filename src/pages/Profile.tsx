import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="dashboard-app space-y-5">
      <div>
        <p className="dash-page-kicker">Account</p>
        <h1 className="dash-page-title">Profile</h1>
        <p className="dash-page-desc">Manage your account information.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Account Information</span>
        </div>
        <div style={{ padding: "clamp(24px, 5vw, 40px)" }}>
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center text-2xl font-bold"
              style={{
                background: "var(--green)",
                color: "#000",
                borderRadius: "50%",
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h2
                style={{
                  fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: "4px",
                }}
              >
                {user?.email?.split("@")[0] || "User"}
              </h2>
              <p style={{ color: "var(--text2)", fontSize: "14px", wordBreak: "break-word" }}>
                {user?.email || ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              { icon: Mail, label: "Email", value: user?.email || "N/A" },
              { icon: Shield, label: "Authentication", value: "Email + OAuth" },
              {
                icon: Calendar,
                label: "Member Since",
                value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A",
              },
              {
                icon: User,
                label: "User ID",
                value: user?.id ? `${user.id.slice(0, 8)}...` : "N/A",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-4"
                style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--green)" }} />
                <div className="min-w-0">
                  <p style={{ fontSize: "12px", color: "var(--text3)" }}>{label}</p>
                  <p style={{ fontSize: "14px", color: "var(--text)", wordBreak: "break-word" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
