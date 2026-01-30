import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ExperienceModeProvider } from "@/contexts/ExperienceModeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardLawyer from "./pages/DashboardLawyer";
import LegalAssistant from "./pages/LegalAssistant";
import Interact from "./pages/Interact";
import PublicInteract from "./pages/PublicInteract";
import Draft from "./pages/Draft";
import Chat from "./pages/Chat";
import Features from "./pages/Features";
import FeaturesOverview from "./pages/FeaturesOverview";
import FeatureAsk from "./pages/FeatureAsk";
import FeatureInteract from "./pages/FeatureInteract";
import FeatureDraft from "./pages/FeatureDraft";
import HowItWorks from "./pages/HowItWorks";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AiLegalAgent from "@/components/AiLegalAgent";
import PublicDashboard from "./pages/PublicDashboard";
import DashboardLayout from "@/components/DashboardLayout";
import AskInfo from "./pages/AskInfo";
import InteractInfo from "./pages/InteractInfo";
import DraftInfo from "./pages/DraftInfo";
import Security from "./pages/Security";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Agents from "./pages/Agents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ExperienceModeProvider>
      <SidebarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="relative">
                <Routes>
                  <Route path="/" element={<><Landing /><AiLegalAgent /></>} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/features-overview" element={<FeaturesOverview />} />
                  <Route path="/feature/ask" element={<FeatureAsk />} />
                  <Route path="/feature/interact" element={<FeatureInteract />} />
                  <Route path="/feature/draft" element={<FeatureDraft />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/ask-info" element={<AskInfo />} />
                  <Route path="/interact-info" element={<InteractInfo />} />
                  <Route path="/draft-info" element={<DraftInfo />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Public dashboard - no authentication required */}
                  <Route path="/public" element={<PublicDashboard />} />
                  <Route path="/public/assistant" element={<PublicDashboard><LegalAssistant /></PublicDashboard>} />
                  <Route path="/public/interact" element={<PublicDashboard><PublicInteract /></PublicDashboard>} />
                  <Route path="/public/draft" element={<PublicDashboard><Draft /></PublicDashboard>} />
                  <Route path="/public/agents" element={<PublicDashboard><Agents /></PublicDashboard>} />
                  <Route path="/public/chat" element={<PublicDashboard><Chat /></PublicDashboard>} />
                  <Route path="/public/ask" element={<Navigate to="/assistant" replace />} />
                  <Route path="/public/assistant" element={<Navigate to="/assistant" replace />} />

                  {/* Protected routes for authenticated users */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/lawyer" element={<ProtectedRoute><DashboardLawyer /></ProtectedRoute>} />
                  <Route path="/dashboard/public" element={<ProtectedRoute><DashboardLawyer /></ProtectedRoute>} />
                  <Route path="/dashboard/assistant" element={<ProtectedRoute><DashboardLayout><LegalAssistant /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/dashboard/ask" element={<Navigate to="/dashboard/assistant" replace />} />
                  <Route path="/dashboard/interact" element={<ProtectedRoute><DashboardLayout><Interact /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/dashboard/draft" element={<ProtectedRoute><DashboardLayout><Draft /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/dashboard/chat" element={<ProtectedRoute><DashboardLayout><Chat /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/dashboard/agents" element={<ProtectedRoute><DashboardLayout><Agents /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </SidebarProvider>
    </ExperienceModeProvider>
  </QueryClientProvider>
);

export default App;