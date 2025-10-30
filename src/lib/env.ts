/**
 * Environment Configuration and Validation
 * Validates required environment variables on app start
 */

export function validateEnvironment(): void {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Warn if using HTTP in production
  if (process.env.NODE_ENV === 'production' && 
      process.env.NEXT_PUBLIC_API_BASE_URL?.startsWith('http://')) {
    console.warn('⚠️  WARNING: Using HTTP in production. Use HTTPS for security.');
  }
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  tokenRefreshThreshold: parseInt(process.env.NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD || '300000', 10),
} as const;
