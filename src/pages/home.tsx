import { useState, useEffect, useRef, useCallback } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

const ff = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// ─── STYLE CONSTANTS ─────────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: ff,
  fontSize: "clamp(10px, 2vw, 11px)",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#000",
  background: "var(--lgrn)",
  border: "none",
  padding: "clamp(12px, 2vw, 14px) clamp(20px, 4vw, 28px)",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  borderRadius: "2px",
  transition: "all 0.2s ease",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: ff,
  fontSize: "clamp(10px, 2vw, 11px)",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ltx)",
  background: "transparent",
  border: "1px solid var(--lbdr2)",
  padding: "clamp(12px, 2vw, 14px) clamp(20px, 4vw, 28px)",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  borderRadius: "2px",
  transition: "all 0.2s ease",
};

const sectionBase = (bg: string): React.CSSProperties => ({
  background: bg,
  padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)",
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  margin: 0,
});

interface Stock       { sym: string; val: string; chg: string; pct: string; pos: boolean; }
interface Trade       { date: string; sym: string; sector: string; type: "BUY" | "SELL"; qty: number; rate: number; value: number; charges: number; pl: number | null; }
interface Feature     { num: string; title: string; body: string; tag: string; icon: React.ReactNode; }
interface Step        { num: string; title: string; body: string; lineH: number; }
interface Plan        { name: string; price: string; priceNote: string; desc: string; features: string[]; inactive: string[]; badge?: string; featured?: boolean; cta: string; }
interface Testimonial { quote: string; name: string; role: string; }
interface SecItem     { title: string; body: string; icon: React.ReactNode; }
interface FaqItem     { q: string; a: string; }

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconCalendar = () => (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:32,height:32}}><rect x="4" y="6" width="24" height="20" rx="1"/><line x1="4" y1="11" x2="28" y2="11"/><line x1="10" y1="6" x2="10" y2="11"/><line x1="22" y1="6" x2="22" y2="11"/><line x1="10" y1="17" x2="22" y2="17"/><line x1="10" y1="21" x2="18" y2="21"/></svg>);
const IconChart    = () => (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:32,height:32}}><polyline points="4,24 10,16 16,20 22,10 28,6"/><line x1="4" y1="28" x2="28" y2="28"/></svg>);
const IconHex      = () => (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:32,height:32}}><path d="M16 4 L28 12 L28 24 L16 28 L4 24 L4 12 Z"/><circle cx="16" cy="16" r="4"/></svg>);
const IconBar      = () => (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:32,height:32}}><rect x="6" y="14" width="5" height="12"/><rect x="13" y="10" width="5" height="16"/><rect x="20" y="6" width="5" height="20"/><line x1="4" y1="28" x2="28" y2="28"/></svg>);
const IconTax      = () => (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:32,height:32}}><path d="M8 26 L8 12 M14 26 L14 18 M20 26 L20 8 M26 26 L26 14"/><path d="M4 8 Q10 4 16 10 Q22 16 28 6"/></svg>);
const IconExport   = () => (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:32,height:32}}><path d="M6 26 L6 6 L26 6"/><rect x="10" y="16" width="4" height="10"/><rect x="17" y="11" width="4" height="15"/><line x1="6" y1="13" x2="26" y2="13"/></svg>);
const IconShield   = () => (<svg style={{width:18,height:18}} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2 L15 5 L15 10 C15 13.3 12.3 16 9 17 C5.7 16 3 13.3 3 10 L3 5 Z"/></svg>);
const IconClock    = () => (<svg style={{width:18,height:18}} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><polyline points="9,5 9,9 12,11"/></svg>);
const IconLock     = () => (<svg style={{width:18,height:18}} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="12" height="8" rx="1"/><path d="M6 8 L6 5 C6 3.3 7.3 2 9 2 C10.7 2 12 3.3 12 5 L12 8"/></svg>);
const IconInfoSec  = () => (<svg style={{width:18,height:18}} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><line x1="9" y1="6" x2="9" y2="9"/><line x1="9" y1="12" x2="9" y2="12.5" strokeWidth="2"/></svg>);

const LogoMark = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:size*0.5,height:size}}>
    <path d="M10 2 C10 2, 8 8, 7 14 C6 20, 7.5 24, 11 26" stroke="#a3c45a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const STOCKS: Stock[] = [
  {sym:"OGDC",val:"187.40",chg:"+2.30",pct:"+1.24%",pos:true},
  {sym:"HBL", val:"221.15",chg:"-3.20",pct:"-1.43%",pos:false},
  {sym:"PSO", val:"312.80",chg:"+5.60",pct:"+1.82%",pos:true},
  {sym:"LUCK",val:"924.50",chg:"+12.70",pct:"+1.39%",pos:true},
  {sym:"SYS", val:"582.30",chg:"+8.90",pct:"+1.55%",pos:true},
  {sym:"MCB", val:"344.20",chg:"-1.80",pct:"-0.52%",pos:false},
  {sym:"ENGRO",val:"326.40",chg:"+4.10",pct:"+1.27%",pos:true},
  {sym:"PPL", val:"142.60",chg:"-2.40",pct:"-1.66%",pos:false},
  {sym:"FFBL",val:"56.80", chg:"+0.90",pct:"+1.61%",pos:true},
  {sym:"EFERT",val:"128.30",chg:"+2.10",pct:"+1.66%",pos:true},
  {sym:"UBL", val:"278.90",chg:"-4.20",pct:"-1.48%",pos:false},
  {sym:"MARI",val:"2340.50",chg:"+34.70",pct:"+1.50%",pos:true},
  {sym:"HUBC",val:"118.70",chg:"+1.40",pct:"+1.19%",pos:true},
  {sym:"FCCL",val:"38.20", chg:"-0.60",pct:"-1.55%",pos:false},
  {sym:"BAHL",val:"103.40",chg:"+2.80",pct:"+2.78%",pos:true},
];

