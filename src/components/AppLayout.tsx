import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, BookOpen, BarChart3, LogOut, Building, Settings, User, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/theme-provider";
import Logo from "@/components/Logo";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/companies", icon: Building, label: "Companies" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user, profilePicture } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Animated Sidebar - Fixed Height */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col shrink-0 overflow-hidden fixed left-0 top-0 h-screen"
            style={{
              borderRight: "1px solid var(--border)",
              background: "var(--chrome-bg)",
              zIndex: 100,
            }}
          >
            {/* Header */}
            <div
              className="p-5 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <Logo />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 transition-colors"
                  style={{
                    color: "var(--text2)",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.borderColor = "var(--border2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text2)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-hidden">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative"
                    style={{
                      color: isActive ? "var(--nav-accent)" : "var(--text2)",
                      background: isActive ? "var(--surface)" : "transparent",
                      border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "var(--bg2)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text2)";
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-0.5"
                        style={{ background: "var(--nav-accent)" }}
                        transition={{ type: "spring", duration: 0.3 }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
              <div
                className="px-4 py-3 mb-3 flex items-center gap-3"
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-10 h-10 object-cover"
                    style={{ borderRadius: "50%", border: "2px solid var(--accent)" }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 flex items-center justify-center text-sm font-medium"
                    style={{
                      background: "var(--accent)",
                      color: "#000",
                      borderRadius: "50%",
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-main)" }}
                  >
                    {user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all w-full"
                style={{
                  color: "var(--text-muted)",
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontFamily: "var(--font-main)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--red)";
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.borderColor = "var(--red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Collapsed Sidebar Toggle Button */}
      {!sidebarOpen && !isMobile && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-4 top-4 z-50"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 transition-all"
            style={{
              color: "var(--text2)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderColor = "var(--border2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text2)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Mobile Header */}
      <div
        className="fixed top-0 left-0 right-0 z-40 lg:hidden"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--chrome-bg)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Nav - Compact */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--chrome-bg)",
          height: '64px',
        }}
      >
        <nav className="flex items-center justify-around h-full">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]"
                style={{
                  color: isActive ? "var(--nav-accent)" : "var(--text2)",
                }}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={signOut}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]"
            style={{ color: "var(--text2)" }}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Out</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <main
        className="flex-1 overflow-auto min-w-0"
        style={{
          paddingLeft: isMobile ? 0 : sidebarOpen ? "280px" : "80px",
        }}
      >
        <div
          className="w-full max-w-[1600px] mx-auto box-border min-w-0 px-4 sm:px-5 lg:px-8"
          style={{
            paddingTop: isMobile ? "72px" : "32px",
            paddingBottom: isMobile
              ? "calc(96px + env(safe-area-inset-bottom, 0px))"
              : "32px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
