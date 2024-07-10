// utils/auth.ts
export const isAuthenticated = () => {
    
    const token = localStorage.getItem('token');
    return !!token; // Check if the token exists
  };
  