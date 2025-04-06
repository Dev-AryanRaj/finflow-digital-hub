
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { isAuthenticated, user } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Based on role, redirect to the appropriate dashboard
  if (user?.role === 'TELLER') {
    return <Navigate to="/" />;
  } else {
    return <Navigate to="/" />;
  }
};

export default Index;
