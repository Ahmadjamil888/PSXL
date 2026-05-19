import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";

type LogoCard = {
  src: string;
  alt: string;
  gradient: {
    from: string;
    to: string;
  };
};

const logos: LogoCard[] = [
  {
    src: "https://svgl.app/procure.svg",
    alt: "Procure",
    gradient: { from: "#60a5fa", to: "#2563eb" },
  },
  {
    src: "https://svgl.app/shopify.svg",
    alt: "Shopify",
    gradient: { from: "#facc15", to: "#f59e0b" },
  },
  {
    src: "https://svgl.app/blender.svg",
    alt: "Blender",
    gradient: { from: "#7dd3fc", to: "#2563eb" },
  },
  {
    src: "https://svgl.app/figma.svg",
    alt: "Figma",
    gradient: { from: "#c084fc", to: "#7c3aed" },
  },
  {
    src: "https://svgl.app/spotify.svg",
    alt: "Spotify",
    gradient: { from: "#fb7185", to: "#ef4444" },
  },
  {
    src: "https://svgl.app/lottielab.svg",
    alt: "Lottielab",
    gradient: { from: "#facc15", to: "#84cc16" },
  },
  {
    src: "https://svgl.app/google-cloud.svg",
    alt: "Google Cloud",
    gradient: { from: "#93c5fd", to: "#38bdf8" },
  },
  {
    src: "https://svgl.app/bing.svg",
    alt: "Bing",
    gradient: { from: "#67e8f9", to: "#14b8a6" },
  },
];

const marqueeItems = [...logos, ...logos];

function MarqueeScroller() {
  return (
    <div
      className="mt-10 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div className="marquee-track flex w-max items-center gap-4 py-2 hover:[animation-play-state:paused]">
        {marqueeItems.map((logo, index) => (
          <div
            key={`${logo.alt}-${index}`}
            className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-[1.5] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at top, ${logo.gradient.from}, ${logo.gradient.to})`,
              }}
            />
            <img
              src={logo.src}
              alt={logo.alt}
              className="relative z-10 h-8 w-auto transition-all duration-300 group-hover:brightness-0 group-hover:invert"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-[1440px] flex-col">
        <section className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            <video
              src={HERO_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            />
          </div>

          <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[620px]"
            >
              <h1 className="font-display text-[42px] font-medium leading-[0.98] tracking-[-0.04em] text-[#0a1b33] md:text-[56px]">
                Foundation of the
                <br />
                new digital epoch
              </h1>
              <p className="mt-6 max-w-[540px] font-sans text-[14px] leading-6 text-slate-500 md:text-[15px]">
                Designing products, powering ecosystems and laying the foundation
                of a decentralized web for enterprises, builders and communities
                alike.
              </p>
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/contact")}
                  className="rounded-full bg-[#0a152d] px-6 py-3 font-sans text-sm font-medium text-white shadow-[0_10px_30px_rgba(10,21,45,0.18)]"
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div
            className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <motion.nav
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white text-sm text-[#0a1b33] shadow-sm">
                ✦
              </div>
              <Link
                to="/features"
                className="px-4 py-2 text-[12px] font-semibold text-slate-500 transition-colors hover:text-[#0a1b33]"
              >
                Products
              </Link>
              <a
                href="/docs"
                className="px-4 py-2 text-[12px] font-semibold text-slate-500 transition-colors hover:text-[#0a1b33]"
              >
                Docs
              </a>
              <Link
                to="/contact"
                className="ml-1 flex items-center gap-1.5 bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all"
              >
                Get in touch
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </motion.nav>
          </div>
        </section>

        <MarqueeScroller />
      </div>
    </div>
  );
}