const TRADES: Trade[] = [
  {date:"24 Mar 26",sym:"LUCK", sector:"Cement", type:"BUY", qty:200,rate:912.00,value:182400,charges:1640,pl:null},
  {date:"21 Mar 26",sym:"SYS",  sector:"Tech",   type:"SELL",qty:100,rate:578.40,value:57840, charges:521, pl:5240},
  {date:"19 Mar 26",sym:"OGDC", sector:"E&P",    type:"BUY", qty:500,rate:183.20,value:91600, charges:824, pl:null},
  {date:"17 Mar 26",sym:"HBL",  sector:"Banking",type:"SELL",qty:150,rate:228.50,value:34275, charges:308, pl:-1820},
  {date:"14 Mar 26",sym:"ENGRO",sector:"Fert.",  type:"BUY", qty:75, rate:320.10,value:24008, charges:216, pl:null},
  {date:"12 Mar 26",sym:"PSO",  sector:"OMC",    type:"SELL",qty:200,rate:308.40,value:61680, charges:555, pl:7200},
  {date:"10 Mar 26",sym:"MCB",  sector:"Banking",type:"BUY", qty:300,rate:341.80,value:102540,charges:923, pl:null},
  {date:"07 Mar 26",sym:"MARI", sector:"E&P",    type:"SELL",qty:10, rate:2310.00,value:23100,charges:208, pl:3400},
  {date:"05 Mar 26",sym:"HUBC", sector:"Power",  type:"BUY", qty:500,rate:116.50,value:58250, charges:524, pl:null},
  {date:"03 Mar 26",sym:"FCCL", sector:"Cement", type:"SELL",qty:800,rate:39.10, value:31280, charges:281, pl:-1120},
  {date:"28 Feb 26",sym:"UBL",  sector:"Banking",type:"BUY", qty:200,rate:272.30,value:54460, charges:490, pl:null},
  {date:"25 Feb 26",sym:"SYS",  sector:"Tech",   type:"BUY", qty:100,rate:526.40,value:52640, charges:474, pl:null},
  {date:"22 Feb 26",sym:"PPL",  sector:"E&P",    type:"SELL",qty:400,rate:148.20,value:59280, charges:534, pl:4860},
  {date:"20 Feb 26",sym:"EFERT",sector:"Fert.",  type:"BUY", qty:300,rate:124.80,value:37440, charges:337, pl:null},
  {date:"17 Feb 26",sym:"BAHL", sector:"Banking",type:"SELL",qty:250,rate:101.20,value:25300, charges:228, pl:1750},
];

const MONTHS   = ["J","F","M","A","M","J","J","A","S","O","N","D"];
const BAR_VALS = [8.2,-2.1,14.3,6.7,11.2,-4.8,9.1,7.4,21.3,5.9,-1.2,13.6];

const FEATURES: Feature[] = [
  {num:"01",title:"Trade Entry & History",     body:"Log buy and sell transactions with full metadata — quantity, rate, brokerage, CDC charges, Zakat, and settlement date. Nothing is left unaccounted.",tag:"T+2 Settlement",icon:<IconCalendar/>},
  {num:"02",title:"Real-Time P&L Tracking",    body:"See your realised and unrealised gain or loss per position and at portfolio level, updated with each entry. Weighted average cost computed automatically.",tag:"FIFO / WAC",icon:<IconChart/>},
  {num:"03",title:"Sector & Scrip Breakdown",  body:"View exposure by KSE sector — Cement, Banking, E&P, Tech, and more. Instantly understand concentration risk across your holdings.",tag:"KSE-100 Mapped",icon:<IconHex/>},
  {num:"04",title:"Dividend Tracker",          body:"Record cash and bonus dividends, right issues, and stock splits. Adjust cost basis automatically and track dividend yield per holding.",tag:"Corporate Actions",icon:<IconBar/>},
  {num:"05",title:"Tax Computation",           body:"Capital gains tax, withholding tax on dividends, and Zakat deductions — all calculated per FBR rules. Export a ready report for your tax consultant.",tag:"FBR Compliant",icon:<IconTax/>},
  {num:"06",title:"Export & Reports",          body:"Generate portfolio statements, gain/loss summaries, and broker reconciliation sheets. Export to Excel or PDF in one click.",tag:"Excel · PDF",icon:<IconExport/>},
];

const STEPS: Step[] = [
  {num:"01",title:"Create Your Account",  body:"Sign up with your email. No broker API keys required. Your data is yours and stays private on your ledger.",lineH:40},
  {num:"02",title:"Import Past Trades",   body:"Upload a CSV from your broker or paste entries manually. PSXL maps fields automatically for all major PSX brokers.",lineH:60},
  {num:"03",title:"Log New Entries",      body:"After each trade, enter it in seconds. PSXL computes all charges, updates P&L, and reflects the new portfolio state instantly.",lineH:50},
  {num:"04",title:"Review & Export",      body:"Generate monthly or annual reports. Share with your accountant or archive for your own records. PDF and Excel formats supported.",lineH:80},
];

const PLANS: Plan[] = [
  {name:"Starter",price:"Free",priceNote:"",desc:"For investors just getting organised.",features:["Up to 100 trade entries","Basic P&L report","3 symbols tracked","CSV export"],inactive:["Dividend tracker","Tax report","Broker reconciliation"],cta:"Start Free"},
  {name:"Pro",price:"₨1,499",priceNote:"/ month",desc:"For active traders who need the full picture.",features:["Unlimited trade entries","Full P&L & analytics dashboard","Unlimited symbols","CSV & Excel export","Dividend & corporate actions","FBR tax computation","Broker reconciliation"],inactive:[],badge:"Most Popular",featured:true,cta:"Get Pro"},
  {name:"Firm",price:"₨5,999",priceNote:"/ month",desc:"For advisory firms and family offices.",features:["Everything in Pro","Multi-account management","Client-level reporting","PDF branded statements","Priority support","Audit trail & permissions","Custom data export"],inactive:[],cta:"Contact Sales"},
];

const TESTIMONIALS: Testimonial[] = [
  {quote:"I used to maintain everything in a messy spreadsheet. PSXL replaced it entirely. The tax report alone saves me hours every year when filing with FBR.",name:"Farrukh Malik",role:"Retail Investor — Lahore"},
  {quote:"The ledger is exactly how a professional desk would want it. Clean rows, correct charges, automatic WAC. Nothing like this existed for PSX before.",name:"Sana Qureshi",role:"Portfolio Manager — Karachi"},
  {quote:"We use the Firm plan for our advisory clients. The multi-account view and branded PDF reports have genuinely improved how we present to investors.",name:"Ahmed Raza",role:"Director — Raza Capital Islamabad"},
];

const SEC_ITEMS: SecItem[] = [
  {title:"End-to-End Encryption",body:"All ledger data encrypted at rest with AES-256 and in transit with TLS 1.3.",icon:<IconShield/>},
  {title:"Immutable Audit Trail", body:"Every change is timestamped and logged. Your historical record can never be silently altered.",icon:<IconClock/>},
  {title:"No Broker Access",      body:"PSXL is a manual ledger. It never connects to your brokerage account or places orders on your behalf.",icon:<IconLock/>},
  {title:"Zero Data Selling",     body:"Your portfolio data is never shared with third parties, advertisers, or financial institutions.",icon:<IconInfoSec/>},
];

const SEC_STATUS = [
  {key:"Encryption",    val:"AES-256-GCM ✓",        danger:false},
  {key:"Transport",     val:"TLS 1.3 ✓",             danger:false},
  {key:"Auth",          val:"MFA Enabled ✓",          danger:false},
  {key:"Backup",        val:"Daily · 30d Retention",  danger:false},
  {key:"Uptime (30d)",  val:"99.97%",                 danger:false},
  {key:"Data Residency",val:"Pakistan · ISO 27001",   danger:false},
  {key:"Broker Access", val:"None · Read-only",        danger:true},
  {key:"Last Audit",    val:"Feb 2026",                danger:false},
];

