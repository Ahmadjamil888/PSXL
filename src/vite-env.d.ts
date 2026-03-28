/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional full origin for Yahoo chart API in production (same path as dev `/api/yahoo` proxy). */
  readonly VITE_MARKET_PROXY_URL?: string;
  /** Set to "true" to always use deterministic demo price series. */
  readonly VITE_FORCE_MARKET_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
