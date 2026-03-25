import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none"
      style={{
        background: "var(--bg-input)",
        border: "1px solid var(--border-subtle)",
      }}
      aria-label="Toggle theme"
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center transition-opacity"
        style={{ opacity: isDark ? 0.3 : 1 }}
      >
        <Sun className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
      </span>
      <span
        className="absolute right-2 flex h-4 w-4 items-center justify-center transition-opacity"
        style={{ opacity: isDark ? 1 : 0.3 }}
      >
        <Moon className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
      </span>
      <span
        className="inline-block h-6 w-6 transform rounded-full transition-transform"
        style={{
          background: "var(--accent)",
          transform: isDark ? "translateX(30px)" : "translateX(2px)",
        }}
      />
    </button>
  );
};

export default ThemeToggle;