const FAQS: FaqItem[] = [
  {q:"Is PSXL connected to my broker?",a:"No. PSXL is a completely manual ledger. You enter trades yourself. It never connects to your brokerage account, cannot place orders, and has no access to your broker login credentials."},
  {q:"Which brokers are supported for CSV import?",a:"PSXL supports direct CSV import from AKD Securities, JS Global, Topline Securities, Arif Habib, and most other PSX brokers. For unsupported formats, you can use the standard PSXL CSV template."},
  {q:"How is weighted average cost calculated?",a:"PSXL uses the Weighted Average Cost (WAC) method as the default, which is the standard adopted for PSX equities. FIFO is also available in Pro and Firm plans for comparison purposes."},
  {q:"Is the tax calculation legally accurate?",a:"PSXL computes capital gains tax and withholding tax based on FBR rates as currently published. Always confirm figures with a qualified tax consultant before filing. PSXL is a ledger tool, not a tax advisory service."},
  {q:"Can I use PSXL for multiple portfolios?",a:"Multi-portfolio and multi-account support is available on the Firm plan. Pro plan users have a single ledger per account. You can export and maintain separate files if needed on lower plans."},
  {q:"Is my data backed up?",a:"Yes. All data is automatically backed up daily with 30 days of retention. You can also manually export your entire ledger to Excel or CSV at any time from the dashboard."},
  {q:"What happens if I cancel my plan?",a:"You retain access until the end of your billing period. After that, your account moves to Starter limits. Your data is never deleted — you can export everything before or after downgrading."},
];

// ─── SCOPED CSS ───────────────────────────────────────────────────────────────
const SCOPED_CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  @import url('https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@100;300;400;500;700;900&display=swap');

  @keyframes psxl-fadeUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes psxl-fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes psxl-ticker {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }

  .psxl-root {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden;
    scroll-behavior: smooth;
    line-height: 1;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .psxl-root[data-theme="dark"] {
    --lbg:  #181818; --lbg2: #1a1a1a; --lbg3: #242424;
    --lsrf: #242424; --lbdr: rgba(255,255,255,0.06); --lbdr2:rgba(255,255,255,0.12);
    --ltx:  #ffffff; --ltx2: #888888; --ltx3: #555555;
    --lgrn: #a3c45a; --lgrnD:#8db84a; --lred: #ef4444;
    color-scheme: dark;
  }

  .psxl-root[data-theme="light"] {
    --lbg:  #f8f9fa; --lbg2: #f1f3f4; --lbg3: #e8eaed;
    --lsrf: #ffffff; --lbdr: rgba(0,0,0,0.08); --lbdr2:rgba(0,0,0,0.16);
    --ltx:  #1a1a1a; --ltx2: #666666; --ltx3: #999999;
    --lgrn: #a3c45a; --lgrnD:#8db84a; --lred: #dc2626;
    color-scheme: light;
  }

  .psxl-root ::-webkit-scrollbar       { width: 2px; }
  .psxl-root ::-webkit-scrollbar-track { background: var(--lbg); }
  .psxl-root ::-webkit-scrollbar-thumb { background: var(--lgrn); }

  main {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .psxl-nav          { animation: psxl-fadeIn 0.6s ease both; }
  .psxl-hero-eyebrow { animation: psxl-fadeUp 0.6s 0.2s ease both; }
  .psxl-hero-h1      { animation: psxl-fadeUp 0.6s 0.3s ease both; }
  .psxl-hero-desc    { animation: psxl-fadeUp 0.6s 0.4s ease both; }
  .psxl-hero-actions { animation: psxl-fadeUp 0.6s 0.5s ease both; }
  .psxl-hero-right   { animation: psxl-fadeIn 0.8s 0.4s ease both; }

  .psxl-ticker-track { animation: psxl-ticker 60s linear infinite; }

  .psxl-reveal         { opacity:0; transform:translateY(24px); transition: opacity .7s ease, transform .7s ease; }
  .psxl-reveal.visible { opacity:1; transform:translateY(0); }

  /* ─── RESPONSIVE ─── */

  @media (max-width: 1200px) {
    .psxl-grid-2 { grid-template-columns: 1fr !important; }
    .psxl-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
    .psxl-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
  }

  @media (max-width: 768px) {
    .psxl-grid-3,
    .psxl-grid-4 {
      grid-template-columns: 1fr !important;
    }

    .psxl-nav-links {
      display: none !important;
    }

    .psxl-nav-cta {
      display: none !important;
    }

    .psxl-mobile-menu {
      display: flex !important;
    }

    .psxl-hero {
      grid-template-columns: 1fr !important;
      height: auto !important;
      min-height: auto !important;
    }

    .psxl-hero-left {
      padding: clamp(20px, 5vw, 40px) !important;
      border-right: none !important;
      border-bottom: 1px solid var(--lbdr) !important;
      order: 1 !important;
    }

    .psxl-hero-right {
      order: 2 !important;
      padding: 0 !important;
    }

    .psxl-hero-right > div {
      padding: clamp(16px, 4vw, 28px) !important;
    }

    .psxl-table {
      font-size: 9px !important;
    }
    
    .psxl-table th,
    .psxl-table td {
      padding: 8px 8px !important;
    }

    .psxl-hero-actions {
      flex-direction: column !important;
      gap: 12px !important;
      width: 100% !important;
    }
    
    .psxl-hero-actions a,
    .psxl-hero-actions button {
      width: 100% !important;
      padding: 14px 16px !important;
      text-align: center !important;
    }

    .psxl-two-col {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }

    .psxl-footer-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }

    .psxl-footer-cols {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 24px !important;
    }

    .psxl-footer-bottom {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 16px !important;
    }

    .psxl-faq-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }

    .psxl-ledger-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
  }

  @media (max-width: 480px) {
    .psxl-section {
      padding: clamp(30px, 6vw, 60px) clamp(12px, 3vw, 20px) !important;
    }

    .psxl-footer-cols {
      grid-template-columns: 1fr !important;
    }

    .psxl-cta-form {
      flex-direction: column !important;
    }

    .psxl-cta-input {
      width: 100% !important;
    }

    .psxl-cta-button {
      width: 100% !important;
    }
  }
