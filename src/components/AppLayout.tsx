import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, BookOpen, BarChart3, LogOut, TrendingUp, Building } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/theme-provider";
import Logo from "@/components/Logo";
import "../pages/Landing.css";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/companies", icon: Building, label: "Companies" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shrink-0 hidden md:flex" style={{ 
        borderRight: '1px solid var(--border)', 
        background: 'var(--bg)' 
      }}>
        <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors relative ${
                  isActive
                    ? ""
                    : ""
                }`}
                style={{
                  color: isActive ? 'var(--green)' : 'var(--text2)',
                  background: isActive ? 'var(--surface)' : 'transparent',
                  border: isActive ? '1px solid var(--border)' : 'none'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0"
                    style={{ background: 'var(--surface)' }}
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <item.icon className="w-4.5 h-4.5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="px-3 py-2 mb-2">
            <p style={{ fontSize: '12px', color: 'var(--text3)' }} className="truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors w-full"
            style={{
              color: 'var(--text2)',
              background: 'transparent',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--red)';
              e.currentTarget.style.background = 'var(--surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ 
        borderTop: '1px solid var(--border)', 
        background: 'var(--bg)' 
      }}>
        <nav className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 text-xs`}
                style={{
                  color: isActive ? 'var(--green)' : 'var(--text2)'
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
          <div className="flex flex-col items-center gap-1 px-4 py-1.5">
            <ThemeToggle />
          </div>
          <button
            onClick={signOut}
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-xs"
            style={{ color: 'var(--text2)' }}
          >
            <LogOut className="w-5 h-5" />
            Out
          </button>
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
