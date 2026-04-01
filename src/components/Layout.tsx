import { useState, useEffect } from "react";
import { Menu, X, Twitter, Github, Linkedin } from "lucide-react";
import Logo from "@/components/Logo";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#psxl-features", label: "Features" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b transition-colors duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-sm border-border" : "bg-transparent border-transparent"
        }`}
      >
        <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Logo height={32} />
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-xs font-medium uppercase tracking-wider px-4 py-2 border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            Log In
          </a>
          <a href="/login" className="text-xs font-medium uppercase tracking-wider px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Get Started
          </a>
        </div>

        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="fixed top-14 left-0 right-0 bg-background border-b border-border z-40 md:hidden">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block py-3 text-sm font-medium text-foreground border-b border-border last:border-0" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <a href="/login" className="block w-full text-center text-xs font-medium uppercase tracking-wider px-4 py-3 border border-border rounded-md text-muted-foreground">Log In</a>
              <a href="/login" className="block w-full text-center text-xs font-medium uppercase tracking-wider px-4 py-3 bg-primary text-primary-foreground rounded-md">Get Started</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const links = {
    Product: ["Features", "Analytics"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Security"],
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo height={32} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The ultimate ledger platform for PSX traders. Professional-grade analytics and portfolio management.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-muted-foreground">© 2025 PSX Ledger Pro. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