`;

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────
function Reveal({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.unobserve(el);
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ ...style, transitionDelay: `${delay}ms` }} className={visible ? "psxl-reveal visible" : "psxl-reveal"}>
      {children}
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: "clamp(9px, 2vw, 10px)", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--lgrn)" }}>{children}</span>
);

const Divider = () => <div style={{ height: 1, background: "var(--lbdr)", margin: "clamp(16px, 3vw, 24px) 0" }} />;

const SectionH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: "clamp(28px, 6vw, 56px)", fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: "var(--ltx)" }}>{children}</h2>
);

const SectionDesc = ({ children, maxWidth = 480 }: { children: React.ReactNode; maxWidth?: number }) => (
  <p style={{ fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 300, lineHeight: 1.7, color: "var(--ltx2)", maxWidth, marginTop: "clamp(12px, 2vw, 24px)" }}>{children}</p>
);

// ─── TICKER ──────────────────────────────────────────────────────────────────
function Ticker() {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "clamp(24px, 5vw, 32px)", background: "var(--lbg)", borderTop: "1px solid var(--lbdr)", display: "flex", alignItems: "center", overflow: "hidden", zIndex: 50 }}>
      <div className="psxl-ticker-track" style={{ display: "flex", gap: "clamp(20px, 4vw, 40px)", whiteSpace: "nowrap" }}>
        {[...STOCKS, ...STOCKS].map((s, i) => (
          <span key={i} style={{ fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 500, color: s.pos ? "var(--lgrn)" : "var(--lred)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--ltx)", fontWeight: 600 }}>{s.sym}</span>
            <span>{s.val}</span>
            <span>{s.chg} ({s.pct})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="psxl-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "clamp(50px, 8vw, 56px)", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 clamp(12px, 3vw, 20px)",
      borderBottom: "1px solid var(--lbdr)", background: "var(--lbg)"
    }}>
      
      {/* Logo */}
      <a href="#psxl-top" style={{ display: "flex", alignItems: "center", fontWeight: 700, color: "var(--ltx)", textDecoration: "none", fontSize: "clamp(14px, 3vw, 18px)", letterSpacing: -0.5 }}>
        PSXL<LogoMark size={28} />
      </a>

      {/* Desktop Links */}
      <ul className="psxl-nav-links" style={{ display: "flex", gap: "clamp(16px, 3vw, 24px)", listStyle: "none" }}>
        {["Features", "FAQ"].map((label) => (
          <li key={label}>
            <a href={`#psxl-${label.toLowerCase()}`} style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "var(--ltx2)", textDecoration: "none", fontWeight: 400, letterSpacing: "0.05em" }}>
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)" }}>
        
        {/* Theme toggle */}
        <div onClick={onToggle} style={{
          width: 44, height: 24, background: "var(--lbg3)", border: "1px solid var(--lbdr2)",
          borderRadius: 12, cursor: "pointer", position: "relative", display: "flex", alignItems: "center", padding: "0 4px"
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%", background: "var(--lgrn)",
            transform: theme === "dark" ? "translateX(0)" : "translateX(20px)",
            transition: "transform 0.2s ease"
          }}/>
        </div>

        {/* Get Started Button - Desktop */}
        <a href="/auth" style={{...btnPrimary, padding: "clamp(10px, 1.5vw, 14px) clamp(16px, 2vw, 24px)", fontSize: "clamp(9px, 1.5vw, 11px)"}} className="psxl-nav-cta">
          Get Started
        </a>

        {/* Hamburger */}
        <div
          className="psxl-mobile-menu"
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: 4,
            cursor: "pointer"
          }}
        >
          <span style={{ width: 20, height: 2, background: "var(--ltx)" }} />
          <span style={{ width: 20, height: 2, background: "var(--ltx)" }} />
          <span style={{ width: 20, height: 2, background: "var(--ltx)" }} />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "var(--lbg)",
          borderBottom: "1px solid var(--lbdr)",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(12px, 3vw, 20px)",
          gap: 16,
          zIndex: 50
        }}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {["Features", "FAQ"].map((label) => (
              <a key={label} href={`#psxl-${label.toLowerCase()}`} style={{ color: "var(--ltx)", textDecoration: "none", fontSize: "clamp(12px, 2vw, 14px)", padding: "8px 0" }}>
                {label}
              </a>
            ))}
            <a href="/auth" style={{...btnPrimary, padding: "clamp(11px, 2vw, 12px) 20px", fontSize: "clamp(10px, 1.5vw, 12px)", marginTop: 8, width: "100%", textAlign: "center"}}>
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const stats = [
    {label:"Portfolio Value",     val:"₨ 4,82,350", sub:"Updated at market close · 24 Mar 2026",cls:""},
    {label:"Realised P&L (YTD)", val:"+₨ 61,820",  sub:"+14.67% return on invested capital",  cls:"pos"},
    {label:"Unrealised Gain",    val:"+₨ 18,440",  sub:"Across 11 open positions",             cls:"pos"},
    {label:"Transactions Logged",val:"348",         sub:"Since Jan 2024 — zero missing entries",cls:""},
  ];
  return (
    <section id="psxl-top" style={{minHeight:"100vh",background:"var(--lbg)",paddingTop:"clamp(50px, 8vw, 56px)",display:"flex",flexDirection:"column",justifyContent:"center",width:"100%"}}>
      <div className="psxl-hero" style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"calc(100vh - clamp(50px, 8vw, 56px))",height:"auto"}}>
        <div className="psxl-hero-left" style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"clamp(30px, 5vw, 60px)"}}>
          <p className="psxl-hero-eyebrow" style={{fontSize:"clamp(9px, 1.5vw, 10px)",fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--lgrn)",marginBottom:"clamp(16px, 3vw, 24px)"}}>Pakistan Stock Exchange Ledger</p>
          <h1 className="psxl-hero-h1" style={{fontSize:"clamp(36px, 8vw, 88px)",fontWeight:700,letterSpacing:-3,lineHeight:0.95,color:"var(--ltx)",marginBottom:"clamp(20px, 3vw, 32px)"}}>
            Track every<br/>trade with<br/><em style={{fontStyle:"normal",color:"var(--lgrn)"}}>precision.</em>
          </h1>
          <p className="psxl-hero-desc" style={{fontSize:"clamp(13px, 2vw, 15px)",fontWeight:300,lineHeight:1.7,color:"var(--ltx2)",maxWidth:420,marginBottom:"clamp(30px, 5vw, 48px)"}}>
            PSXL is the institutional-grade trading ledger built exclusively for PSX investors. Record, analyse, and report your equity positions with the clarity of a professional desk.
          </p>
          <div className="psxl-hero-actions" style={{display:"flex",gap:"clamp(8px, 2vw, 16px)",flexWrap:"wrap",alignItems:"center"}}>
            <a href="/auth" style={btnPrimary}>Get Started</a>
            <a href="#psxl-ledger" style={btnGhost}>View Demo</a>
          </div>
        </div>
        <div className="psxl-hero-right" style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:1,background:"var(--lbdr)",minHeight:"auto"}}>
          {stats.map((s,i)=>(
            <div key={i} style={{background:"var(--lbg)",padding:"clamp(16px, 2.5vw, 28px) clamp(16px, 2.5vw, 32px)",display:"flex",flexDirection:"column",gap:6,borderBottom:i<stats.length-1?"1px solid var(--lbdr)":"none"}}>
              <span style={{fontSize:"clamp(9px, 1.5vw, 10px)",fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--ltx3)"}}>{s.label}</span>
              <span style={{fontSize:"clamp(24px, 4vw, 36px)",fontWeight:700,letterSpacing:-1,color:s.cls==="pos"?"var(--lgrn)":"var(--ltx)"}}>{s.val}</span>
              <span style={{fontSize:"clamp(10px, 1.5vw, 11px)",color:"var(--ltx3)",fontWeight:300}}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
function FeatureCard({f}: {f:Feature}) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?"var(--lbg3)":"var(--lbg2)",padding:"clamp(24px, 4vw, 40px) clamp(20px, 3vw, 36px)",display:"flex",flexDirection:"column",gap:16,transition:"background .2s",height:"100%"}}>
      <span style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:500,letterSpacing:"0.15em",color:"var(--ltx3)"}}>{f.num}</span>
      <div style={{color:"var(--lgrn)"}}>{f.icon}</div>
      <h3 style={{fontSize:"clamp(16px, 2.5vw, 18px)",fontWeight:600,letterSpacing:-0.5,color:"var(--ltx)",lineHeight:1.2}}>{f.title}</h3>
      <p style={{fontSize:"clamp(12px, 1.8vw, 13px)",fontWeight:300,lineHeight:1.7,color:"var(--ltx2)"}}>{f.body}</p>
      <span style={{display:"inline-block",fontSize:"clamp(9px, 1.5vw, 10px)",letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--lgrn)",border:"1px solid var(--lgrnD)",padding:"3px 10px",marginTop:"auto",width:"fit-content"}}>{f.tag}</span>
    </div>
  );
}

