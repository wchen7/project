import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const Protected = ({ token, path, children }) => {
  // path is the public path of the parent route
  const location = useLocation();
  if (!token && (location.pathname !== path)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default Protected;
