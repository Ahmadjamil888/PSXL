import { useState, useEffect } from "react";
import { Menu, X, Twitter, Github, Linkedin, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

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
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
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

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "56px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 40px)",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        background: scrolled ? "var(--bg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
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
                color: location.pathname === l.href ? "var(--text)" : "var(--text2)",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = location.pathname === l.href ? "var(--text)" : "var(--text2)")}
              >{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
          <Link to="/auth" className="hidden md:inline-flex btn-primary"
            style={{ padding: "10px 20px", fontSize: "11px", borderRadius: "4px", textDecoration: "none" }}>
            Get Started
          </Link>
          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "1px solid var(--border)", padding: "8px", cursor: "pointer", color: "var(--text)", borderRadius: "4px" }}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "fixed", top: "56px", left: 0, right: 0, zIndex: 49,
          background: "var(--bg)", borderBottom: "1px solid var(--border)",
          padding: "16px clamp(16px, 4vw, 40px) 24px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} to={l.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 0", fontSize: "14px", fontWeight: 500,
                color: "var(--text)", textDecoration: "none",
                borderBottom: "1px solid var(--border)",
              }}>
                {l.label}
                <ChevronRight size={14} style={{ color: "var(--text3)" }} />
              </Link>
            ))}
            <Link to="/auth" className="btn-primary"
              style={{ marginTop: "16px", textAlign: "center", textDecoration: "none", display: "block", padding: "14px", borderRadius: "4px" }}>
              Get Started — Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function PublicFooter() {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "clamp(40px, 8vw, 64px) clamp(16px, 4vw, 40px) 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "clamp(180px, 22%, 220px) 1fr", gap: "clamp(32px, 6vw, 80px)", paddingBottom: "clamp(32px, 5vw, 48px)", borderBottom: "1px solid var(--border)" }}
          className="footer-top-grid">
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "16px" }}><Logo height={30} /></div>
            <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text2)", lineHeight: 1.7, maxWidth: "220px" }}>
              The institutional-grade trading ledger for Pakistan Stock Exchange investors.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ color: "var(--text3)", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text3)")}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(16px, 3vw, 40px)" }}>
            {Object.entries(FOOTER_LINKS).map(([cat, items]) => (
              <div key={cat}>
                <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "16px" }}>{cat}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href} style={{ fontSize: "13px", color: "var(--text2)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}>
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
          <span style={{ fontSize: "12px", color: "var(--text3)" }}>© {new Date().getFullYear()} PSX Ledger Pro. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Disclaimer", href: "/disclaimer" }].map(l => (
              <Link key={l.href} to={l.href} style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text3)")}>
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
