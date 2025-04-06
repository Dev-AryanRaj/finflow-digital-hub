
import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // For development only - simulate authentication check
  useEffect(() => {
    // Simulate API call to check authentication
    const checkAuth = async () => {
      try {
        // Simulate delay for API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For development, set the user or leave as null
        // In production, this would check with your backend
        setUser(mockCustomer);
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
      
      // Mock login logic
      if (email === 'admin@finflow.com') {
        setUser(mockTeller);
      } else {
        setUser(mockCustomer);
      }
    } catch (error) {
      console.error('Login failed:', error);
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
      setUser(mockCustomer);
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
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
