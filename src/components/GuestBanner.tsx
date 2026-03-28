import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuest } from "@/contexts/GuestContext";
import { motion, AnimatePresence } from "framer-motion";

export default function GuestBanner() {
  const { isGuest } = useGuest();
  const [dismissed, setDismissed] = useState(false);

  if (!isGuest || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -48, opacity: 0 }}
        style={{
          position: "sticky", top: 0, zIndex: 90,
          background: "linear-gradient(90deg, #1a1a00 0%, #2a2a00 100%)",
          borderBottom: "1px solid rgba(163,196,90,0.3)",
          padding: "10px clamp(16px, 4vw, 32px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          <Zap size={14} style={{ color: "#a3c45a", flexShrink: 0 }} />
          <p style={{ fontSize: "13px", color: "#e8e8c8", margin: 0, lineHeight: 1.4 }}>
            <strong style={{ color: "#a3c45a" }}>Guest Mode</strong> — your data is stored locally and will be lost when you close this tab.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <Link to="/auth" style={{
            padding: "7px 16px", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            background: "#a3c45a", color: "#000", borderRadius: "4px",
            textDecoration: "none", whiteSpace: "nowrap",
          }}>
            Save my data — free
          </Link>
          <button onClick={() => setDismissed(true)} style={{
            background: "none", border: "none", color: "#888", cursor: "pointer", padding: "4px",
          }}>
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
