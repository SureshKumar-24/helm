'use client';

/**
 * Auth Context
 * Global authentication state management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/lib/auth/authService';
import { getRefreshToken, getAccessToken } from '@/lib/auth/tokenStorage';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount if refresh token exists
  useEffect(() => {
    loadUser();
  }, []);

  // Automatic token refresh mechanism
  useEffect(() => {
    if (!user) return;

    // Check token expiration every 60 seconds
    const interval = setInterval(async () => {
      try {
        const accessToken = getAccessToken();
        
        if (!accessToken) return;

        // Decode JWT to check expiration (simple base64 decode)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expiresAt = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Refresh if token expires in less than 5 minutes (300000ms)
        if (timeUntilExpiry < 300000 && timeUntilExpiry > 0) {
          console.log('Token expiring soon, refreshing...');
          await authService.refreshToken();
        }
      } catch (err) {
        console.error('Token refresh check failed:', err);
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [user]);

  const loadUser = async () => {
    try {
      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        // Try to get current user with existing token
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      // Clear tokens if loading user fails
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);
    
    try {
      // Login and get tokens
      await authService.login(email, password);
      
      // Fetch user profile
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);
    
    try {
      // Register user
      await authService.register(email, password);
      
      // Auto-login after registration
      await login(email, password);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
