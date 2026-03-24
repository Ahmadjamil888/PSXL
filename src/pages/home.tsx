import { useState, useEffect, useRef, useCallback } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

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
    <path d="M10 2 C10 2, 8 8, 7 14 C6 20, 7.5 24, 11 26" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
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

// ─── SCOPED CSS — uses .psxl-root as the root, touches NOTHING outside ───────
// The only global additions are the @keyframes (harmless) and the Google Font import.
const SCOPED_CSS = `
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

  /* ── wrapper ── */
  .psxl-root {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden;
    scroll-behavior: smooth;
    line-height: 1;
    box-sizing: border-box;
  }
  .psxl-root *, .psxl-root *::before, .psxl-root *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── dark token set ── */
  .psxl-root[data-theme="dark"] {
    --lbg:  #000000; --lbg2: #0a0a0a; --lbg3: #111111;
    --lsrf: #161616; --lbdr: #222222; --lbdr2:#2a2a2a;
    --ltx:  #ffffff; --ltx2: #999999; --ltx3: #555555;
    --lgrn: #22c55e; --lgrnD:#16a34a; --lred: #ef4444;
    color-scheme: dark;
  }

  /* ── light token set ── */
  .psxl-root[data-theme="light"] {
    --lbg:  #ffffff; --lbg2: #f7f7f7; --lbg3: #f0f0f0;
    --lsrf: #ebebeb; --lbdr: #e0e0e0; --lbdr2:#d0d0d0;
    --ltx:  #000000; --ltx2: #555555; --ltx3: #999999;
    --lgrn: #22c55e; --lgrnD:#16a34a; --lred: #ef4444;
    color-scheme: light;
  }

  /* ── scrollbar (scoped via ::-webkit, only fires inside the root in Chrome) ── */
  .psxl-root ::-webkit-scrollbar       { width: 2px; }
  .psxl-root ::-webkit-scrollbar-track { background: var(--lbg); }
  .psxl-root ::-webkit-scrollbar-thumb { background: var(--lgrn); }

  /* ── nav hero animations ── */
  .psxl-nav          { animation: psxl-fadeIn 0.6s ease both; }
  .psxl-hero-eyebrow { animation: psxl-fadeUp 0.6s 0.2s ease both; }
  .psxl-hero-h1      { animation: psxl-fadeUp 0.6s 0.3s ease both; }
  .psxl-hero-desc    { animation: psxl-fadeUp 0.6s 0.4s ease both; }
  .psxl-hero-actions { animation: psxl-fadeUp 0.6s 0.5s ease both; }
  .psxl-hero-right   { animation: psxl-fadeIn 0.8s 0.4s ease both; }

  /* ── ticker ── */
  .psxl-ticker-track { animation: psxl-ticker 60s linear infinite; }

  /* ── reveal ── */
  .psxl-reveal         { opacity:0; transform:translateY(24px); transition: opacity .7s ease, transform .7s ease; }
  .psxl-reveal.visible { opacity:1; transform:translateY(0); }
`;

// ─── HOOK ────────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, {threshold:0.1});
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return {ref, visible};
}

// ─── SHARED STYLE HELPERS ────────────────────────────────────────────────────
const ff = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const btnPrimary: React.CSSProperties = {
  fontFamily:ff, fontSize:12, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase",
  color:"#000", background:"var(--lgrn)", border:"1px solid var(--lgrn)",
  padding:"14px 28px", cursor:"pointer", textDecoration:"none", display:"inline-block", textAlign:"center",
};
const btnGhost: React.CSSProperties = {
  fontFamily:ff, fontSize:12, fontWeight:400, letterSpacing:"0.12em", textTransform:"uppercase",
  color:"var(--ltx)", background:"transparent", border:"1px solid var(--lbdr2)",
  padding:"14px 28px", cursor:"pointer", textDecoration:"none", display:"inline-block", textAlign:"center",
};
const sectionBase = (bg: string): React.CSSProperties => ({
  minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center",
  padding:"100px 40px 60px", position:"relative", borderBottom:"1px solid var(--lbdr)", background:bg,
});

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Reveal({children, delay=0, style}: {children:React.ReactNode; delay?:number; style?:React.CSSProperties}) {
  const {ref, visible} = useReveal();
  return (
    <div ref={ref} className={`psxl-reveal${visible?" visible":""}`}
      style={{transitionDelay:`${delay}ms`, ...style}}>
      {children}
    </div>
  );
}

