
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { LeadsProvider } from "@/contexts/LeadsContext";
import { PropertyProvider } from "@/contexts/PropertyContext";
import Layout from "@/components/layout/Layout";

// Pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import Upload from "@/pages/Upload";
import Leads from "@/pages/Leads";
import Properties from "@/pages/Properties";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirects authenticated users)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    } />
    <Route path="/login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } />
    <Route path="/admin-login" element={
      <PublicRoute>
        <AdminLogin />
      </PublicRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/leads" element={
      <ProtectedRoute>
        <Leads />
      </ProtectedRoute>
    } />
    <Route path="/properties" element={
      <ProtectedRoute>
        <Properties />
      </ProtectedRoute>
    } />
    <Route path="/upload" element={
      <ProtectedRoute>
        <Upload />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PropertyProvider>
            <LeadsProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </LeadsProvider>
          </PropertyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
