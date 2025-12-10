/**
 * useAuth hook
 *
 * Provides access to authentication context.
 */

import { useContext } from "react";
import { AuthContext } from "./AuthTypes";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
