import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(true);

  // Handle OAuth callback
  useEffect(() => {
    // Check if user is already logged in (from OAuth callback)
    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Check for hash fragment (OAuth callback)
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
      // Supabase handles the hash automatically, we just need to wait for auth state change
      // The user will be set by AuthContext, which will trigger the redirect above
      setTimeout(() => setCallbackLoading(false), 2000);
    } else {
      setCallbackLoading(false);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ 
      background: 'var(--chrome-bg)', 
      color: 'var(--text)' 
    }}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* OAuth Callback Loading */}
      {callbackLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--green)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '16px', color: 'var(--text2)', fontSize: '14px' }}>
            Completing sign in...
          </p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      )}
      
      {!callbackLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <p style={{ 
            fontSize: '13px',
            fontWeight: '300',
            color: 'var(--text-muted)',
            lineHeight: '1.6'
          }}>
            Your premium Pakistan Stock Exchange trading ledger
          </p>
        </div>

        {/* Card - Mobile responsive padding */}
        <div style={{ 
          padding: '24px 20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-card)',
          margin: '0 8px'
        }} className="sm:p-[40px] sm:m-0">
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '600',
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p style={{
              fontSize: '13px',
              fontWeight: '300',
              color: 'var(--text-muted)',
              lineHeight: '1.6'
            }}>
              {isLogin ? "Sign in to your trading ledger" : "Start tracking your PSX trades"}
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'var(--bg2)',
              border: '1px solid var(--border2)',
              fontSize: '13px',
              fontWeight: '400',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '24px'
            }}
            onClick={handleGoogleSignIn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg3)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg2)';
              e.currentTarget.style.borderColor = 'var(--border2)';
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative" style={{ marginBottom: '24px' }}>
            <div className="absolute inset-0 flex items-center">
              <div style={{ 
                width: '100%', 
                borderTop: '1px solid var(--border)' 
              }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span style={{
                background: 'var(--surface)',
                padding: '0 8px',
                color: 'var(--text3)',
                fontSize: '11px'
              }}>
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '400',
                  color: 'var(--text)',
                  marginBottom: '6px'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-field"
                  style={{ width: '100%' }}
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '400',
                color: 'var(--text)',
                marginBottom: '6px'
              }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '400',
                color: 'var(--text)',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text3)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '300',
            color: 'var(--text2)',
            marginTop: '24px'
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
      )}
    </div>
  );
}
