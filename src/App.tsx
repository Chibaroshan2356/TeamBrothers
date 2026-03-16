import { ToastProvider } from "@/components/ui/saas-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Layout } from "@/components/layout/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Index from "./pages/Index";
import Fleet from "./pages/Fleet";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import CompareVehicles from "./pages/CompareVehicles";
import TripDetails from "./pages/TripDetails";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";

// Component to handle authentication redirects
const AuthWrapper = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, isAdmin } = useApp();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin access is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

/**
 * TravelEase Vehicle Rental Application
 * 
 * A comprehensive vehicle rental web app featuring:
 * - Home page with hero, trip types, and featured vehicles
 * - Fleet page with filtering and search
 * - Smart recommendation system with explainable AI
 * - Booking/enquiry form with cost estimation
 * - Admin dashboard for managing enquiries and availability
 * - Contact page with WhatsApp integration
 * 
 * Architecture:
 * - React + TypeScript + Vite
 * - Tailwind CSS for styling
 * - Context API for state management
 * - React Router for navigation
 * - Zod for form validation
 */
const App = () => {
  const { isAuthenticated, isAdmin } = useApp();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Root redirect to login */}
              <Route index element={<Navigate to="/login" replace />} />
              
              {/* Public Routes */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              
              {/* Routes with Layout */}
              <Route element={
                <Layout>
                  <Outlet />
                </Layout>
              }>
                <Route path="home" element={<Index />} />
                <Route path="fleet" element={<Fleet />} />
                <Route path="compare-vehicles" element={<CompareVehicles />} />
                <Route path="contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route element={<AuthWrapper><Outlet /></AuthWrapper>}>
                  <Route path="booking" element={<Booking />} />
                  <Route path="dashboard" element={<Dashboard />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Route>
            
              {/* Protected Admin Route */}
              <Route 
                path="admin" 
                element={
                  <AuthWrapper requireAdmin>
                    <Layout>
                      <Admin />
                    </Layout>
                  </AuthWrapper>
                }
              />
              
              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
