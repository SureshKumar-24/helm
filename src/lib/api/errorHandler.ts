/**
 * API Error Handler
 * Provides consistent error handling and transformation for API requests
 */

import axios from 'axios';

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

/**
 * Transform API errors into a consistent format
 */
export function handleApiError(error: unknown): ApiError {
  // Log error for debugging
  console.error('API Error:', error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const detail = error.response?.data?.detail || error.message;

    switch (status) {
      case 400:
        return {
          status,
          message: 'Invalid request',
          detail,
        };
      case 401:
        return {
          status,
          message: 'Authentication required',
          detail,
        };
      case 404:
        return {
          status,
          message: 'Resource not found',
          detail,
        };
      case 429:
        return {
          status,
          message: 'Too many requests. Please try again later.',
          detail,
        };
      case 500:
        return {
          status,
          message: 'Server error. Please try again.',
          detail,
        };
      default:
        return {
          status,
          message: 'An error occurred',
          detail,
        };
    }
  }

  // Handle non-axios errors
  return {
    status: 500,
    message: 'Unknown error occurred',
    detail: String(error),
  };
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 429;
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401;
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  return apiError.detail || apiError.message;
}

/**
 * Check if error is a network error (transient)
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK');
  }
  return false;
}

/**
 * Check if user is offline
 */
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors or client errors
      if (isAuthError(error) || (axios.isAxiosError(error) && error.response?.status && error.response.status < 500)) {
        throw error;
      }
      
      // Don't retry if offline
      if (isOffline()) {
        throw new Error('You are offline. Please check your internet connection.');
      }
      
      // Only retry on network errors or server errors
      if (!isNetworkError(error) && !(axios.isAxiosError(error) && error.response?.status && error.response.status >= 500)) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
