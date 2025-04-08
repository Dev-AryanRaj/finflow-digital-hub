
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/customer/DashboardPage";
import TellerDashboardPage from "./pages/teller/TellerDashboardPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import AccountsPage from "./pages/customer/AccountsPage";
import DepositsPage from "./pages/customer/DepositsPage";
import BillPaymentsPage from "./pages/customer/BillPaymentsPage";
import SupportPage from "./pages/SupportPage";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'CUSTOMER' | 'TELLER';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bank-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bank-primary"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const LogoutPage = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Logging out...</div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useUser();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout>
              {user?.role === 'TELLER' ? <TellerDashboardPage /> : <DashboardPage />}
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute requiredRole="TELLER">
            <MainLayout>
              <div>Customer Management</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/approvals" 
        element={
          <ProtectedRoute requiredRole="TELLER">
            <MainLayout>
              <div>Approvals Page</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute requiredRole="TELLER">
            <MainLayout>
              <div>Analytics Dashboard</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/accounts" 
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <MainLayout>
              <AccountsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <TransactionsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/deposits" 
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <MainLayout>
              <DepositsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/bills" 
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <MainLayout>
              <BillPaymentsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/support" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <SupportPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AccountSettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/logout" 
        element={<LogoutPage />} 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const isBrowser = typeof window !== 'undefined';
  
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
