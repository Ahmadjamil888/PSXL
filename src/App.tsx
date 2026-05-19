import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GuestProvider, useGuest } from "@/contexts/GuestContext";
import { AIProvider } from "@/contexts/AIContext";
import { DisciplineProvider } from "@/contexts/DisciplineContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import AppLayout from "@/components/AppLayout";
import PublicLayout from "@/components/PublicLayout";
import { ThemeProvider } from "@/components/theme-provider";
import RouteSeo from "@/components/RouteSeo";
import GuestBanner from "@/components/GuestBanner";
import UpgradeModal from "@/components/UpgradeModal";
import AuthPage from "@/pages/Auth";
import Landing from "@/pages/home";
import AboutPage from "@/pages/About";
import PrivacyPage from "@/pages/Privacy";
import ContactPage from "@/pages/Contact";
import FeaturesPage from "@/pages/Features";
import SecurityPage from "@/pages/Security";
import CareersPage from "@/pages/Careers";
import TermsPage from "@/pages/Terms";
import DisclaimerPage from "@/pages/Disclaimer";
import AnalyticsInfoPage from "@/pages/AnalyticsInfo";
import BlogPage from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Analytics from "@/pages/Analytics";
import Psychology from "@/pages/Psychology";
import Companies from "@/pages/Companies";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isGuest, enterGuestMode } = useGuest();
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get("mode") === "guest" && !isGuest) enterGuestMode();
  }, [params, isGuest, enterGuestMode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  if (isGuest || params.get("mode") === "guest") {
    return (
      <AppLayout>
        <GuestBanner />
        {children}
        <UpgradeModal />
      </AppLayout>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return <AuthPage />;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <DynamicFavicon />
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <RouteSeo />
            <AuthProvider>
              <GuestProvider>
                <AIProvider>
                  <DisciplineProvider>
                    <ChatProvider>
                      <Routes>
                      <Route
                        path="/"
                        element={
                          <PublicLayout>
                            <Landing />
                          </PublicLayout>
                        }
                      />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/disclaimer" element={<DisclaimerPage />} />
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/security" element={<SecurityPage />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/analytics-info" element={<AnalyticsInfoPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogPostPage />} />

                      <Route path="/auth" element={<AuthRoute />} />
                      <Route path="/auth/callback" element={<AuthPage />} />

                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/journal"
                        element={
                          <ProtectedRoute>
                            <Journal />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/performance"
                        element={
                          <ProtectedRoute>
                            <Analytics />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/psychology"
                        element={
                          <ProtectedRoute>
                            <Psychology />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/companies"
                        element={
                          <ProtectedRoute>
                            <Companies />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ChatProvider>
                  </DisciplineProvider>
                </AIProvider>
              </GuestProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
