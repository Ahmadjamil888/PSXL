import { motion } from "framer-motion";
import { Bell, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <div className="dashboard-app space-y-5">
      <div>
        <p className="dash-page-kicker">Preferences</p>
        <h1 className="dash-page-title">Settings</h1>
        <p className="dash-page-desc">Customize your PSX Ledger experience.</p>
      </div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Notifications</span>
        </div>
        <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                  Trade Notifications
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
                  Get notified when trades are executed
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setNotifications(!notifications);
                toast.success(notifications ? "Notifications disabled" : "Notifications enabled");
              }}
              className="w-full px-4 py-3 transition-all sm:w-auto sm:py-2"
              style={{
                background: notifications ? "var(--green)" : "var(--surface)",
                color: notifications ? "#000" : "var(--text2)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {notifications ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Privacy</span>
        </div>
        <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                  Privacy Mode
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
                  Hide sensitive financial data
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPrivacyMode(!privacyMode);
                toast.success(privacyMode ? "Privacy mode off" : "Privacy mode on");
              }}
              className="w-full px-4 py-3 transition-all sm:w-auto sm:py-2"
              style={{
                background: privacyMode ? "var(--green)" : "var(--surface)",
                color: privacyMode ? "#000" : "var(--text2)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {privacyMode ? "On" : "Off"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
