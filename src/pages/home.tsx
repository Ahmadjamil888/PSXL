import { useState } from "react";
import {
  Aperture,
  ArrowRight,
  ArrowUpRight,
  Box,
  Brush,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Chrome,
  Framer,
  Figma,
  Layers,
  Palette,
  PenTool,
  ShieldCheck,
  Sparkle,
  Sparkles,
  TrendingUp,
  Type,
  Wand2,
} from "lucide-react";
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

const traderTimeline = [
  ["2026-Now", "AI Account Review", "Sharper post-market reads"],
  ["2025-2026", "Reality Dashboard", "Behavior-first portfolio pressure"],
  ["2024-2025", "Trade Journal Core", "Faster logging and cleaner recall"],
];

const studioToolsRowOne = [Figma, Framer, Palette, PenTool, Layers, Type, Aperture, Chrome];
const studioToolsRowTwo = [Camera, Brush, Box, Wand2, Figma, Framer, Type, Layers];

const supportFaqs = [
  {
    q: "What can I track inside PSXL?",
    a: "Trades, exits, notes, behavior tags, holdings, realized and unrealized P&L, plus the account patterns that usually get ignored until they become expensive.",
  },
  {
    q: "Is this built for PSX traders only?",
    a: "Yes. The wording, workflow, and review structure are shaped around traders operating in the Pakistan Stock Exchange context rather than a generic global broker UI.",
  },
  {
    q: "Can the AI read my actual account context?",
    a: "Yes. The co-trader can work from your trades, holdings, account snapshot, and behavioral patterns so the analysis stays grounded in what is actually happening.",
  },
  {
    q: "Do I need to use it every day?",
    a: "The system is built for repetition, but not ceremony. It is designed so a quick log and a short review still preserve the truth of the trade.",
  },
  {
    q: "Can I inspect the product before signing up?",
    a: "Yes. The guest dashboard mode lets you inspect the layout, analytics, and tone of the product before you create an account.",
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
      <span>{children}</span>
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

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

        <section className="px-4 sm:px-6 md:px-10 lg:px-14 py-6 sm:py-8 md:py-10 lg:min-h-[100dvh]">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_auto] lg:gap-10">
              <div className="max-w-3xl">
                <h2 className="text-[28px] font-normal leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px]">
                  Built for traders who want the rest of the landing page to feel as committed as the hero.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-[1.6] text-white/60 md:text-[15px]">
                  Below the opening section, PSXL now keeps the same cinematic surface language:
                  full-bleed cards, sharper hierarchy, moving texture, and a layout that feels closer
                  to a working desk than a generic finance brochure.
                </p>
              </div>
              <div className="liquid-glass inline-flex rounded-full px-5 py-2.5 sm:px-6 sm:py-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard?mode=guest")}
                  className="text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Explore The Product Flow
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-black">
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_150203_44a5bd32-516a-47ce-a077-8acbf9aa8991.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.82))]" />
                <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
                  <SectionLabel>Trading Background</SectionLabel>
                  <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-4">
                    {traderTimeline.map(([year, role, detail]) => (
                      <div key={year} className="contents">
                        <p className="text-[12px] font-medium text-white/72">{year}</p>
                        <div className="flex items-center justify-center">
                          <Sparkle className="h-3 w-3 text-white/60" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{role}</p>
                          <p className="mt-1 text-[12px] text-white/58">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-rows-[auto_1fr]">
                <div className="noise-overlay relative overflow-hidden rounded-2xl bg-[#324444] p-5 md:p-6">
                  <div className="relative z-10">
                    <div className="flex items-center justify-start gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
                      <span>Client Voice</span>
                      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
                    </div>
                    <p className="mt-6 text-[13px] leading-[1.6] text-white/85 sm:text-[13.5px]">
                      PSXL turns the messy aftertaste of trading into something readable. The layout
                      feels calm, the hard numbers are impossible to dodge, and the review loop
                      finally has enough structure to be useful.
                    </p>
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-white">Faraz Nadeem</p>
                      <p className="text-[12px] text-white/68">Active PSX trader and product tester</p>
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[250px] overflow-hidden rounded-2xl bg-black">
                  <video
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-42"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.7))]" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                    <p className="text-5xl font-light tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl lg:text-[88px]">
                      10K+
                    </p>
                    <p className="mt-4 text-sm text-white/85">Trades and review moments ready to be captured cleanly</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-black">
                  <video
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-34"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.76))]" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
                    <SectionLabel>Daily Software</SectionLabel>
                    <div className="space-y-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                      <div className="overflow-hidden">
                        <div className="flex w-max animate-marquee-left gap-3">
                          {[...studioToolsRowOne, ...studioToolsRowOne].map((Icon, index) => (
                            <div key={`row-one-${index}`} className="liquid-glass flex h-14 w-14 items-center justify-center rounded-xl md:h-16 md:w-16">
                              <Icon className="h-5 w-5 text-white/82 md:h-6 md:w-6" strokeWidth={1.5} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex w-max animate-marquee-right gap-3">
                          {[...studioToolsRowTwo, ...studioToolsRowTwo].map((Icon, index) => (
                            <div key={`row-two-${index}`} className="liquid-glass flex h-14 w-14 items-center justify-center rounded-xl md:h-16 md:w-16">
                              <Icon className="h-5 w-5 text-white/82 md:h-6 md:w-6" strokeWidth={1.5} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="noise-overlay relative overflow-hidden rounded-2xl bg-[#324444] p-5 md:p-6">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-start gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                          <Sparkle className="h-3 w-3" strokeWidth={1.5} />
                          <span>Reach PSXL</span>
                        </div>
                        <p className="mt-6 text-lg font-medium text-white">ahmadjamildhami@gmail.com</p>
                        <p className="mt-2 text-sm text-white/78">+92 333 8107788</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate("/contact")}
                        className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-200 hover:-translate-y-0.5"
                        aria-label="Open contact page"
                      >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

        <section className="py-20 max-[900px]:py-[60px]">
          <main className="mx-auto grid w-full max-w-[1100px] grid-cols-[1.6fr_1fr] items-stretch gap-[30px] px-5 max-[900px]:grid-cols-1 max-[900px]:gap-[60px]">
            <div
              className="c5-animated-gradient flex flex-col items-center justify-center rounded-[24px] px-10 py-20 text-center text-white"
              style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)" }}
            >
              <h2
                className="mb-[15px] font-normal leading-[1.1]"
                style={{ fontSize: "3.5rem", letterSpacing: "-0.03em" }}
              >
                Ready to Review
                <br />
                Without Excuses?
              </h2>
              <p className="mb-[30px] text-[0.9rem] font-normal opacity-85">
                Bring every trade, habit, and weak spot into one cleaner workflow.
              </p>
              <button
                type="button"
                className="border-none bg-neutral-900 text-[0.95rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
                }}
                onClick={() => navigate("/auth")}
              >
                Get Started Today
              </button>
            </div>

            <div className="flex flex-col justify-center gap-3">
              {supportFaqs.map((item, index) => {
                const active = activeIndex === index;
                return (
                  <div
                    key={item.q}
                    className="cursor-pointer rounded-[10px] border bg-white px-5 py-[18px] text-neutral-900 transition-all duration-200"
                    style={{
                      borderColor: active ? "#eaeaea" : "#f0f0f0",
                      boxShadow: active
                        ? "0 4px 12px rgba(0,0,0,0.04)"
                        : "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                    onClick={() => setActiveIndex(active ? null : index)}
                    onMouseEnter={(event) => {
                      if (!active) {
                        event.currentTarget.style.borderColor = "#eaeaea";
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (!active) {
                        event.currentTarget.style.borderColor = "#f0f0f0";
                      }
                    }}
                  >
                    <div className="flex items-center justify-between text-[0.9rem] font-normal text-neutral-900">
                      <span>{item.q}</span>
                      {active ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    {active && (
                      <div className="mt-3 text-[0.9rem] leading-[1.6] text-[#666]">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
