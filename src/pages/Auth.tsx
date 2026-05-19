import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest, getGuestTradesForMigration } from "@/contexts/GuestContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import EmotionalOnboarding from "@/components/EmotionalOnboarding";
import { useNavigate, Link } from "react-router-dom";

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { clearGuestData, exitGuestMode } = useGuest();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const migrateAndRedirect = async (userId: string) => {
    const guestTrades = getGuestTradesForMigration();
    if (guestTrades.length > 0) {
      try {
        const rows = guestTrades.map((t) => ({
          user_id: userId,
          symbol: t.symbol,
          side: t.side,
          quantity: t.quantity,
          entry_price: t.entry_price,
          exit_price: t.exit_price ?? null,
          fees: t.fees ?? 0,
          note: t.note ?? null,
          date: t.date ?? new Date().toISOString().split("T")[0],
        }));
        await supabase.from("trades").insert(rows);
        clearGuestData();
        exitGuestMode();
        toast.success(
          `Saved ${guestTrades.length} guest trade${
            guestTrades.length > 1 ? "s" : ""
          } to your account.`,
        );
      } catch {
        toast.error("Couldn't migrate guest trades. Please review them manually.");
      }
    } else {
      exitGuestMode();
    }
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    if (user) {
      migrateAndRedirect(user.id);
      return;
    }
    const hash = window.location.hash;
    if (hash && (hash.includes("access_token") || hash.includes("refresh_token"))) {
      setTimeout(() => setCallbackLoading(false), 2000);
    } else {
      setCallbackLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast.success("Account created. Check your email to verify.");
        setShowOnboarding(true);
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

  const handleOnboardingComplete = async (data: any) => {
    console.log("Onboarding data:", data);
    toast.success("Onboarding completed.");
    setShowOnboarding(false);
    if (user) {
      await migrateAndRedirect(user.id);
    }
  };

  const handleOnboardingSkip = async () => {
    setShowOnboarding(false);
    if (user) {
      await migrateAndRedirect(user.id);
    }
  };

  return (
    <div className="brand-shell min-h-screen px-4 py-6 md:px-6 md:py-8">
      {callbackLoading ? (
        <div className="flex min-h-[80vh] items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="brand-panel flex w-full max-w-sm flex-col items-center rounded-[28px] px-8 py-10 text-center"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
            <p className="mt-4 text-sm text-white/58">Completing sign in...</p>
          </motion.div>
        </div>
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1440px] gap-4 lg:min-h-[calc(100vh-4rem)]">
          <section className="relative hidden w-[48%] overflow-hidden rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(159,232,112,0.18),transparent_30%),linear-gradient(180deg,#121212_0%,#090909_100%)] p-10 shadow-[0_28px_90px_rgba(0,0,0,0.32)] lg:flex lg:flex-col lg:justify-between">
            <div>
              <Logo height={34} />
              <div className="mt-20 max-w-md">
                <p className="page-kicker">PSXL Access</p>
                <h1 className="mt-4 font-display text-[56px] font-medium leading-[0.95] tracking-[-0.06em] text-white">
                  Trade clarity,
                  <br />
                  without the noise.
                </h1>
                <p className="mt-6 text-[15px] leading-8 text-white/58">
                  Log trades, review behavior, and build a cleaner investing
                  process tailored for Pakistan Stock Exchange traders.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                "Structured trade journaling with chart attachments.",
                "Behavioral review tools built around discipline.",
                "PSX-specific reporting and portfolio insight.",
              ].map((item) => (
                <div
                  key={item}
                  className="brand-panel-soft flex items-center gap-3 rounded-[20px] px-4 py-4"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <p className="text-sm text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[540px]"
            >
              <div className="brand-panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-9">
                <div className="mb-8 text-center">
                  <div className="flex justify-center lg:hidden">
                    <Logo height={30} />
                  </div>
                  <p className="page-kicker mt-5">{isLogin ? "Welcome Back" : "Create Account"}</p>
                  <h2 className="mt-3 font-display text-[36px] font-medium tracking-[-0.05em] text-white">
                    {isLogin ? "Access your ledger" : "Join PSXL"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {isLogin
                      ? "Sign in to continue refining your process."
                      : "Start tracking trades with a cleaner operating system."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="border-t border-white/8" />
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--bg-card)] px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/34">
                    Or
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="input-field w-full"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/28" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="input-field w-full pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field w-full pr-11"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/34 transition-colors hover:text-white/70"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary mt-2 w-full" disabled={loading}>
                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "Sign In"
                        : "Create Account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-white/50">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-semibold text-[var(--brand)] transition-opacity hover:opacity-80"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>

                <div className="my-6 border-t border-white/8" />

                <Link
                  to="/dashboard?mode=guest"
                  className="btn-secondary w-full"
                >
                  <Zap className="h-4 w-4 text-[var(--brand)]" />
                  Try as Guest
                </Link>
                <p className="mt-3 text-center text-xs text-white/34">
                  Start tracking instantly. Your guest data stays local until you
                  choose to save it.
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      )}

      {showOnboarding && (
        <EmotionalOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}
