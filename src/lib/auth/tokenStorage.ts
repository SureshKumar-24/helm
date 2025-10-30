/**
 * Token Storage Service
 * Manages secure storage of authentication tokens
 * - Access tokens stored in memory (module-level variable)
 * - Refresh tokens stored in localStorage
 */

const REFRESH_TOKEN_KEY = 'helm_refresh_token';

// Store access token in memory (cleared on page refresh)
let accessToken: string | null = null;

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Store both access and refresh tokens
 */
export function setTokens(newAccessToken: string, newRefreshToken: string): void {
  // Store access token in memory
  accessToken = newAccessToken;
  
  // Store refresh token in localStorage
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }
}

/**
 * Get the current access token from memory
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Get the refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error);
    return null;
  }
}

/**
 * Clear all tokens from storage
 */
export function clearTokens(): void {
  // Clear access token from memory
  accessToken = null;
  
  // Clear refresh token from localStorage
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
  }
}

/**
 * Check if tokens exist
 */
export function hasTokens(): boolean {
  return accessToken !== null || getRefreshToken() !== null;
}

export const TokenStorage = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  hasTokens,
};
