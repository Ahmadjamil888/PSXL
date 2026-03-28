import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-4"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="max-w-md text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text3)" }}>
          Error
        </p>
        <h1 className="mb-3 text-5xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          404
        </h1>
        <p className="mb-8 text-base" style={{ color: "var(--text2)" }}>
          This page does not exist or was moved.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            background: "var(--green)",
            color: "#000",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Return to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
