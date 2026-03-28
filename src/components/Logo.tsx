import { useTheme } from "@/components/theme-provider";

export function useResolvedTheme(): "dark" | "light" {
  const { theme } = useTheme();
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

const Logo = ({ className = "", height = 36 }: { className?: string; height?: number }) => {
  const resolved = useResolvedTheme();
  const src = resolved === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <img
      src={src}
      alt="PSX Ledger Pro"
      height={height}
      style={{ height: `${height}px`, width: "auto", display: "block" }}
      className={className}
    />
  );
};

export default Logo;