const SectionLabel = ({children}: {children:React.ReactNode}) => (
  <p style={{fontSize:10,fontWeight:500,letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--lgrn)",marginBottom:16}}>{children}</p>
);
const Divider = () => <div style={{width:40,height:2,background:"var(--lgrn)",marginBottom:40}}/>;
const SectionH2 = ({children}: {children:React.ReactNode}) => (
  <h2 style={{fontSize:"clamp(36px,4vw,60px)",fontWeight:700,letterSpacing:-2,lineHeight:1.0,color:"var(--ltx)",marginBottom:20}}>{children}</h2>
);
const SectionDesc = ({children,maxWidth=560}: {children:React.ReactNode;maxWidth?:number}) => (
  <p style={{fontSize:15,fontWeight:300,lineHeight:1.7,color:"var(--ltx2)",maxWidth}}>{children}</p>
);

// ─── TICKER ──────────────────────────────────────────────────────────────────
function Ticker() {
  const doubled = [...STOCKS,...STOCKS];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:99,height:32,background:"var(--lbg2)",borderTop:"1px solid var(--lbdr)",overflow:"hidden",display:"flex",alignItems:"center"}}>
      <div className="psxl-ticker-track" style={{display:"flex",whiteSpace:"nowrap",willChange:"transform"}}>
        {doubled.map((s,i)=>(
          <div key={i} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"0 32px",fontSize:11,letterSpacing:"0.05em",borderRight:"1px solid var(--lbdr)"}}>
            <span style={{fontWeight:700,color:"var(--ltx)"}}>{s.sym}</span>
            <span style={{color:"var(--ltx2)"}}>{s.val}</span>
            <span style={{color:s.pos?"var(--lgrn)":"var(--lred)"}}>{s.chg} ({s.pct})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({theme,onToggle}: {theme:Theme;onToggle:()=>void}) {
  return (
    <nav className="psxl-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",borderBottom:"1px solid var(--lbdr)",background:"var(--lbg)",transition:"background .4s, border-color .4s"}}>
      <a href="#psxl-top" style={{display:"flex",alignItems:"center",fontSize:20,fontWeight:700,letterSpacing:-0.5,color:"var(--ltx)",textDecoration:"none"}}>
        PSX<LogoMark size={28}/>
      </a>
      <ul style={{display:"flex",alignItems:"center",gap:32,listStyle:"none"}}>
        {[["#psxl-features","Features"],["#psxl-ledger","Ledger"],["#psxl-analytics","Analytics"],["#psxl-pricing","Pricing"],["#psxl-faq","FAQ"]].map(([href,label])=>(
          <li key={href}><a href={href} style={{fontSize:12,fontWeight:400,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ltx2)",textDecoration:"none"}}>{label}</a></li>
        ))}
      </ul>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <div onClick={onToggle} title="Toggle theme"
          style={{width:40,height:22,background:"var(--lbdr2)",borderRadius:11,position:"relative",cursor:"pointer",border:"1px solid var(--lbdr)",transition:"background .3s"}}>
          <div style={{position:"absolute",top:2,left:2,width:16,height:16,borderRadius:"50%",background:"var(--lgrn)",transition:"transform .3s",transform:theme==="light"?"translateX(18px)":"translateX(0)"}}/>
        </div>
        <a href="/auth" style={{fontFamily:ff,fontSize:11,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:"#000",background:"var(--lgrn)",border:"none",padding:"8px 18px",cursor:"pointer",textDecoration:"none",display:"inline-block"}}>
          Start Free
        </a>
      </div>
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
    <section id="psxl-top" style={{minHeight:"100vh",background:"var(--lbg)",paddingTop:56,display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"calc(100vh - 56px - 32px)"}}>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 60px 60px 40px",borderRight:"1px solid var(--lbdr)"}}>
          <p className="psxl-hero-eyebrow" style={{fontSize:10,fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--lgrn)",marginBottom:24}}>Pakistan Stock Exchange Ledger</p>
          <h1 className="psxl-hero-h1" style={{fontSize:"clamp(52px,6vw,88px)",fontWeight:700,letterSpacing:-3,lineHeight:0.95,color:"var(--ltx)",marginBottom:32}}>
            Track every<br/>trade with<br/><em style={{fontStyle:"normal",color:"var(--lgrn)"}}>precision.</em>
          </h1>
          <p className="psxl-hero-desc" style={{fontSize:15,fontWeight:300,lineHeight:1.7,color:"var(--ltx2)",maxWidth:420,marginBottom:48}}>
            PSXL is the institutional-grade trading ledger built exclusively for PSX investors. Record, analyse, and report your equity positions with the clarity of a professional desk.
          </p>
          <div className="psxl-hero-actions" style={{display:"flex",gap:16}}>
            <a href="/auth" style={btnPrimary}>Get Started</a>
            <a href="#psxl-ledger" style={btnGhost}>View Demo</a>
          </div>
        </div>
        <div className="psxl-hero-right" style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:1,background:"var(--lbdr)"}}>
          {stats.map((s,i)=>(
            <div key={i} style={{background:"var(--lbg)",padding:"28px 32px",display:"flex",flexDirection:"column",gap:6,borderBottom:i<stats.length-1?"1px solid var(--lbdr)":"none"}}>
              <span style={{fontSize:10,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--ltx3)"}}>{s.label}</span>
              <span style={{fontSize:36,fontWeight:700,letterSpacing:-1,color:s.cls==="pos"?"var(--lgrn)":"var(--ltx)"}}>{s.val}</span>
              <span style={{fontSize:11,color:"var(--ltx3)",fontWeight:300}}>{s.sub}</span>
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
      style={{background:hov?"var(--lbg3)":"var(--lbg2)",padding:"40px 36px",display:"flex",flexDirection:"column",gap:16,transition:"background .2s",height:"100%"}}>
      <span style={{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--ltx3)"}}>{f.num}</span>
      <div style={{color:"var(--lgrn)"}}>{f.icon}</div>
      <h3 style={{fontSize:18,fontWeight:600,letterSpacing:-0.5,color:"var(--ltx)",lineHeight:1.2}}>{f.title}</h3>
      <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:"var(--ltx2)"}}>{f.body}</p>
      <span style={{display:"inline-block",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--lgrn)",border:"1px solid var(--lgrnD)",padding:"3px 10px",marginTop:"auto",width:"fit-content"}}>{f.tag}</span>
    </div>
  );
}

function Features() {
  return (
    <section id="psxl-features" style={sectionBase("var(--lbg2)")}>
      <Reveal style={{maxWidth:600,marginBottom:80}}>
        <SectionLabel>Core Capabilities</SectionLabel><Divider/>
        <SectionH2>Every tool a PSX trader needs.</SectionH2>
        <SectionDesc>Built ground-up for the Pakistan Stock Exchange settlement cycle, tax regime, and broker ecosystem. No generic solutions.</SectionDesc>
      </Reveal>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"var(--lbdr)"}}>
        {FEATURES.map((f,i)=><Reveal key={i} delay={i*60}><FeatureCard f={f}/></Reveal>)}
      </div>
    </section>
  );
}

// ─── LEDGER DEMO ─────────────────────────────────────────────────────────────
function TradeRow({t}: {t:Trade}) {
  const [hov,setHov]=useState(false);
  const td=(content:React.ReactNode, extra?:React.CSSProperties)=>(
    <td style={{padding:"12px 14px",fontWeight:300,...extra}}>{content}</td>
  );
  return (
    <tr onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderBottom:"1px solid var(--lbdr)",background:hov?"var(--lbg3)":"transparent",transition:"background .15s"}}>
      {td(t.date,{fontSize:11,color:"var(--ltx3)"})}
      {td(t.sym,{fontWeight:600,fontSize:13})}
      {td(t.sector,{fontSize:11,color:"var(--ltx3)"})}
      {td(t.type,{color:t.type==="BUY"?"var(--lgrn)":"var(--lred)",fontWeight:500,fontSize:11})}
      {td(t.qty.toLocaleString())}
      {td(`₨${t.rate.toFixed(2)}`)}
      {td(`₨${t.value.toLocaleString()}`)}
      {td(`₨${t.charges.toLocaleString()}`,{color:"var(--ltx3)"})}
      {td(t.pl===null?"—":`${t.pl>=0?"+":""}₨${Math.abs(t.pl).toLocaleString()}`,
        {color:t.pl===null?"var(--ltx3)":t.pl>=0?"var(--lgrn)":"var(--lred)"})}
    </tr>
  );
}

