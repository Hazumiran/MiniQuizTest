import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const ProtectedRoute = ({ children } : { children: JSX.Element }) => {
  const token = secureLocalStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
