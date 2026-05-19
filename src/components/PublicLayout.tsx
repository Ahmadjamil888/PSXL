import { useEffect, useState } from "react";
import {
  ChevronRight,
  Github,
  Linkedin,
  Menu,
  Sparkles,
  Twitter,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
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
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 px-3 py-3 md:px-5">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/10 bg-[var(--chrome-bg)] px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-3">
            <Logo height={28} />
          </Link>

          {!isMobile && (
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={`text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                        active ? "text-[var(--brand)]" : "text-white/58 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center gap-2">
            {!isMobile && (
              <>
                <Link to="/dashboard?mode=guest" className="btn-secondary">
                  Explore Demo
                </Link>
                <Link to="/auth" className="btn-primary">
                  Start Tracking
                </Link>
              </>
            )}
            {isMobile && (
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white"
                aria-label="Toggle navigation"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed left-3 right-3 top-[76px] z-40 overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(8,8,8,0.96)] p-4 shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            <div className="space-y-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-medium text-white/78"
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/auth" className="btn-primary">
                Start Tracking
              </Link>
              <Link to="/dashboard?mode=guest" className="btn-secondary">
                Explore Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="px-4 pb-8 pt-12 md:px-6">
      <div className="mx-auto max-w-[1400px] rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:px-10 md:py-10">
        <div className="grid gap-10 border-b border-white/8 pb-8 md:grid-cols-[minmax(220px,280px)_1fr]">
          <div>
            <Logo height={30} />
            <p className="mt-4 max-w-[240px] text-sm leading-7 text-white/58">
              Precision tools for PSX traders who want a cleaner ledger, sharper
              insight, and better decisions.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/48 transition-colors hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([group, items]) => (
              <div key={group}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
                  {group}
                </p>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="text-sm text-white/58 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[var(--brand-border)] bg-[var(--brand-soft)] px-4 py-4 text-sm leading-6 text-white/70">
          <span className="font-semibold text-[var(--brand)]">Important:</span>{" "}
          PSXL is an educational tracking platform, not financial or tax advice.
          Always verify decisions and filings with a qualified professional.
        </div>

        <div className="mt-6 flex flex-col gap-4 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} PSXL. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 text-white/46">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
              Built for disciplined Pakistan Stock Exchange traders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="brand-shell min-h-screen text-white">
      <PublicNav />
      <main className="flex-1 pt-[88px]">{children}</main>
      <PublicFooter />
    </div>
  );
}
