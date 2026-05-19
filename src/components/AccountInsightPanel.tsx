import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Brain, Loader2, RefreshCcw } from "lucide-react";
import { analyzeWithAI } from "@/lib/ai/gemini";
import { buildAccountSnapshot, buildBehavioralPatterns, buildLocalFindings, toAIHoldings, toAITrades } from "@/lib/ai/accountContext";
import { computeHoldings, type Trade } from "@/hooks/useTrades";

export default function AccountInsightPanel({ trades }: { trades: Trade[] }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const holdings = useMemo(() => computeHoldings(trades), [trades]);
  const accountSnapshot = useMemo(() => buildAccountSnapshot(trades), [trades]);
  const behavioralPatterns = useMemo(() => buildBehavioralPatterns(trades), [trades]);
  const localFindings = useMemo(() => buildLocalFindings(trades, holdings), [trades, holdings]);

  const loadInsight = useCallback(async () => {
    if (trades.length === 0) return;
    setLoading(true);
    try {
      const response = await analyzeWithAI({
        context: "after_market",
        userMessage: "Review this account. Point out the main issue, the main strength, and one next action.",
        trades: toAITrades(trades),
        holdings: toAIHoldings(holdings),
        accountSnapshot,
        behavioralPatterns,
      });
      setMessage(response.message);
    } finally {
      setLoading(false);
    }
  }, [accountSnapshot, behavioralPatterns, holdings, trades]);

  useEffect(() => {
    void loadInsight();
  }, [loadInsight]);

  if (trades.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div
        className="table-container"
        style={{
          background: "linear-gradient(135deg, rgba(159, 232, 112, 0.08), rgba(255,255,255,0.03))",
          border: "1px solid rgba(159, 232, 112, 0.2)",
        }}
      >
        <div className="table-header">
          <span className="table-header-title">Gemini Account Read</span>
          <button
            type="button"
            onClick={() => void loadInsight()}
            disabled={loading}
            className="btn-secondary"
            style={{ minHeight: 36, paddingInline: 14, fontSize: 11 }}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
            Refresh
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <div className="flex items-start gap-3 rounded-[24px] border border-white/8 bg-black/40 p-5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <Brain className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">AI Summary</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                {loading
                  ? "Gemini is reviewing your trades, open positions, and behavior tags."
                  : message || "No AI summary yet."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-header-title">What Stands Out</span>
          <span className="table-badge">{localFindings.length} findings</span>
        </div>
        <div style={{ padding: "20px", display: "grid", gap: "12px" }}>
          {localFindings.map((finding) => (
            <div
              key={finding.title}
              className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--brand)]" />
                <p className="text-sm font-semibold tracking-[-0.02em] text-white">{finding.title}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/58">{finding.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
