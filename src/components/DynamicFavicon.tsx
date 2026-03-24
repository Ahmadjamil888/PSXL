import { useEffect } from "react";

export function DynamicFavicon() {
  useEffect(() => {
    // Always use dark favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute("href", "/favicon-dark.png");
    }
  }, []);

  return null;
}
