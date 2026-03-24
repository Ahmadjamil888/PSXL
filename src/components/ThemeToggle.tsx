import { useTheme } from "@/components/theme-provider";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div 
      className="toggle" 
      onClick={toggleTheme}
      title="Toggle theme"
      style={{
        width: '40px',
        height: '22px',
        background: 'var(--border2)',
        borderRadius: '11px',
        position: 'relative',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        transition: 'background 0.3s'
      }}
    >
      <div
        style={{
          content: '',
          position: 'absolute',
          top: '2px',
          left: theme === 'light' ? '2px' : '20px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'var(--green)',
          transition: 'transform 0.3s'
        }}
      />
    </div>
  );
};

export default ThemeToggle;
