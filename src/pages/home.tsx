import { ArrowRight, Check, ChevronRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";

const stats = [
  { value: "10s", label: "to log a trade" },
  { value: "24/7", label: "journal access" },
  { value: "1", label: "single trader workflow" },
  { value: "0 fluff", label: "only useful signal" },
];

const painPoints = [
  "Trades get logged late, so the context disappears.",
  "Performance numbers exist, but the reason behind them does not.",
  "Discipline breaks long before P&L makes the problem obvious.",
];

const featureCards = [
  {
    title: "Clean Trade Journal",
    copy: "Capture entries, exits, notes, screenshots, and rationale without turning the process into admin work.",
  },
  {
    title: "Reality-First Dashboard",
    copy: "See win rate, equity drift, position behavior, and repeat mistakes in a layout built for fast review.",
  },
  {
    title: "Psychology Tracking",
    copy: "Tag emotional states and recurring discipline failures so your review loop is tied to behavior, not just outcome.",
  },
  {
    title: "Gemini Account Read",
    copy: "Let the AI look across trades, holdings, and behavior tags to point out what deserves attention now.",
  },
];

const workflow = [
  { step: "01", title: "Record", copy: "Log the trade the moment it happens with the details that usually get lost later." },
  { step: "02", title: "Review", copy: "Break down outcomes, execution quality, and whether the idea matched the plan." },
  { step: "03", title: "Correct", copy: "Spot patterns early and tighten the rules before bad behavior compounds." },
];

const proofCards = [
  {
    title: "Execution over decoration",
    copy: "A darker system, tighter hierarchy, and stronger contrast keep attention on actions and decisions.",
  },
  {
    title: "Built for PSX traders",
    copy: "The product language and flow stay focused on traders who need a local, practical tracking workspace.",
  },
  {
    title: "Structured for daily use",
    copy: "The system is designed around repetition: log, evaluate, improve, repeat without friction.",
  },
];

const faqs = [
  {
    q: "Who is PSXL for?",
    a: "Independent Pakistan Stock Exchange traders who want a cleaner journal and more honest performance review.",
  },
  {
    q: "Is this a broker or signal platform?",
    a: "No. It is a tracking and review product for your own process, decisions, and execution quality.",
  },
  {
    q: "Can someone try it before signing up?",
    a: "Yes. The guest dashboard mode lets users inspect the product before creating an account.",
  },
];

const sectionShell =
  "relative flex min-h-[100dvh] flex-col justify-between overflow-hidden rounded-[36px] border border-white/8 px-6 py-8 shadow-[0_36px_110px_rgba(0,0,0,0.24)] md:px-10 md:py-10 lg:px-14 lg:py-14";

function SectionIntro({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-[760px]">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">{kicker}</p>
      <h2 className="mt-4 font-display text-[36px] font-medium leading-[0.95] tracking-[-0.05em] text-white md:text-[52px]">
        {title}
      </h2>
      <p className="mt-5 max-w-[64ch] text-sm leading-7 text-white/62 md:text-[15px]">{copy}</p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <section className={`${sectionShell} border-white/10 bg-black`}>
          <div className="absolute inset-0">
            <video
              src={HERO_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-24"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(159,232,112,0.22),transparent_28%),linear-gradient(135deg,rgba(0,0,0,0.16),rgba(0,0,0,0.88))]" />
          </div>

          <div className="relative z-10 grid min-h-full gap-10 lg:grid-cols-[minmax(0,1.08fr)_360px] lg:items-between">
            <div className="flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-soft)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Trading journal for disciplined review
                </div>

                <h1 className="mt-7 max-w-[11ch] font-display text-[44px] font-medium leading-[0.92] tracking-[-0.06em] text-white md:text-[72px]">
                  Track every trade without losing the truth behind it.
                </h1>

                <p className="mt-6 max-w-[58ch] text-[15px] leading-7 text-white/66 md:text-[17px]">
                  PSXL gives PSX traders a cleaner journal, a harder performance read,
                  and a calmer workflow for reviewing what actually happened.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => navigate("/auth")} className="btn-primary">
                    Start Tracking
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link to="/dashboard?mode=guest" className="btn-secondary">
                    Explore Demo
                  </Link>
                </div>
              </motion.div>

              <div className="mt-10 grid gap-4 md:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
                  >
                    <p className="font-display text-[30px] font-medium tracking-[-0.05em] text-white md:text-[34px]">{item.value}</p>
                    <p className="mt-2 text-sm text-white/54">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Today</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Review Faster</p>
                </div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3 py-5">
                {[
                  "Log entries and exits with notes",
                  "See behavior and P&L in one place",
                  "Let Gemini point out account pressure",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/40 px-4 py-3 text-sm text-white/76"
                  >
                    <Check className="h-4 w-4 text-[var(--brand)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-[22px] border border-white/8 bg-black px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">Why it works</p>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  The landing experience now uses full-height sections and keeps the same dark visual system as the product, so the page feels deliberate instead of clipped.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionShell} bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]`}>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <SectionIntro
              kicker="Section 2"
              title="Most traders do not have a logging problem. They have a recall problem."
              copy="The issue is not whether trades are recorded at all. It is whether the context, emotion, and reasoning survive long enough to be reviewed honestly."
            />

            <div className="grid gap-4">
              {painPoints.map((item, index) => (
                <div key={item} className="rounded-[28px] border border-white/8 bg-black/40 px-5 py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Pressure {index + 1}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/8 bg-black p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">System gap</p>
              <p className="mt-4 max-w-[28ch] text-2xl font-semibold tracking-[-0.04em] text-white">
                If the note, chart, and reasoning vanish, the review becomes fiction.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-sm leading-7 text-white/62">
                PSXL is aimed at preserving the part of the trade that usually disappears first: why you entered, what you saw, what rule you ignored, and whether that pattern keeps repeating.
              </p>
            </div>
          </div>
        </section>

        <section className={`${sectionShell} bg-black`}>
          <SectionIntro
            kicker="Section 3"
            title="Core tools built around daily review instead of generic finance clutter."
            copy="The product flow stays narrow on purpose. Every block is there to reduce friction between taking a trade and learning from it."
          />

          <div className="mt-10 grid flex-1 gap-4 md:grid-cols-2">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="flex min-h-[220px] flex-col justify-between rounded-[30px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
              >
                <div>
                  <p className="text-lg font-semibold tracking-[-0.03em] text-white">{card.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/62">{card.copy}</p>
                </div>
                <div className="mt-6 h-px w-full bg-white/8" />
              </div>
            ))}
          </div>
        </section>

        <section className={`${sectionShell} bg-[linear-gradient(135deg,rgba(159,232,112,0.08),rgba(255,255,255,0.02))]`}>
          <SectionIntro
            kicker="Section 4"
            title="A three-step review loop that stays usable even on busy trading days."
            copy="The workflow is intentionally compressed so it can become habit instead of aspiration."
          />

          <div className="mt-10 grid flex-1 gap-4 lg:grid-cols-3">
            {workflow.map((item) => (
              <div key={item.step} className="flex min-h-[280px] flex-col justify-between rounded-[30px] border border-white/10 bg-black/50 p-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">{item.step}</p>
                  <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/64">{item.copy}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/34">Built for repetition, not ceremony</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${sectionShell} bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]`}>
          <SectionIntro
            kicker="Section 5"
            title="Gemini can read the account, not just the chat box."
            copy="Trade history, holdings, behavior tags, and concentration now feed the account review so the product can point out what stands out before it becomes expensive."
          />

          <div className="mt-10 grid flex-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/8 bg-black p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Trades", value: "Synced", sub: "Supabase-backed account context" },
                  { label: "Holdings", value: "Mapped", sub: "open positions and concentration" },
                  { label: "Co-Trader", value: "Sharper", sub: "points out issues and next action" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/42">{item.label}</p>
                    <p className="mt-3 font-display text-[28px] font-medium tracking-[-0.04em] text-white">{item.value}</p>
                    <p className="mt-2 text-xs leading-6 text-white/56">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[32px] border border-white/8 bg-white/[0.03] p-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Account Review</p>
                <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                  The AI now looks into the user account data and points out what needs attention.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/62">
                  That includes trades fetched from Supabase, current holdings, rule breaks, recurring mistakes, and whether one position is carrying too much weight.
                </p>
              </div>
              <div className="mt-8 rounded-[24px] border border-white/8 bg-black/40 p-4 text-sm leading-7 text-white/60">
                Output stays on analysis and process correction. It does not switch into trade signals.
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionShell} bg-black`}>
          <SectionIntro
            kicker="Section 6"
            title="A simple product story with enough proof to earn the next click."
            copy="The goal here is not fake enterprise theater. It is a direct explanation of why the product fits a trader who values structure."
          />

          <div className="mt-10 grid flex-1 gap-4 lg:grid-cols-3">
            {proofCards.map((card) => (
              <div key={card.title} className="flex min-h-[260px] flex-col justify-between rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
                <div>
                  <ShieldCheck className="h-5 w-5 text-[var(--brand)]" />
                  <p className="mt-4 text-lg font-semibold tracking-[-0.03em] text-white">{card.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/62">{card.copy}</p>
                </div>
                <div className="mt-6 h-px w-full bg-white/8" />
              </div>
            ))}
          </div>
        </section>

        <section className={`${sectionShell} bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(159,232,112,0.06))]`}>
          <div className="grid flex-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="flex h-full flex-col justify-between">
              <SectionIntro
                kicker="Section 7"
                title="Start with the demo, then move into a real trading workflow."
                copy="The page ends with direct next steps instead of decorative filler."
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/dashboard?mode=guest" className="btn-secondary">
                  Open Demo
                </Link>
                <Link to="/auth" className="btn-primary">
                  Create Account
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-[28px] border border-white/8 bg-black/45 p-5">
                  <p className="text-base font-semibold tracking-[-0.02em] text-white">{item.q}</p>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