function Features() {
  return (
    <section id="psxl-features" style={{...sectionBase("var(--lbg2)")}}>
      <Reveal style={{maxWidth:600,marginBottom:"clamp(40px, 8vw, 80px)"}}>
        <SectionLabel>Core Capabilities</SectionLabel><Divider/>
        <SectionH2>Every tool a PSX trader needs.</SectionH2>
        <SectionDesc>Built ground-up for the Pakistan Stock Exchange settlement cycle, tax regime, and broker ecosystem. No generic solutions.</SectionDesc>
      </Reveal>
      <div className="psxl-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"var(--lbdr)",width:"100%"}}>
        {FEATURES.map((f,i)=><Reveal key={i} delay={i*60}><FeatureCard f={f}/></Reveal>)}
      </div>
    </section>
  );
}

// ─── LEDGER DEMO ─────────────────────────────────────────────────────────────
function TradeRow({t}: {t:Trade}) {
  const [hov,setHov]=useState(false);
  const td=(content:React.ReactNode, extra?:React.CSSProperties)=>(
    <td style={{padding:"clamp(8px, 1.5vw, 12px) clamp(8px, 1.5vw, 14px)",fontWeight:300,...extra}}>{content}</td>
  );
  return (
    <tr onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderBottom:"1px solid var(--lbdr)",background:hov?"var(--lbg3)":"transparent",transition:"background .15s"}}>
      {td(t.date,{fontSize:"clamp(9px, 1.5vw, 11px)",color:"var(--ltx3)"})}
      {td(t.sym,{fontWeight:600,fontSize:"clamp(11px, 1.8vw, 13px)"})}
      {td(t.sector,{fontSize:"clamp(9px, 1.5vw, 11px)",color:"var(--ltx3)"})}
      {td(t.type,{color:t.type==="BUY"?"var(--lgrn)":"var(--lred)",fontWeight:500,fontSize:"clamp(9px, 1.5vw, 11px)"})}
      {td(t.qty.toLocaleString(),{fontSize:"clamp(10px, 1.5vw, 12px)"})}
      {td(`₨${t.rate.toFixed(2)}`,{fontSize:"clamp(10px, 1.5vw, 12px)"})}
      {td(`₨${t.value.toLocaleString()}`,{fontSize:"clamp(10px, 1.5vw, 12px)"})}
      {td(`₨${t.charges.toLocaleString()}`,{color:"var(--ltx3)",fontSize:"clamp(9px, 1.5vw, 11px)"})}
      {td(t.pl===null?"—":`${t.pl>=0?"+":""}₨${Math.abs(t.pl).toLocaleString()}`,
        {color:t.pl===null?"var(--ltx3)":t.pl>=0?"var(--lgrn)":"var(--lred)",fontSize:"clamp(9px, 1.5vw, 11px)"})}
    </tr>
  );
}

