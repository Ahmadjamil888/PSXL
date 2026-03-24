import { useTheme } from "@/components/theme-provider";

const Logo = ({ className = "" }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <div className={`nav-logo ${className}`} style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      fontSize: '20px',
      fontWeight: '700',
      letterSpacing: '-0.5px',
      color: 'var(--logo-text)',
      textDecoration: 'none'
    }}>
      <span className="psx">PSX</span>
      <span className="l-mark" style={{
        display: 'inline-block',
        width: '14px',
        height: '28px',
        position: 'relative',
        marginLeft: '1px'
      }}>
        <svg viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '14px', height: '28px' }}>
          <path d="M10 2 C10 2, 8 8, 7 14 C6 20, 7.5 24, 11 26" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </span>
    </div>
  );
};

export default Logo;
