import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/customer/DashboardPage";
import TellerDashboardPage from "./pages/teller/TellerDashboardPage";

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
              <div>Accounts Page</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <div>Transactions History</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/deposits" 
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <MainLayout>
              <div>Deposits Management</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/bills" 
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <MainLayout>
              <div>Bill Payments</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/support" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <div>Support Center</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <div>Account Settings</div>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/logout" 
        element={<div>Logging out...</div>} 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
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

export default App;
