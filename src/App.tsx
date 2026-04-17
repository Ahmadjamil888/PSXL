import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GuestProvider, useGuest } from "@/contexts/GuestContext";
import { AIProvider } from "@/contexts/AIContext";
import { DisciplineProvider } from "@/contexts/DisciplineContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ThemeProvider } from "@/components/theme-provider";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import AppLayout from "@/components/AppLayout";
import PublicLayout from "@/components/PublicLayout";
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

// Guest mode is activated inside ProtectedRoute when ?mode=guest is detected

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isGuest, enterGuestMode } = useGuest();
  const [params] = useSearchParams();

  // Activate guest mode immediately if ?mode=guest is present
  useEffect(() => {
    if (params.get("mode") === "guest" && !isGuest) enterGuestMode();
  }, [params, isGuest, enterGuestMode]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Allow guest mode through
  if (isGuest || params.get("mode") === "guest") return (
    <AppLayout>
      <GuestBanner />
      {children}
      <UpgradeModal />
    </AppLayout>
  );

  if (!user) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return <AuthPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="psx-theme">
      <DynamicFavicon />
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <GuestProvider>
              <AIProvider>
                <DisciplineProvider>
                  <ChatProvider>
                    <Routes>
                {/* Public pages */}
                <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
                <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
                <Route path="/disclaimer" element={<PublicLayout><DisclaimerPage /></PublicLayout>} />
                <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
                <Route path="/security" element={<PublicLayout><SecurityPage /></PublicLayout>} />
                <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
                <Route path="/analytics-info" element={<PublicLayout><AnalyticsInfoPage /></PublicLayout>} />
                <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
                <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
                {/* Auth */}
                <Route path="/auth" element={<AuthRoute />} />
                <Route path="/auth/callback" element={<AuthPage />} />
                {/* App — accessible to both authed users and guests */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/psychology" element={<ProtectedRoute><Psychology /></ProtectedRoute>} />
                <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ChatProvider>
            </DisciplineProvider>
          </AIProvider>
        </GuestProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
</ThemeProvider>
</QueryClientProvider>
);

export default App;
