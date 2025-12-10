/**
 * AuthProvider
 *
 * Provides authentication state and session management.
 * Session expires after 2 hours of inactivity.
 */

import React, { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext } from "./AuthTypes";

// Session duration: 2 hours in milliseconds
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;
const SESSION_KEY = "dragoncopilot_session";
const PASSWORD = "Dr@g0nAzYb18"; // The password to access the app

interface SessionData {
  authenticated: boolean;
  expiresAt: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Check session synchronously to prevent flash
const getInitialAuthState = (): boolean => {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      const session: SessionData = JSON.parse(sessionStr);
      if (session.authenticated && session.expiresAt > Date.now()) {
        return true;
      }
    }
  } catch {
    // Invalid session data
  }
  localStorage.removeItem(SESSION_KEY);
  return false;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize synchronously from localStorage to prevent flash
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(getInitialAuthState);
  // isLoading is always false since we check synchronously
  const isLoading = false;

  // Check session periodically
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        if (sessionStr) {
          const session: SessionData = JSON.parse(sessionStr);
          if (session.authenticated && session.expiresAt > Date.now()) {
            setIsAuthenticated(true);
            return;
          }
        }
      } catch {
        // Invalid session data
      }
      // Clear invalid/expired session
      localStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
    };

    // Check session periodically (every minute)
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === PASSWORD) {
      const session: SessionData = {
        authenticated: true,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  // Keyboard shortcut: Ctrl+Shift+L to logout (for testing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") {
        e.preventDefault();
        logout();
        window.location.reload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
