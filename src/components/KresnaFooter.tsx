import { useEffect } from "react";

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@500;600;700&display=swap');

  .footer-section,
  .footer-section *,
  .footer-section *::before,
  .footer-section *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .footer-section {
    background: #050505;
    padding: 48px 24px 24px;
    color: #f5f7f3;
    position: relative;
  }

  .footer-wrapper {
    max-width: 1150px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 16px;
    align-items: stretch;
    position: relative;
    z-index: 2;
  }

  .footer-left {
    position: relative;
    min-height: 340px;
    border-radius: 28px;
    padding: 32px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(21, 76, 189, 0.25);
    background: #1e4fc0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'DM Sans', sans-serif;
  }

  .footer-left-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    pointer-events: none;
  }

  .footer-logo,
  .footer-tagline-container,
  .footer-social-row {
    position: relative;
    z-index: 1;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.85);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: 700 16px 'DM Sans', sans-serif;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .footer-logo-name {
    font: 700 22px 'DM Sans', sans-serif;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .footer-tagline-container {
    margin-top: auto;
    margin-bottom: 28px;
  }

  .footer-tagline {
    font: 400 19px/1.45 'DM Sans', sans-serif;
    color: #fff;
  }

  .footer-tagline span {
    color: rgba(255,255,255,0.65);
  }

  .footer-social-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .footer-social-label {
    font: 600 17px 'Caveat', cursive;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.3px;
  }

  .footer-social-icons {
    display: flex;
    gap: 7px;
  }

  .social-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: #0e1014;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }

  .social-icon:hover {
    background: #000;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.22);
  }

  .social-icon svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
  }

  .footer-right {
    background: #101010;
    border-radius: 28px;
    padding: 40px;
    overflow: visible;
    box-shadow: 0 18px 50px rgba(0,0,0,0.24);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    font-family: 'DM Sans', sans-serif;
  }

  .footer-lucky-graphic {
    position: absolute;
    top: -36px;
    right: 40px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .lucky-cube {
    width: 96px;
    height: 96px;
    border-radius: 22px;
    transform: rotate(-10deg);
    background: linear-gradient(135deg, #5b9ffb 0%, #1e5dd7 55%, #1448be 100%);
    box-shadow:
      inset 3px 3px 8px rgba(255,255,255,0.35),
      inset -3px -3px 12px rgba(0,0,0,0.18),
      8px 14px 28px rgba(20,72,200,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lucky-cube-mark {
    font: 700 42px 'DM Sans', sans-serif;
    color: #fff;
    letter-spacing: -0.04em;
    transform: rotate(10deg);
    text-shadow: 0 3px 6px rgba(0,0,0,0.25);
    line-height: 1;
  }

  .lucky-text-row {
    display: flex;
    gap: 6px;
    align-items: center;
    transform: rotate(-4deg);
    margin-top: 4px;
  }

  .lucky-arrow {
    width: 22px;
    height: 22px;
    color: #6b7280;
  }

  .lucky-arrow path {
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .lucky-text {
    font: 600 20px 'Caveat', cursive;
    color: #6b7280;
    white-space: nowrap;
  }

  .footer-right-top {
    padding-top: 8px;
  }

  .footer-nav-cols {
    display: flex;
    gap: 72px;
  }

  .footer-col-title {
    font: italic 600 24px 'Caveat', cursive;
    color: #9fe870;
    margin-bottom: 18px;
  }

  .footer-col a {
    display: block;
    font: 600 14px 'DM Sans', sans-serif;
    color: rgba(245,247,243,0.86);
    margin-bottom: 14px;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-col a:hover {
    color: #9fe870;
  }

  .footer-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 48px;
    gap: 24px;
  }

  .footer-copyright {
    font: 500 12.5px 'DM Sans', sans-serif;
    color: rgba(245,247,243,0.42);
  }

  .footer-cta-mini {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .footer-cta-mini h4 {
    font: 400 15px/1.45 'DM Sans', sans-serif;
    color: rgba(245,247,243,0.62);
  }

  .footer-cta-mini h4 strong {
    display: block;
    font-size: 19px;
    font-weight: 700;
    color: #ffffff;
  }

  .footer-subscribe-row {
    display: flex;
    width: 310px;
    background: #171717;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 5px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.16);
  }

  .footer-subscribe-row input {
    flex: 1;
    padding: 11px 14px;
    background: transparent;
    border: 0;
    outline: 0;
    font: 400 13.5px 'DM Sans', sans-serif;
    color: #ffffff;
  }

  .footer-subscribe-row input::placeholder {
    color: #6b7280;
  }

  .footer-subscribe-row button {
    border: 0;
    padding: 11px 22px;
    background: #111214;
    color: #fff;
    font: 600 13.5px 'DM Sans', sans-serif;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    cursor: pointer;
  }

  .footer-subscribe-row button:hover {
    background: #000;
    box-shadow: 0 10px 24px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.18);
    transform: translateY(-1px);
  }

  .footer-watermark {
    max-width: 1150px;
    margin: -60px auto 0;
    pointer-events: none;
    user-select: none;
    position: relative;
    z-index: 0;
    line-height: 0;
  }

  .footer-watermark svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .footer-watermark text {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    letter-spacing: -0.03em;
    fill: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 860px) {
    .footer-wrapper {
      grid-template-columns: 1fr;
    }

    .footer-left {
      min-height: auto;
      gap: 40px;
    }
  }

  @media (max-width: 560px) {
    .footer-right {
      padding: 24px;
    }

    .footer-nav-cols {
      gap: 40px;
      flex-wrap: wrap;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
    }

    .footer-subscribe-row {
      width: 100%;
    }

    .footer-lucky-graphic {
      right: 12px;
      top: -28px;
    }

    .lucky-cube {
      width: 72px;
      height: 72px;
    }

    .lucky-cube-mark {
      font-size: 32px;
    }
  }
`;

const SOCIALS = [
  {
    href: "https://discord.com",
    label: "Discord",
    path: "M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.773-.553 1.12a18.27 18.27 0 0 0-5.364 0A11.412 11.412 0 0 0 9.415 3a19.736 19.736 0 0 0-4.435 1.372C2.17 8.544 1.413 12.61 1.792 16.62a19.9 19.9 0 0 0 5.993 3.03c.483-.656.914-1.35 1.285-2.079a12.955 12.955 0 0 1-2.021-.97c.17-.125.337-.255.498-.389 3.898 1.789 8.12 1.789 11.972 0 .162.134.329.264.499.389a12.9 12.9 0 0 1-2.024.971c.37.728.802 1.422 1.286 2.078a19.863 19.863 0 0 0 6-3.03c.444-4.647-.759-8.676-3.963-12.251ZM8.02 14.121c-1.182 0-2.157-1.085-2.157-2.418 0-1.334.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.182 0-2.157-1.085-2.157-2.418 0-1.334.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.947 2.418-2.157 2.418Z",
  },
  {
    href: "https://x.com",
    label: "X",
    path: "M18.901 1.153h3.68l-8.04 9.188L24 22.847h-7.406l-5.8-7.584-6.639 7.584H.474l8.599-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.291 19.492h2.039L6.486 3.25H4.298l13.312 17.395Z",
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    path: "M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.347V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.368-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9H7.12v11.452Z",
  },
  {
    href: "https://github.com",
    label: "GitHub",
    path: "M12 .297a12 12 0 0 0-3.794 23.39c.6.111.82-.261.82-.577v-2.256c-3.338.726-4.042-1.416-4.042-1.416-.546-1.388-1.333-1.758-1.333-1.758-1.09-.746.083-.731.083-.731 1.205.085 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.606-2.665-.303-5.467-1.334-5.467-5.932 0-1.311.469-2.382 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.49 11.49 0 0 1 12 6.844c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.119 3.176.77.839 1.235 1.91 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.371.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.004 12.004 0 0 0 12 .297Z",
  },
];

export default function KresnaFooter() {
  useEffect(() => {
    const fitWatermark = () => {
      const svg = document.getElementById("watermarkSvg");
      const text = document.getElementById("watermarkText");
      if (!svg || !text) return;
      try {
        const bbox = text.getBBox();
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      } catch (error) {
        void error;
      }
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(fitWatermark);
    } else {
      window.addEventListener("load", fitWatermark);
    }

    window.addEventListener("resize", fitWatermark);
    return () => {
      window.removeEventListener("resize", fitWatermark);
      window.removeEventListener("load", fitWatermark);
    };
  }, []);

  return (
    <section className="footer-section">
      <style>{footerStyles}</style>
      <div className="footer-wrapper">
        <div className="footer-left">
          <video className="footer-left-video" autoPlay muted loop playsInline preload="auto">
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4"
              type="video/mp4"
            />
          </video>

          <div className="footer-logo">
            <div className="footer-logo-mark">P</div>
            <span className="footer-logo-name">PSXL</span>
          </div>

          <div className="footer-tagline-container">
            <p className="footer-tagline">
              Smarter sales automation,
              <br />
              <span>powered by AI.</span>
            </p>
          </div>

          <div className="footer-social-row">
            <span className="footer-social-label">Stay in touch!</span>
            <div className="footer-social-icons">
              {SOCIALS.map((item) => (
                <a key={item.label} className="social-icon" href={item.href} aria-label={item.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={item.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-lucky-graphic">
            <div className="lucky-cube">
              <span className="lucky-cube-mark">P</span>
            </div>
            <div className="lucky-text-row">
              <svg className="lucky-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 20 C 6 14, 10 9, 18 5" />
                <path d="M18 5 L 12 5" />
                <path d="M18 5 L 18 11" />
              </svg>
              <span className="lucky-text">Feeling lucky?</span>
            </div>
          </div>

          <div className="footer-right-top">
            <div className="footer-nav-cols">
              <div className="footer-col">
                <div className="footer-col-title">Navigation</div>
                <a href="/">How it works</a>
                <a href="/features">Features</a>
                <a href="/contact">Pricing</a>
                <a href="/">Testimonials</a>
                <a href="/">FAQ</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Company</div>
                <a href="/blog">Blog</a>
                <a href="/about">About</a>
                <a href="/terms">Terms and Condition</a>
                <a href="/privacy">Privacy Policy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">© 2026 PSXL. All rights reserved.</div>

            <div className="footer-cta-mini">
              <h4>
                AI moves fast.
                <br />
                <strong>Stay ahead with PSXL.</strong>
              </h4>

              <div className="footer-subscribe-row">
                <input type="email" placeholder="Enter email address" />
                <button type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-watermark" aria-hidden="true">
        <svg
          id="watermarkSvg"
          viewBox="62 95 876 175"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text id="watermarkText" x="500" y="240" textAnchor="middle" fontSize="320">
            PSXL
          </text>
        </svg>
      </div>
    </section>
  );
}
