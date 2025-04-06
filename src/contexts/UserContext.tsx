
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../models/User';
import { authenticateUser, findUserByEmail } from '../services/userService';

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

  // Check if user session exists on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check a JWT token or session cookie
        const storedUser = localStorage.getItem('bankapp_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify user still exists in database
          const dbUser = await findUserByEmail(parsedUser.email);
          if (dbUser) {
            setUser(dbUser);
          } else {
            // User no longer exists in DB, clear local storage
            localStorage.removeItem('bankapp_user');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authenticateUser({ email, password });
      if (authenticatedUser) {
        setUser(authenticatedUser);
        // Store user in local storage for persistence
        localStorage.setItem('bankapp_user', JSON.stringify(authenticatedUser));
      } else {
        throw new Error('Invalid credentials');
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
      // For now we just simulate success with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Google login not implemented yet');
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bankapp_user');
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
