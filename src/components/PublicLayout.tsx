import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import KresnaFooter from "@/components/KresnaFooter";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

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
        <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl" style={{ borderColor: "var(--border)", background: "var(--chrome-bg)" }}>
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
                        active ? "text-[var(--brand)]" : "text-[color:var(--text-secondary)] hover:text-[var(--text)]"
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border text-[var(--text)]"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
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
            className="fixed left-3 right-3 top-[76px] z-40 overflow-hidden rounded-[28px] border p-4 shadow-[var(--shadow-soft)] backdrop-blur-2xl"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            <div className="space-y-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center justify-between rounded-2xl border px-4 py-4 text-sm font-medium"
                  style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-secondary)" }}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="brand-shell min-h-screen" style={{ color: "var(--text)" }}>
      <PublicNav />
      <main className="flex-1 pt-[88px]">{children}</main>
      <KresnaFooter />
    </div>
  );
}
