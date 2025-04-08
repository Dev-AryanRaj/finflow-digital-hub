
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'CUSTOMER' | 'TELLER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileUrl?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Store user data in localStorage
const USER_STORAGE_KEY = 'finflow-user';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock user data for development
  const mockCustomer: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'CUSTOMER',
    profileUrl: 'https://i.pravatar.cc/150?u=john.doe@example.com'
  };

  const mockTeller: User = {
    id: '2',
    name: 'Admin User',
    email: 'admin@finflow.com',
    role: 'TELLER',
    profileUrl: 'https://i.pravatar.cc/150?u=admin@finflow.com'
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let userToSet;
      
      // For now, any email with "admin" or "teller" will log in as teller role
      if (email.includes('admin') || email.includes('teller')) {
        // Set custom name if email is not the default
        userToSet = {
          ...mockTeller,
          email,
          name: email !== mockTeller.email ? email.split('@')[0] : mockTeller.name
        };
      } else {
        // Set custom name if email is not the default
        userToSet = {
          ...mockCustomer,
          email,
          name: email !== mockCustomer.email ? email.split('@')[0] : mockCustomer.name
        };
      }
      
      // Store in localStorage for persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSet));
      setUser(userToSet);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userToSet.name}!`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // This would integrate with the Google OAuth flow
      // For now we just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockCustomer));
      setUser(mockCustomer);
      
      toast({
        title: "Google login successful",
        description: `Welcome back, ${mockCustomer.name}!`,
      });
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: "Please try again later.",
      });
      throw new Error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithGoogle,
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
