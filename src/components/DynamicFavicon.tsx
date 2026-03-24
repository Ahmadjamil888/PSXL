import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

export function DynamicFavicon() {
  const { theme } = useTheme();

  useEffect(() => {
    // Determine actual theme (handle "system" preference)
    let actualTheme = theme;
    if (theme === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute(
        "href",
        actualTheme === "dark"
          ? "/favicon-dark.png"
          : "/favicon-light.png"
      );
    }
  }, [theme]);

  return null;
}
