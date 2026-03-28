import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GuestProvider, useGuest } from "@/contexts/GuestContext";
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
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Analytics from "@/pages/Analytics";
import Companies from "@/pages/Companies";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Enters guest mode when ?mode=guest is in the URL
function GuestModeActivator() {
  const [params] = useSearchParams();
  const { enterGuestMode, isGuest } = useGuest();
  useEffect(() => {
    if (params.get("mode") === "guest" && !isGuest) enterGuestMode();
  }, [params, enterGuestMode, isGuest]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isGuest } = useGuest();

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Allow guest mode through
  if (isGuest) return (
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
              <GuestModeActivator />
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/analytics-info" element={<AnalyticsInfoPage />} />
                {/* Auth */}
                <Route path="/auth" element={<AuthRoute />} />
                <Route path="/auth/callback" element={<AuthPage />} />
                {/* App — accessible to both authed users and guests */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GuestProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
