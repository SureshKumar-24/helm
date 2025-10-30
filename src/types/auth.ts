/**
 * Authentication Type Definitions
 * Centralized type definitions for authentication-related interfaces
 */

/**
 * User model representing an authenticated user
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's role (user or admin) */
  role: 'user' | 'admin';
  /** Whether the user account is active */
  is_active: boolean;
  /** Account creation timestamp */
  created_at: string;
}

/**
 * Token response from authentication endpoints
 */
export interface TokenResponse {
  /** Short-lived access token (30 minutes) */
  access_token: string;
  /** Long-lived refresh token (7 days) */
  refresh_token: string;
  /** Token type (always 'bearer') */
  token_type: 'bearer';
}

/**
 * Authentication context value provided to components
 */
export interface AuthContextValue {
  /** Current authenticated user or null */
  user: User | null;
  /** Whether authentication state is being loaded */
  loading: boolean;
  /** Error message from last authentication operation */
  error: string | null;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
  /** Login with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Register a new user account */
  register: (email: string, password: string) => Promise<void>;
  /** Logout the current user */
  logout: () => void;
}

/**
 * Validation result from form validation
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Array of error messages */
  errors: string[];
}

/**
 * Password strength assessment
 */
export interface PasswordStrength {
  /** Strength score from 0 (very weak) to 4 (strong) */
  score: number;
  /** Feedback messages for improving password strength */
  feedback: string[];
}

/**
 * API error response format
 */
export interface ApiError {
  /** Error detail message or validation errors */
  detail: string | ValidationError[];
}

/**
 * Validation error from API
 */
export interface ValidationError {
  /** Error type */
  type: string;
  /** Location of the error in the request */
  loc: string[];
  /** Error message */
  msg: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Token refresh request payload
 */
export interface RefreshTokenRequest {
  /** Refresh token to exchange for new tokens */
  refresh_token: string;
}

/**
 * Protected route component props
 */
export interface ProtectedRouteProps {
  /** Child components to render when authenticated */
  children: React.ReactNode;
  /** Path to redirect to when not authenticated */
  redirectTo?: string;
  /** Fallback component to show while loading */
  fallback?: React.ReactNode;
}