function LedgerDemo() {
  return (
    <section id="psxl-ledger" style={{...sectionBase("var(--lbg)")}}>
      <div className="psxl-ledger-grid" style={{display:"grid",gridTemplateColumns:"clamp(280px, 35%, 380px) 1fr",gap:"clamp(30px, 5vw, 60px)",alignItems:"start",width:"100%"}}>
        <Reveal>
          <SectionLabel>The Ledger</SectionLabel><Divider/>
          <SectionH2>Clean entries.<br/>Zero ambiguity.</SectionH2>
          <SectionDesc maxWidth={380}>Every row tells the complete story of a trade. Built like a double-entry accounting ledger — the standard institutions rely on.</SectionDesc>
          <ul style={{listStyle:"none",display:"flex",flexDirection:"column",marginTop:"clamp(24px, 4vw, 40px)",borderTop:"1px solid var(--lbdr)"}}>
            {["Automatic brokerage & levy calculation","Weighted average cost per symbol","Running portfolio balance after each trade","Broker statement reconciliation","Date-wise gain/loss summary","Unrealised position marking to market"].map((item,i)=>(
              <li key={i} style={{padding:"clamp(12px, 2vw, 16px) 0",borderBottom:"1px solid var(--lbdr)",fontSize:"clamp(12px, 1.8vw, 13px)",fontWeight:300,color:"var(--ltx2)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"var(--lgrn)",flexShrink:0,display:"inline-block"}}/>{item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <div style={{background:"var(--lsrf)",border:"1px solid var(--lbdr)",overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:"clamp(400px, 60vh, 620px)",width:"100%"}}>
            <div style={{padding:"clamp(12px, 2vw, 16px) clamp(16px, 2vw, 24px)",borderBottom:"1px solid var(--lbdr)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--lbg3)"}}>
              <span style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ltx2)"}}>Trade Ledger — Q1 2026</span>
              <span style={{fontSize:"clamp(9px, 1.5vw, 10px)",padding:"3px 10px",background:"var(--lgrn)",color:"#000",fontWeight:600,letterSpacing:"0.08em"}}>Live</span>
            </div>
            <div style={{overflowY:"auto",flex:1}}>
              <table className="psxl-table" style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>{["Date","Symbol","Sector","Type","Qty","Rate","Value","Charges","P&L"].map(h=>(
                    <th key={h} style={{padding:"clamp(8px, 1.5vw, 10px) clamp(8px, 1.5vw, 14px)",textAlign:"left",fontSize:"clamp(8px, 1.2vw, 10px)",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ltx3)",borderBottom:"1px solid var(--lbdr)",background:"var(--lbg3)",position:"sticky",top:0}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>{TRADES.map((t,i)=><TradeRow key={i} t={t}/>)}</tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, AreaChart, Area, PieChart, Pie } from 'recharts';

const monthlyData = [
  { month: 'Jan', value: 8.2, label: '+8.2%' },
  { month: 'Feb', value: -2.1, label: '-2.1%' },
  { month: 'Mar', value: 14.3, label: '+14.3%' },
  { month: 'Apr', value: 6.7, label: '+6.7%' },
  { month: 'May', value: 11.2, label: '+11.2%' },
  { month: 'Jun', value: -4.8, label: '-4.8%' },
  { month: 'Jul', value: 9.1, label: '+9.1%' },
  { month: 'Aug', value: 7.4, label: '+7.4%' },
  { month: 'Sep', value: 21.3, label: '+21.3%' },
  { month: 'Oct', value: 5.9, label: '+5.9%' },
  { month: 'Nov', value: -1.2, label: '-1.2%' },
  { month: 'Dec', value: 13.6, label: '+13.6%' },
];

const sectorData = [
  { name: 'Banking', value: 35, color: '#a3c45a' },
  { name: 'Cement', value: 25, color: '#8db84a' },
  { name: 'E&P', value: 20, color: '#6fa33a' },
  { name: 'Tech', value: 12, color: '#4a8a2a' },
  { name: 'Fertilizer', value: 8, color: '#2d6a1a' },
];

function Analytics() {
  const metrics = [
    { label: "Win Rate", val: "68.4%", cls: "pos" },
    { label: "Avg Hold", val: "18.2d", cls: "" },
    { label: "Max Drawdown", val: "−8.1%", cls: "neg" },
    { label: "Sharpe Ratio", val: "1.74", cls: "pos" },
    { label: "Best Month", val: "+21.3%", cls: "pos" },
    { label: "Profit Factor", val: "2.31", cls: "pos" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div style={{
          background: 'var(--lbg2)',
          border: '1px solid var(--lbdr)',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          color: 'var(--ltx)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <strong>{label}</strong>
          <div style={{ color: val >= 0 ? 'var(--lgrn)' : 'var(--lred)', fontWeight: 600 }}>
            {val > 0 ? '+' : ''}{val}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="psxl-analytics" style={{ ...sectionBase("var(--lbg2)") }}>
      <div className="psxl-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 8vw, 80px)", alignItems: "start", width: "100%" }}>
        <Reveal>
          <SectionLabel>Analytics</SectionLabel>
          <Divider />
          <SectionH2>Numbers that drive decisions.</SectionH2>
          <SectionDesc>Institutional reporting metrics presented cleanly. Understand your edge, your drawdowns, and your consistency over time.</SectionDesc>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--lbdr)", marginTop: "clamp(30px, 5vw, 48px)", width: "100%" }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ background: "var(--lsrf)", padding: "clamp(16px, 2.5vw, 20px) clamp(16px, 2.5vw, 24px)" }}>
                <div style={{ fontSize: "clamp(9px, 1.5vw, 10px)", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--ltx3)", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, letterSpacing: -0.5, color: m.cls === "pos" ? "var(--lgrn)" : m.cls === "neg" ? "var(--lred)" : "var(--ltx)" }}>{m.val}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div style={{ background: "var(--lsrf)", border: "1px solid var(--lbdr)", borderRadius: "4px", padding: "clamp(20px, 3vw, 32px)", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(20px, 3vw, 32px)" }}>
              <span style={{ fontSize: "clamp(12px, 2vw, 13px)", fontWeight: 500, color: "var(--ltx)" }}>Monthly P&L Performance</span>
              <span style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--ltx3)", letterSpacing: "0.1em" }}>2025</span>
            </div>
            <div style={{ height: "clamp(180px, 30vh, 220px)", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3c45a" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8db84a" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--ltx3)', fontSize: 10, fontWeight: 300 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--ltx3)', fontSize: 10, fontWeight: 300 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--lbg)', opacity: 0.5 }} />
                  <ReferenceLine y={0} stroke="var(--lbdr2)" strokeDasharray="3 3" />
                  <Bar dataKey="value" radius={[3, 3, 3, 3]} maxBarSize={32}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value >= 0 ? 'url(#gainGradient)' : 'url(#lossGradient)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: "clamp(16px, 2vw, 24px)", borderTop: "1px solid var(--lbdr)", paddingTop: "clamp(12px, 2vw, 20px)", display: "flex", gap: "clamp(12px, 2vw, 24px)", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--ltx2)" }}>
                <span style={{ width: 12, height: 12, background: "linear-gradient(135deg, #a3c45a, #8db84a)", borderRadius: "2px", display: "inline-block" }} /> Gain
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--ltx2)" }}>
                <span style={{ width: 12, height: 12, background: "linear-gradient(135deg, #ef4444, #dc2626)", borderRadius: "2px", display: "inline-block" }} /> Loss
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Second Row - Portfolio Allocation & Performance Trend */}
      <div className="psxl-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 8vw, 80px)", marginTop: "clamp(40px, 6vw, 60px)", width: "100%" }}>
        <Reveal>
          <div style={{ background: "var(--lsrf)", border: "1px solid var(--lbdr)", borderRadius: "4px", padding: "clamp(20px, 3vw, 32px)", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(16px, 2vw, 24px)" }}>
              <span style={{ fontSize: "clamp(12px, 2vw, 13px)", fontWeight: 500, color: "var(--ltx)" }}>Portfolio Allocation</span>
              <span style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--ltx3)", letterSpacing: "0.1em" }}>By Sector</span>
            </div>
            <div style={{ height: "clamp(180px, 30vh, 220px)", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {sectorData.map((entry, index) => (
                      <linearGradient key={`grad-${index}`} id={`sectorGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#sectorGrad-${index})`} stroke="var(--lsrf)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{
                            background: 'var(--lbg2)',
                            border: '1px solid var(--lbdr)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: 'var(--ltx)'
                          }}>
                            <strong>{payload[0].name}</strong>
                            <div style={{ color: 'var(--lgrn)', fontWeight: 600 }}>{payload[0].value}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px, 1.5vw, 12px)", justifyContent: "center", marginTop: "clamp(12px, 2vw, 16px)" }}>
              {sectorData.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "clamp(9px, 1.3vw, 11px)", color: "var(--ltx2)" }}>
                  <span style={{ width: 8, height: 8, background: s.color, borderRadius: "50%", display: "inline-block" }} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ background: "var(--lsrf)", border: "1px solid var(--lbdr)", borderRadius: "4px", padding: "clamp(20px, 3vw, 32px)", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(16px, 2vw, 24px)" }}>
              <span style={{ fontSize: "clamp(12px, 2vw, 13px)", fontWeight: 500, color: "var(--ltx)" }}>Cumulative Returns</span>
              <span style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--lgrn)", fontWeight: 600 }}>+94.3% YTD</span>
            </div>
            <div style={{ height: "clamp(180px, 30vh, 220px)", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData.map((d, i) => ({ ...d, cumulative: monthlyData.slice(0, i + 1).reduce((acc, curr) => acc + curr.value, 100) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3c45a" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#a3c45a" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--ltx3)', fontSize: 10, fontWeight: 300 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--ltx3)', fontSize: 10, fontWeight: 300 }}
                    tickFormatter={(val) => `${val}%`}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{
                            background: 'var(--lbg2)',
                            border: '1px solid var(--lbdr)',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: 'var(--ltx)'
                          }}>
                            <strong>{label}</strong>
                            <div style={{ color: 'var(--lgrn)', fontWeight: 600 }}>
                              Portfolio: {payload[0].value.toFixed(1)}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#a3c45a"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function StepCard({s}: {s:Step}) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?"var(--lbg2)":"var(--lbg)",padding:"clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)",position:"relative",transition:"background .2s",height:"100%"}}>
      <div style={{position:"absolute",top:0,left:0,width:2,height:s.lineH,background:"var(--lgrn)"}}/>
      <div style={{fontSize:"clamp(32px, 5vw, 48px)",fontWeight:700,letterSpacing:-2,color:"var(--lbdr2)",lineHeight:1,marginBottom:"clamp(16px, 3vw, 24px)"}}>{s.num}</div>
      <h3 style={{fontSize:"clamp(14px, 2vw, 16px)",fontWeight:600,letterSpacing:-0.3,color:"var(--ltx)",marginBottom:"clamp(8px, 1.5vw, 12px)"}}>{s.title}</h3>
      <p style={{fontSize:"clamp(12px, 1.8vw, 13px)",fontWeight:300,lineHeight:1.7,color:"var(--ltx2)"}}>{s.body}</p>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="psxl-how" style={{...sectionBase("var(--lbg)")}}>
      <Reveal style={{maxWidth:480,marginBottom:"clamp(40px, 8vw, 80px)"}}>
        <SectionLabel>Getting Started</SectionLabel><Divider/>
        <SectionH2>Up and running in minutes.</SectionH2>
        <SectionDesc>No complex setup. No data migration headaches. Just log your first trade and PSXL takes over from there.</SectionDesc>
      </Reveal>
      <div className="psxl-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--lbdr)",marginTop:"clamp(40px, 8vw, 80px)",width:"100%"}}>
        {STEPS.map((s,i)=><Reveal key={i} delay={i*80}><StepCard s={s}/></Reveal>)}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestiCard({t}: {t:Testimonial}) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?"var(--lbg2)":"var(--lbg)",padding:"clamp(24px, 4vw, 40px) clamp(20px, 3vw, 36px)",display:"flex",flexDirection:"column",gap:20,transition:"background .2s",height:"100%"}}>
      <p style={{fontSize:"clamp(12px, 1.8vw, 14px)",fontWeight:300,lineHeight:1.75,color:"var(--ltx2)",flex:1}}>
        <span style={{color:"var(--lgrn)",fontSize:"clamp(20px, 3vw, 28px)",lineHeight:0,verticalAlign:-12,marginRight:4}}>"</span>
        {t.quote}
      </p>
      <div style={{height:1,background:"var(--lbdr)"}}/>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        <span style={{fontSize:"clamp(12px, 2vw, 13px)",fontWeight:600,color:"var(--ltx)"}}>{t.name}</span>
        <span style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:300,color:"var(--ltx3)",letterSpacing:"0.05em"}}>{t.role}</span>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section id="psxl-testimonials" style={{...sectionBase("var(--lbg)")}}>
      <Reveal style={{maxWidth:480,marginBottom:"clamp(40px, 8vw, 80px)"}}>
        <SectionLabel>From Investors</SectionLabel><Divider/>
        <SectionH2>What traders say.</SectionH2>
      </Reveal>
      <div className="psxl-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"var(--lbdr)",width:"100%"}}>
        {TESTIMONIALS.map((t,i)=><Reveal key={i} delay={i*80}><TestiCard t={t}/></Reveal>)}
      </div>
    </section>
  );
}