function LedgerDemo() {
  return (
    <section id="psxl-ledger" style={sectionBase("var(--lbg)")}>
      <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:60,alignItems:"center",minHeight:"calc(100vh - 160px)"}}>
        <Reveal>
          <SectionLabel>The Ledger</SectionLabel><Divider/>
          <SectionH2>Clean entries.<br/>Zero ambiguity.</SectionH2>
          <SectionDesc maxWidth={380}>Every row tells the complete story of a trade. Built like a double-entry accounting ledger — the standard institutions rely on.</SectionDesc>
          <ul style={{listStyle:"none",display:"flex",flexDirection:"column",marginTop:40,borderTop:"1px solid var(--lbdr)"}}>
            {["Automatic brokerage & levy calculation","Weighted average cost per symbol","Running portfolio balance after each trade","Broker statement reconciliation","Date-wise gain/loss summary","Unrealised position marking to market"].map((item,i)=>(
              <li key={i} style={{padding:"16px 0",borderBottom:"1px solid var(--lbdr)",fontSize:13,fontWeight:300,color:"var(--ltx2)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"var(--lgrn)",flexShrink:0,display:"inline-block"}}/>{item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <div style={{background:"var(--lsrf)",border:"1px solid var(--lbdr)",overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:620}}>
            <div style={{padding:"16px 24px",borderBottom:"1px solid var(--lbdr)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--lbg3)"}}>
              <span style={{fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ltx2)"}}>Trade Ledger — Q1 2026</span>
              <span style={{fontSize:10,padding:"3px 10px",background:"var(--lgrn)",color:"#000",fontWeight:600,letterSpacing:"0.08em"}}>Live</span>
            </div>
            <div style={{overflowY:"auto",flex:1}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr>{["Date","Symbol","Sector","Type","Qty","Rate","Value","Charges","P&L"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ltx3)",borderBottom:"1px solid var(--lbdr)",background:"var(--lbg3)",position:"sticky",top:0}}>{h}</th>
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
function Analytics() {
  const maxVal=Math.max(...BAR_VALS.map(Math.abs));
  const metrics=[
    {label:"Win Rate",     val:"68.4%", cls:"pos"},{label:"Avg Hold",      val:"18.2d", cls:""},
    {label:"Max Drawdown", val:"−8.1%", cls:"neg"},{label:"Sharpe Ratio",  val:"1.74",  cls:"pos"},
    {label:"Best Month",   val:"+21.3%",cls:"pos"},{label:"Profit Factor", val:"2.31",  cls:"pos"},
  ];
  return (
    <section id="psxl-analytics" style={sectionBase("var(--lbg2)")}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
        <Reveal>
          <SectionLabel>Analytics</SectionLabel><Divider/>
          <SectionH2>Numbers that drive decisions.</SectionH2>
          <SectionDesc>Institutional reporting metrics presented cleanly. Understand your edge, your drawdowns, and your consistency over time.</SectionDesc>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"var(--lbdr)",marginTop:48}}>
            {metrics.map((m,i)=>(
              <div key={i} style={{background:"var(--lsrf)",padding:"20px 24px"}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--ltx3)",marginBottom:6}}>{m.label}</div>
                <div style={{fontSize:24,fontWeight:700,letterSpacing:-0.5,color:m.cls==="pos"?"var(--lgrn)":m.cls==="neg"?"var(--lred)":"var(--ltx)"}}>{m.val}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div style={{background:"var(--lsrf)",border:"1px solid var(--lbdr)",padding:32}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
              <span style={{fontSize:13,fontWeight:500,color:"var(--ltx)"}}>Monthly P&L</span>
              <span style={{fontSize:11,color:"var(--ltx3)",letterSpacing:"0.1em"}}>Jan — Dec 2025</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:160}}>
              {BAR_VALS.map((v,i)=>{
                const pct=(Math.abs(v)/maxVal)*100;
                return (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <div style={{width:"100%",background:v>=0?"var(--lgrn)":"var(--lred)",opacity:0.75,height:`${pct}%`}}/>
                    <span style={{fontSize:9,color:"var(--ltx3)"}}>{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:24,borderTop:"1px solid var(--lbdr)",paddingTop:20,display:"flex",gap:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"var(--ltx2)"}}>
                <span style={{width:10,height:10,background:"var(--lgrn)",opacity:0.75,display:"inline-block"}}/> Gain
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"var(--ltx2)"}}>
                <span style={{width:10,height:10,background:"var(--lred)",opacity:0.75,display:"inline-block"}}/> Loss
              </div>
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
      style={{background:hov?"var(--lbg2)":"var(--lbg)",padding:"40px 32px",position:"relative",transition:"background .2s",height:"100%"}}>
      <div style={{position:"absolute",top:0,left:0,width:2,height:s.lineH,background:"var(--lgrn)"}}/>
      <div style={{fontSize:48,fontWeight:700,letterSpacing:-2,color:"var(--lbdr2)",lineHeight:1,marginBottom:24}}>{s.num}</div>
      <h3 style={{fontSize:16,fontWeight:600,letterSpacing:-0.3,color:"var(--ltx)",marginBottom:12}}>{s.title}</h3>
      <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:"var(--ltx2)"}}>{s.body}</p>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="psxl-how" style={sectionBase("var(--lbg)")}>
      <Reveal style={{maxWidth:480}}>
        <SectionLabel>Getting Started</SectionLabel><Divider/>
        <SectionH2>Up and running in minutes.</SectionH2>
        <SectionDesc>No complex setup. No data migration headaches. Just log your first trade and PSXL takes over from there.</SectionDesc>
      </Reveal>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--lbdr)",marginTop:80}}>
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
      style={{background:hov?"var(--lbg2)":"var(--lbg)",padding:"40px 36px",display:"flex",flexDirection:"column",gap:20,transition:"background .2s",height:"100%"}}>
      <p style={{fontSize:14,fontWeight:300,lineHeight:1.75,color:"var(--ltx2)",flex:1}}>
        <span style={{color:"var(--lgrn)",fontSize:28,lineHeight:0,verticalAlign:-12,marginRight:4}}>"</span>
        {t.quote}
      </p>
      <div style={{height:1,background:"var(--lbdr)"}}/>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        <span style={{fontSize:13,fontWeight:600,color:"var(--ltx)"}}>{t.name}</span>
        <span style={{fontSize:11,fontWeight:300,color:"var(--ltx3)",letterSpacing:"0.05em"}}>{t.role}</span>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section id="psxl-testimonials" style={sectionBase("var(--lbg)")}>
      <Reveal style={{maxWidth:480,marginBottom:80}}>
        <SectionLabel>From Investors</SectionLabel><Divider/>
        <SectionH2>What traders say.</SectionH2>
      </Reveal>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"var(--lbdr)"}}>
        {TESTIMONIALS.map((t,i)=><Reveal key={i} delay={i*80}><TestiCard t={t}/></Reveal>)}
      </div>
    </section>
  );
}

// ─── SECURITY ────────────────────────────────────────────────────────────────
function Security() {
  return (
    <section id="psxl-security" style={sectionBase("var(--lbg2)")}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:120,alignItems:"center"}}>
        <Reveal>
          <SectionLabel>Security & Privacy</SectionLabel><Divider/>
          <SectionH2>Your data.<br/>Your ledger.</SectionH2>
          <SectionDesc>We hold financial records to the highest standard of privacy. PSXL never sells data, never connects to your broker, and never executes trades.</SectionDesc>
          <div style={{display:"flex",flexDirection:"column",borderTop:"1px solid var(--lbdr)",marginTop:40}}>
            {SEC_ITEMS.map((s,i)=>(
              <div key={i} style={{padding:"24px 0",borderBottom:"1px solid var(--lbdr)",display:"flex",gap:20,alignItems:"flex-start"}}>
                <div style={{color:"var(--lgrn)",flexShrink:0,marginTop:2}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--ltx)",marginBottom:4}}>{s.title}</div>
                  <div style={{fontSize:13,fontWeight:300,color:"var(--ltx2)",lineHeight:1.6}}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div style={{background:"var(--lsrf)",border:"1px solid var(--lbdr)",padding:40}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--ltx3)",paddingBottom:20,borderBottom:"1px solid var(--lbdr)",marginBottom:20}}>System Security Status</div>
            {SEC_STATUS.map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<SEC_STATUS.length-1?"1px solid var(--lbdr)":"none"}}>
                <span style={{fontSize:12,fontWeight:300,color:"var(--ltx2)"}}>{s.key}</span>
                <span style={{fontSize:12,fontWeight:500,color:s.danger?"var(--lred)":"var(--lgrn)",fontFamily:"monospace"}}>{s.val}</span>
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
    <section id="psxl-faq" style={sectionBase("var(--lbg)")}>
      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:120,alignItems:"start"}}>
        <Reveal>
          <SectionLabel>FAQ</SectionLabel><Divider/>
          <SectionH2>Common questions.</SectionH2>
          <SectionDesc maxWidth={300}>Everything you need to know before you start.</SectionDesc>
        </Reveal>
        <Reveal>
          <div style={{display:"flex",flexDirection:"column",borderTop:"1px solid var(--lbdr)"}}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{borderBottom:"1px solid var(--lbdr)",overflow:"hidden"}}>
                <button onClick={()=>toggle(i)} style={{width:"100%",background:"none",border:"none",fontFamily:ff,fontSize:14,fontWeight:400,color:open===i?"var(--lgrn)":"var(--ltx)",textAlign:"left",padding:"20px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,transition:"color .2s"}}>
                  {f.q}
                  <span style={{width:12,height:12,borderRight:"1.5px solid currentColor",borderBottom:"1.5px solid currentColor",transform:open===i?"rotate(225deg)":"rotate(45deg)",transition:"transform .3s",flexShrink:0,display:"inline-block"}}/>
                </button>
                <div style={{maxHeight:open===i?200:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <p style={{fontSize:13,fontWeight:300,lineHeight:1.7,color:"var(--ltx2)",paddingBottom:20}}>{f.a}</p>
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
    <section id="psxl-cta" style={{...sectionBase("var(--lbg2)"),alignItems:"center"}}>
      <Reveal style={{maxWidth:680,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:24,width:"100%"}}>
        <SectionLabel>Start Today</SectionLabel>
        <h2 style={{fontSize:"clamp(48px,5vw,80px)",fontWeight:700,letterSpacing:-3,lineHeight:0.95,color:"var(--ltx)"}}>
          Your PSX ledger,<br/><em style={{fontStyle:"normal",color:"var(--lgrn)"}}>done right.</em>
        </h2>
        <p style={{fontSize:15,fontWeight:300,color:"var(--ltx2)",lineHeight:1.6}}>
          Join investors across Pakistan who track their trades the professional way. Free to start. No credit card required.
        </p>
        <div style={{display:"flex",width:"100%",maxWidth:420,border:"1px solid var(--lbdr2)",overflow:"hidden"}}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
            style={{flex:1,fontFamily:ff,fontSize:13,fontWeight:300,color:"var(--ltx)",background:"var(--lbg)",border:"none",padding:"14px 20px",outline:"none"}}/>
          <button style={{fontFamily:ff,fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"#000",background:"var(--lgrn)",border:"none",padding:"14px 24px",cursor:"pointer",whiteSpace:"nowrap"}}>
            Get Access
          </button>
        </div>
        <span style={{fontSize:11,fontWeight:300,color:"var(--ltx3)",letterSpacing:"0.05em"}}>Free plan · No credit card · Cancel any time</span>
      </Reveal>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols=[
    {title:"Product",   links:["Features","Pricing","Changelog","Roadmap"]},
    {title:"Resources", links:["Documentation","CSV Templates","Tax Guide","Blog"]},
    {title:"Company",   links:["About","Contact","Press","Careers"]},
    {title:"Legal",     links:["Privacy Policy","Terms of Use","Disclaimer","Cookie Policy"]},
  ];
  return (
    <footer style={{background:"var(--lbg)",borderTop:"1px solid var(--lbdr)",padding:"60px 40px 40px",fontFamily:ff}}>
      <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:80,paddingBottom:48,borderBottom:"1px solid var(--lbdr)",marginBottom:40}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,letterSpacing:-0.5,color:"var(--ltx)",marginBottom:16,display:"flex",alignItems:"center"}}>
            PSX<LogoMark size={32}/>
          </div>
          <p style={{fontSize:12,fontWeight:300,color:"var(--ltx3)",lineHeight:1.6}}>The institutional-grade trading ledger for Pakistan Stock Exchange investors.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:40}}>
          {cols.map((col,i)=>(
            <div key={i}>
              <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--ltx3)",marginBottom:20}}>{col.title}</div>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                {col.links.map((l,j)=>(
                  <li key={j}><a href="#" style={{fontSize:13,fontWeight:300,color:"var(--ltx2)",textDecoration:"none"}}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,fontWeight:300,color:"var(--ltx3)",letterSpacing:"0.05em"}}>© 2026 PSXL. All rights reserved. Not affiliated with the Pakistan Stock Exchange.</span>
        <div style={{display:"flex",gap:24}}>
          {["Privacy","Terms","Disclaimer"].map(l=>(
            <a key={l} href="#" style={{fontSize:11,fontWeight:300,color:"var(--ltx3)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export default function Landing() {
  // Own local theme state — never touches document.documentElement
  const [theme,setTheme]=useState<Theme>("dark");
  const toggle=useCallback(()=>setTheme(t=>t==="dark"?"light":"dark"),[]);

  return (
    // All CSS is scoped under .psxl-root — zero bleed into the rest of the app
    <div className="psxl-root" data-theme={theme} style={{fontFamily:ff,overflowX:"hidden"}}>
      <style>{SCOPED_CSS}</style>
      <Nav theme={theme} onToggle={toggle}/>
      <main>
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