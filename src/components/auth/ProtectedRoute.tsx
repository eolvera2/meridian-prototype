/**
 * ProtectedRoute Component
 *
 * Wraps routes to require authentication before accessing.
 */

import React, { type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { PasswordScreen } from "./PasswordScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking auth to prevent flash
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <PasswordScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