// ─── SECURITY ────────────────────────────────────────────────────────────────
function Security() {
  return (
    <section id="psxl-security" style={{...sectionBase("var(--lbg2)")}}>
      <div className="psxl-two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(60px, 10vw, 120px)",alignItems:"start",width:"100%"}}>
        <Reveal>
          <SectionLabel>Security & Privacy</SectionLabel><Divider/>
          <SectionH2>Your data.<br/>Your ledger.</SectionH2>
          <SectionDesc>We hold financial records to the highest standard of privacy. PSXL never sells data, never connects to your broker, and never executes trades.</SectionDesc>
          <div style={{display:"flex",flexDirection:"column",borderTop:"1px solid var(--lbdr)",marginTop:"clamp(24px, 4vw, 40px)"}}>
            {SEC_ITEMS.map((s,i)=>(
              <div key={i} style={{padding:"clamp(16px, 2.5vw, 24px) 0",borderBottom:"1px solid var(--lbdr)",display:"flex",gap:"clamp(12px, 2vw, 20px)",alignItems:"flex-start"}}>
                <div style={{color:"var(--lgrn)",flexShrink:0,marginTop:2}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:"clamp(12px, 2vw, 14px)",fontWeight:600,color:"var(--ltx)",marginBottom:4}}>{s.title}</div>
                  <div style={{fontSize:"clamp(11px, 1.7vw, 13px)",fontWeight:300,color:"var(--ltx2)",lineHeight:1.6}}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div style={{background:"var(--lsrf)",border:"1px solid var(--lbdr)",padding:"clamp(24px, 4vw, 40px)",width:"100%"}}>
            <div style={{fontSize:"clamp(9px, 1.5vw, 10px)",textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--ltx3)",paddingBottom:"clamp(12px, 2vw, 20px)",borderBottom:"1px solid var(--lbdr)",marginBottom:"clamp(12px, 2vw, 20px)"}}>System Security Status</div>
            {SEC_STATUS.map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"clamp(6px, 1.5vw, 10px) 0",borderBottom:i<SEC_STATUS.length-1?"1px solid var(--lbdr)":"none"}}>
                <span style={{fontSize:"clamp(11px, 1.7vw, 12px)",fontWeight:300,color:"var(--ltx2)"}}>{s.key}</span>
                <span style={{fontSize:"clamp(10px, 1.5vw, 12px)",fontWeight:500,color:s.danger?"var(--lred)":"var(--lgrn)",fontFamily:"monospace"}}>{s.val}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open,setOpen]=useState<number|null>(null);
  const toggle=useCallback((i:number)=>setOpen(p=>p===i?null:i),[]);
  return (
    <section id="psxl-faq" style={{...sectionBase("var(--lbg)")}}>
      <div className="psxl-faq-grid" style={{display:"grid",gridTemplateColumns:"clamp(280px, 30%, 320px) 1fr",gap:"clamp(40px, 8vw, 120px)",alignItems:"start",width:"100%"}}>
        <Reveal>
          <SectionLabel>FAQ</SectionLabel><Divider/>
          <SectionH2>Common questions.</SectionH2>
          <SectionDesc maxWidth={300}>Everything you need to know before you start.</SectionDesc>
        </Reveal>
        <Reveal>
          <div style={{display:"flex",flexDirection:"column",borderTop:"1px solid var(--lbdr)",width:"100%"}}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{borderBottom:"1px solid var(--lbdr)",overflow:"hidden"}}>
                <button onClick={()=>toggle(i)} style={{width:"100%",background:"none",border:"none",fontFamily:ff,fontSize:"clamp(12px, 1.8vw, 14px)",fontWeight:400,color:open===i?"var(--lgrn)":"var(--ltx)",textAlign:"left",padding:"clamp(14px, 2vw, 20px) 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,transition:"color .2s"}}>
                  {f.q}
                  <span style={{width:12,height:12,borderRight:"1.5px solid currentColor",borderBottom:"1.5px solid currentColor",transform:open===i?"rotate(225deg)":"rotate(45deg)",transition:"transform .3s",flexShrink:0,display:"inline-block"}}/>
                </button>
                <div style={{maxHeight:open===i?200:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <p style={{fontSize:"clamp(11px, 1.7vw, 13px)",fontWeight:300,lineHeight:1.7,color:"var(--ltx2)",paddingBottom:"clamp(12px, 2vw, 20px)"}}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  const [email,setEmail]=useState("");
  return (
    <section id="psxl-cta" style={{...sectionBase("var(--lbg2)"),alignItems:"center",justifyContent:"center",width:"100%"}}>
      <Reveal style={{maxWidth:680,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(16px, 3vw, 24px)",width:"100%"}}>
        <SectionLabel>Start Today</SectionLabel>
        <h2 style={{fontSize:"clamp(32px, 6vw, 80px)",fontWeight:700,letterSpacing:-3,lineHeight:0.95,color:"var(--ltx)"}}>
          Your PSX ledger,<br/><em style={{fontStyle:"normal",color:"var(--lgrn)"}}>done right.</em>
        </h2>
        <p style={{fontSize:"clamp(12px, 1.8vw, 15px)",fontWeight:300,color:"var(--ltx2)",lineHeight:1.6}}>
          Join investors across Pakistan who track their trades the professional way. Free to start. No credit card required.
        </p>
        <div className="psxl-cta-form" style={{display:"flex",width:"100%",maxWidth:420,border:"1px solid var(--lbdr2)",overflow:"hidden",borderRadius:"2px"}}>
          <input className="psxl-cta-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
            style={{flex:1,fontFamily:ff,fontSize:"clamp(12px, 1.8vw, 13px)",fontWeight:300,color:"var(--ltx)",background:"var(--lbg)",border:"none",padding:"clamp(12px, 2vw, 14px) clamp(14px, 2vw, 20px)",outline:"none"}}/>
          <button className="psxl-cta-button" style={{fontFamily:ff,fontSize:"clamp(9px, 1.5vw, 11px)",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"#000",background:"var(--lgrn)",border:"none",padding:"clamp(12px, 2vw, 14px) clamp(16px, 2vw, 24px)",cursor:"pointer",whiteSpace:"nowrap",transition:"background 0.2s ease"}}>
            Get Access
          </button>
        </div>
        <span style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:300,color:"var(--ltx3)",letterSpacing:"0.05em"}}>Free plan · No credit card · Cancel any time</span>
      </Reveal>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols=[
    {title:"Product",   links:[{label:"Features",href:"#psxl-features"},{label:"Changelog",href:"#"},{label:"Roadmap",href:"#"},{label:"Pricing",href:"#"}]},
    {title:"Resources", links:[{label:"Documentation",href:"#"},{label:"CSV Templates",href:"#"},{label:"Tax Guide",href:"#"},{label:"Blog",href:"#"}]},
    {title:"Company",   links:[{label:"About",href:"/about"},{label:"Contact",href:"/contact"},{label:"Press",href:"#"},{label:"Careers",href:"#"}]},
    {title:"Legal",     links:[{label:"Privacy Policy",href:"/privacy"},{label:"Terms of Use",href:"#"},{label:"Disclaimer",href:"#"},{label:"Cookie Policy",href:"#"}]},
  ];
  return (
    <footer style={{background:"var(--lbg)",borderTop:"1px solid var(--lbdr)",padding:"clamp(40px, 8vw, 60px) clamp(16px, 4vw, 40px)",fontFamily:ff,width:"100%",boxSizing:"border-box",margin:0}}>
      <div className="psxl-footer-grid" style={{display:"grid",gridTemplateColumns:"clamp(200px, 25%, 240px) 1fr",gap:"clamp(40px, 6vw, 80px)",paddingBottom:"clamp(30px, 5vw, 48px)",borderBottom:"1px solid var(--lbdr)",marginBottom:"clamp(24px, 4vw, 40px)",width:"100%"}}>
        <div>
          <a href="/" style={{fontSize:"clamp(18px, 3vw, 22px)",fontWeight:700,letterSpacing:-0.5,color:"var(--ltx)",marginBottom:16,display:"flex",alignItems:"center",textDecoration:"none"}}>
            PSX<LogoMark size={32}/>
          </a>
          <p style={{fontSize:"clamp(11px, 1.6vw, 12px)",fontWeight:300,color:"var(--ltx3)",lineHeight:1.6}}>The institutional-grade trading ledger for Pakistan Stock Exchange investors.</p>
        </div>
        <div className="psxl-footer-cols" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"clamp(20px, 3vw, 40px)",width:"100%"}}>
          {cols.map((c,i)=>(
            <div key={i}>
              <h4 style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--ltx)",marginBottom:"clamp(12px, 2vw, 20px)"}}>{c.title}</h4>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"clamp(8px, 1.5vw, 12px)"}}>
                {c.links.map((l,j)=>(
                  <li key={j}>
                    <a href={l.href} style={{fontSize:"clamp(11px, 1.6vw, 13px)",fontWeight:300,color:"var(--ltx2)",textDecoration:"none"}}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="psxl-footer-bottom" style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",gap:"clamp(16px, 2vw, 24px)"}}>
        <p style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:300,color:"var(--ltx3)"}}>&copy; 2026 PSXL. All rights reserved. Not affiliated with the Pakistan Stock Exchange.</p>
        <div style={{display:"flex",gap:"clamp(12px, 2vw, 24px)",flexWrap:"wrap"}}>
          {["Privacy","Terms","Disclaimer"].map(l=>(
            <a key={l} href="#" style={{fontSize:"clamp(10px, 1.5vw, 11px)",fontWeight:300,color:"var(--ltx3)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export default function Landing() {
  const [theme,setTheme]=useState<Theme>("dark");
  const toggle=useCallback(()=>setTheme(t=>t==="dark"?"light":"dark"),[]);

  return (
    <div className="psxl-root" data-theme={theme} style={{fontFamily:ff,overflowX:"hidden",width:"100%",margin:0,padding:0}}>
      <style>{SCOPED_CSS}</style>
      <Nav theme={theme} onToggle={toggle}/>
      <main style={{width:"100%",margin:0,padding:0}}>
        <Hero/>
        <Features/>
        <LedgerDemo/>
        <Analytics/>
        <HowItWorks/>
        <Testimonials/>
        <Security/>
        <FAQ/>
        <CTA/>
      </main>
      <Footer/>
      <Ticker/>
    </div>
  );
}