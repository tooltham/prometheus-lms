import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute — Auth Guard component
 * Redirects to /login if no valid token is found in localStorage.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;
