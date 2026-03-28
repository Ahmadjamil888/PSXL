import { useState } from "react";
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
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: "linear-gradient(90deg, #1a1a00 0%, #2a2a00 100%)",
          borderBottom: "1px solid rgba(163,196,90,0.3)",
          padding: "10px clamp(12px, 4vw, 24px)",
        }}
      >
        {/* Two-row layout on mobile, single row on desktop */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Message row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <Zap size={14} style={{ color: "#a3c45a", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: "#e8e8c8", margin: 0, lineHeight: 1.5, flex: 1 }}>
              <strong style={{ color: "#a3c45a" }}>Guest Mode</strong> — your data is stored locally and will be lost when you close this tab.
            </p>
            {/* Dismiss — top right, always visible */}
            <button
              onClick={() => setDismissed(true)}
              style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "2px", flexShrink: 0 }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>

          {/* CTA row */}
          <div style={{ display: "flex", gap: "8px", paddingLeft: "22px" }}>
            <Link
              to="/auth"
              style={{
                padding: "7px 14px",
                fontSize: "clamp(10px, 2.5vw, 11px)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "#a3c45a",
                color: "#000",
                borderRadius: "4px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}
            >
              Save my data — free
            </Link>
            <button
              onClick={() => setDismissed(true)}
              style={{
                padding: "7px 12px",
                fontSize: "clamp(10px, 2.5vw, 11px)",
                background: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#888",
                borderRadius: "4px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
