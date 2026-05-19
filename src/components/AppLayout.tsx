import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { useTrades, getTradeStats } from "@/hooks/useTrades";
import { formatCurrency } from "@/lib/psx";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/performance", icon: BarChart3, label: "Performance" },
  { to: "/psychology", icon: Brain, label: "Psychology" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user, profilePicture } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: trades = [] } = useTrades();
  const stats = getTradeStats(trades);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarWidth = sidebarOpen ? 256 : 0;

  return (
    <div className="brand-shell min-h-screen" style={{ color: "var(--text)" }}>
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
            className="fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r px-3 py-3 backdrop-blur-2xl"
            style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-canvas) 92%, transparent)" }}
          >
            <div className="brand-panel-soft flex items-center justify-between rounded-[20px] px-3 py-3">
              <Logo height={24} />
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-muted)" }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="brand-panel mt-3 flex items-center gap-3 px-3 py-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
                  PSXL
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Trade with cleaner signal</p>
              </div>
            </div>

            <nav className="mt-4 flex-1 space-y-1.5">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all ${
                      active
                        ? "border border-[var(--brand-border)] bg-[var(--brand-soft)] text-white"
                        : "border border-transparent hover:bg-white/[0.03]"
                    }`}
                    style={!active ? { color: "var(--text-secondary)" } : undefined}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        active ? "text-[var(--brand)]" : "group-hover:text-[var(--text)]"
                      }`}
                      style={!active ? { color: "var(--text-tertiary)" } : undefined}
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="space-y-2.5 pt-2">
              <div className="brand-panel rounded-[20px] px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--text-tertiary)" }}>
                      Account Balance
                    </p>
                    <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                      {formatCurrency(stats.totalPnL)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="brand-panel rounded-[20px] px-3 py-3">
                <div className="flex items-center gap-3">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border object-cover"
                      style={{ borderColor: "var(--border)" }}
                    />
                  ) : (
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-bold text-[var(--brand)]">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>{user?.email || ""}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-2xl border px-3 py-2" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--text-tertiary)" }}>Theme</p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Light or dark</p>
                  </div>
                  <ThemeToggle />
                </div>
                <button onClick={signOut} className="btn-secondary mt-3 w-full text-[11px]">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!sidebarOpen && !isMobile && (
        <div className="fixed left-5 top-5 z-50">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors"
            style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-card) 88%, transparent)", color: "var(--text-muted)" }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {isMobile && (
        <div className="fixed left-0 right-0 top-0 z-40 border-b px-4 py-3 backdrop-blur-xl lg:hidden" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-card) 90%, transparent)" }}>
          <div className="flex items-center justify-between">
            <Logo height={28} />
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-3 left-3 right-3 z-40 rounded-full border px-2 py-2 shadow-[var(--shadow-soft)] backdrop-blur-2xl lg:hidden" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-card) 92%, transparent)" }}>
          <nav className="flex items-center justify-between">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-2 text-[10px] font-semibold ${
                    active ? "text-[var(--brand)]" : ""
                  }`}
                  style={!active ? { color: "var(--text-tertiary)" } : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      <main
        className="min-w-0 flex-1 transition-[padding] duration-300"
        style={{ paddingLeft: isMobile ? 0 : sidebarWidth }}
      >
        <div className="mx-auto w-full max-w-[1640px] px-4 pb-[104px] pt-[82px] sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
