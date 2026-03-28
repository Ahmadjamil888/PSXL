import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame } from "lucide-react";
import { useGuest } from "@/contexts/GuestContext";

// Shows after user adds their first trade OR after 45 seconds in guest mode
export default function UpgradeModal() {
  const { isGuest, guestTrades } = useGuest();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isGuest || dismissed) return;

    // Trigger after first trade is added
    if (guestTrades.length >= 1) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, [isGuest, guestTrades.length, dismissed]);

  useEffect(() => {
    if (!isGuest || dismissed) return;
    // Also trigger after 45 seconds regardless
    const t = setTimeout(() => setShow(true), 45000);
    return () => clearTimeout(t);
  }, [isGuest, dismissed]);

  if (!isGuest || !show || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
        onClick={() => { setShow(false); setDismissed(true); }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "32px 28px",
            maxWidth: "420px", width: "100%", textAlign: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => { setShow(false); setDismissed(true); }}
            style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}
          >
            <X size={16} />
          </button>

          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(163,196,90,0.12)", border: "1px solid rgba(163,196,90,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Flame size={22} style={{ color: "var(--green)" }} />
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text)", marginBottom: "10px", letterSpacing: "-0.5px" }}>
            You're already tracking trades.
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.65, marginBottom: "24px" }}>
            Don't lose this data. Create a free account in one click — your trades will be saved permanently and synced across devices.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              to="/auth"
              style={{
                display: "block", padding: "14px", background: "var(--green)", color: "#000",
                borderRadius: "6px", textDecoration: "none", fontSize: "13px",
                fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              Create free account — 1 click
            </Link>
            <button
              onClick={() => { setShow(false); setDismissed(true); }}
              style={{ padding: "12px", background: "none", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
            >
              Not now
            </button>
          </div>

          <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "16px" }}>
            No credit card. No commitment. Free forever.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
