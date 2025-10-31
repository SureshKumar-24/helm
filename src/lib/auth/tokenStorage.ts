/**
 * Token Storage Service
 * Manages secure storage of authentication tokens
 * - Access tokens stored in memory (module-level variable)
 * - Refresh tokens stored in localStorage (remember me) or sessionStorage (session only)
 */

const REFRESH_TOKEN_KEY = 'helm_refresh_token';
const REMEMBER_ME_KEY = 'helm_remember_me';
const REMEMBERED_EMAIL_KEY = 'helm_remembered_email';

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
  } catch {
    return false;
  }
}

/**
 * Check if sessionStorage is available
 */
function isSessionStorageAvailable(): boolean {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Store both access and refresh tokens
 */
export function setTokens(newAccessToken: string, newRefreshToken: string, rememberMe: boolean = false, email?: string): void {
  // Store access token in memory
  accessToken = newAccessToken;

  // Store refresh token based on remember me preference
  if (rememberMe && isLocalStorageAvailable()) {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
      // Store email if provided
      if (email) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      }
      // Clear from sessionStorage if it exists
      if (isSessionStorageAvailable()) {
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to store refresh token in localStorage:', error);
    }
  } else if (isSessionStorageAvailable()) {
    try {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      // Clear from localStorage if it exists
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        // Don't clear remember me preference and email when not using remember me
        // This allows the checkbox and email to persist
      }
    } catch (error) {
      console.error('Failed to store refresh token in sessionStorage:', error);
    }
  }
}

/**
 * Set remember me preference and email
 */
export function setRememberMePreference(rememberMe: boolean, email?: string): void {
  if (!isLocalStorageAvailable()) return;

  try {
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
      if (email) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      }
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  } catch (error) {
    console.error('Failed to set remember me preference:', error);
  }
}

/**
 * Get remember me preference
 */
export function getRememberMePreference(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  } catch (error) {
    console.error('Failed to get remember me preference:', error);
    return false;
  }
}

/**
 * Get remembered email
 */
export function getRememberedEmail(): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY);
  } catch (error) {
    console.error('Failed to get remembered email:', error);
    return null;
  }
}

/**
 * Get the current access token from memory
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Get the refresh token from storage (localStorage or sessionStorage)
 */
export function getRefreshToken(): string | null {
  // Try localStorage first (remember me)
  if (isLocalStorageAvailable()) {
    try {
      const token = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (token) return token;
    } catch (error) {
      console.error('Failed to retrieve refresh token from localStorage:', error);
    }
  }

  // Try sessionStorage (session only)
  if (isSessionStorageAvailable()) {
    try {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token from sessionStorage:', error);
    }
  }

  return null;
}

/**
 * Clear all tokens from storage (but keep remember me preference and email)
 */
export function clearTokens(): void {
  // Clear access token from memory
  accessToken = null;

  // Clear refresh token from localStorage (but keep remember me preference and email)
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      // Don't remove REMEMBER_ME_KEY and REMEMBERED_EMAIL_KEY
      // This allows the preference to persist across logout
    } catch (error) {
      console.error('Failed to clear tokens from localStorage:', error);
    }
  }

  // Clear refresh token from sessionStorage
  if (isSessionStorageAvailable()) {
    try {
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens from sessionStorage:', error);
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
  setRememberMePreference,
  getRememberMePreference,
  getRememberedEmail,
};
