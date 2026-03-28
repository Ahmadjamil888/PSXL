import { useState, useEffect } from "react";
import { Menu, X, Twitter, Github, Linkedin, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { useTheme } from "@/components/theme-provider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Analytics", href: "/analytics-info" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

// Resolve "system" to actual dark/light
function useResolvedTheme(): "dark" | "light" {
  const { theme } = useTheme();
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const resolved = useResolvedTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const navBg = resolved === "dark" ? "#000000" : "#ffffff";
  const borderColor = resolved === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = resolved === "dark" ? "#ffffff" : "#000000";
  const textMuted = resolved === "dark" ? "#888888" : "#666666";
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "56px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 40px)",
        borderBottom: `1px solid ${scrolled ? borderColor : "transparent"}`,
        background: "var(--chrome-bg)",
        transition: "border-color 0.3s ease",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Logo height={30} />
        </Link>

        {/* Desktop links */}
        <ul style={{ display: "flex", gap: "clamp(16px, 3vw, 32px)", listStyle: "none", margin: 0, padding: 0 }}
          className="hidden md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link to={l.href} style={{
                fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em",
                textTransform: "uppercase", textDecoration: "none",
                color: location.pathname === l.href ? textColor : textMuted,
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = textColor)}
                onMouseLeave={e => (e.currentTarget.style.color = location.pathname === l.href ? textColor : textMuted)}
              >{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme toggle pill */}
          <div
            onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
            style={{
              width: 44, height: 24,
              background: resolved === "dark" ? "#1a1a1a" : "#e8e8e8",
              border: `1px solid ${borderColor}`,
              borderRadius: 12, cursor: "pointer", position: "relative",
              display: "flex", alignItems: "center", padding: "0 4px", flexShrink: 0,
            }}
            aria-label="Toggle theme"
          >
            <div style={{
              width: 16, height: 16, borderRadius: "50%", background: "var(--green)",
              transform: resolved === "dark" ? "translateX(0)" : "translateX(20px)",
              transition: "transform 0.2s ease",
            }} />
          </div>

          <Link to="/auth"
            className="hidden md:inline-flex"
            style={{
              padding: "10px 20px", fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.1em", textTransform: "uppercase",
              background: "var(--green)", color: "#000",
              border: "none", borderRadius: "4px", textDecoration: "none",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
            Get Started
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: `1px solid ${borderColor}`, padding: "8px", cursor: "pointer", color: textColor, borderRadius: "4px" }}            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "fixed", top: "56px", left: 0, right: 0, zIndex: 99,
          background: "var(--chrome-bg)", borderBottom: `1px solid ${borderColor}`,
          padding: "16px clamp(16px, 4vw, 40px) 24px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} to={l.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 0", fontSize: "14px", fontWeight: 500,
                color: textColor, textDecoration: "none",
                borderBottom: `1px solid ${borderColor}`,
              }}>
                {l.label}
                <ChevronRight size={14} style={{ color: textMuted }} />
              </Link>
            ))}
            <Link to="/auth"
              style={{
                marginTop: "16px", textAlign: "center", textDecoration: "none",
                display: "block", padding: "14px", borderRadius: "4px",
                background: "var(--green)", color: "#000",
                fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
              Get Started — Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function PublicFooter() {
  const resolved = useResolvedTheme();
  const footerBg = "var(--chrome-bg)";
  const borderColor = resolved === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textMuted = resolved === "dark" ? "#555555" : "#999999";
  const textSub = resolved === "dark" ? "#888888" : "#666666";
  const textMain = resolved === "dark" ? "#ffffff" : "#000000";

  return (
    <footer style={{ background: footerBg, borderTop: `1px solid ${borderColor}`, padding: "clamp(40px, 8vw, 64px) clamp(16px, 4vw, 40px) 0", marginTop: 0 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "clamp(32px, 6vw, 80px)", paddingBottom: "clamp(32px, 5vw, 48px)", borderBottom: `1px solid ${borderColor}` }}
          className="footer-top-grid">
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "16px" }}><Logo height={30} /></div>
            <p style={{ fontSize: "13px", fontWeight: 300, color: textSub, lineHeight: 1.7, maxWidth: "220px" }}>
              The institutional-grade trading ledger for Pakistan Stock Exchange investors.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ color: textMuted, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = textMain)}
                  onMouseLeave={e => (e.currentTarget.style.color = textMuted)}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(16px, 3vw, 40px)" }}>
            {Object.entries(FOOTER_LINKS).map(([cat, items]) => (
              <div key={cat}>
                <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: textMuted, marginBottom: "16px" }}>{cat}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href} style={{ fontSize: "13px", color: textSub, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = textMain)}
                        onMouseLeave={e => (e.currentTarget.style.color = textSub)}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "20px 0" }}>
          <span style={{ fontSize: "12px", color: textMuted }}>© {new Date().getFullYear()} PSX Ledger Pro. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Disclaimer", href: "/disclaimer" }].map(l => (
              <Link key={l.href} to={l.href} style={{ fontSize: "12px", color: textMuted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = textMain)}
                onMouseLeave={e => (e.currentTarget.style.color = textMuted)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text)" }}>
      <PublicNav />
      <main style={{ flex: 1, paddingTop: "56px" }}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
