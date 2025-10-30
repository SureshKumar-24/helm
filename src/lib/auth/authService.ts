/**
 * Auth Service
 * High-level authentication operations
 */

import apiClient from '../api/client';
import { setTokens, clearTokens, getRefreshToken } from './tokenStorage';

export interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export async function register(email: string, password: string): Promise<User> {
  const response = await apiClient.post<User>('/api/v1/auth/register', {
    email,
    password,
  });
  
  return response.data;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/api/v1/auth/login', {
    email,
    password,
  });
  
  const { access_token, refresh_token, token_type } = response.data;
  
  // Store tokens
  setTokens(access_token, refresh_token);
  
  return response.data;
}

/**
 * Logout - clear tokens
 */
export function logout(): void {
  clearTokens();
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/api/v1/auth/me');
  return response.data;
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<TokenResponse> {
  const refreshTokenValue = getRefreshToken();
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post<TokenResponse>('/api/v1/auth/refresh', {
    refresh_token: refreshTokenValue,
  });
  
  const { access_token, refresh_token: newRefreshToken } = response.data;
  
  // Update stored tokens
  setTokens(access_token, newRefreshToken);
  
  return response.data;
}

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
};
