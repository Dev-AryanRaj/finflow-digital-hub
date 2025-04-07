
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/customer/DashboardPage";
import TellerDashboardPage from "./pages/teller/TellerDashboardPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import AccountsPage from "./pages/AccountsPage";
import AccountDetailsPage from "./pages/customer/AccountDetailsPage";
import HealthCheckPage from "./pages/system/HealthCheckPage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import DatabaseConnectionError from "./components/common/DatabaseConnectionError";
import { checkDatabaseConnection } from "@/lib/mongodb";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
        path="/health" 
        element={
          <MainLayout>
            <HealthCheckPage />
          </MainLayout>
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
        path="/accounts/:accountId" 
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <MainLayout>
              <AccountDetailsPage />
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
              <AccountSettingsPage />
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

const App = () => {
  const [dbStatus, setDbStatus] = useState<{
    checking: boolean;
    connected: boolean;
    error?: string;
  }>({
    checking: true,
    connected: false,
  });

  useEffect(() => {
    const checkDb = async () => {
      try {
        console.log("Checking database connection on app start...");
        
        // Always set connected to true in browser environment
        if (typeof window !== 'undefined') {
          setDbStatus({
            checking: false,
            connected: true
          });
          console.log("Browser environment detected, skipping actual DB check");
          return;
        }
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database connection check timed out')), 5000);
        });
        
        const connectionPromise = checkDatabaseConnection();
        
        const result = await Promise.race([
          connectionPromise,
          timeoutPromise
        ]) as any;
        
        setDbStatus({
          checking: false,
          connected: result.status === 'connected',
          error: result.error,
        });
        console.log("Database connection check result:", result);
      } catch (error) {
        console.error("Error checking database:", error);
        // In browser environment, don't show DB errors
        if (typeof window !== 'undefined') {
          setDbStatus({
            checking: false,
            connected: true
          });
        } else {
          setDbStatus({
            checking: false,
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error checking database',
          });
        }
      }
    };

    checkDb();
  }, []);

  if (dbStatus.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bank-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to database...</p>
        </div>
      </div>
    );
  }

  // For browser environment, always render routes regardless of db status
  if (typeof window !== 'undefined') {
    return (
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </UserProvider>
      </QueryClientProvider>
    );
  }

  // Original server-side logic
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <BrowserRouter>
            {typeof window !== 'undefined' && !dbStatus.connected && (window as Window).location.pathname !== '/health' ? (
                <Routes>
                  <Route path="/health" element={
                    <MainLayout>
                      <HealthCheckPage />
                    </MainLayout>
                  } />
                  <Route path="*" element={
                    <DatabaseConnectionError 
                      message={dbStatus.error}
                      onRetry={() => window.location.reload()}
                    />
                  } />
                </Routes>
              ) : (
                <AppRoutes />
              )}
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
