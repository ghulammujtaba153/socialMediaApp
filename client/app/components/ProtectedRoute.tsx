'use client';  // Add this line

import React, { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';


interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading, isAuth } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth status
  }

  if (!isAuth) {
    return null; // Don't render anything if the user is not authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;
