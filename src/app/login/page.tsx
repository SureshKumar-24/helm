'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/lib/auth/validation';
import { getRememberMePreference, getRememberedEmail } from '@/lib/auth/tokenStorage';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load remembered email and checkbox state on mount
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    const rememberMePref = getRememberMePreference();
    
    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
    
    if (rememberMePref) {
      setRememberMe(true);
    }

    // Check for password reset success
    const resetSuccess = searchParams.get('reset');
    if (resetSuccess === 'success') {
      setShowResetSuccess(true);
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowResetSuccess(false);
      }, 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A3D62] via-[#0f5280] to-[#0A3D62] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    setValidationErrors({});
    setLoginError(null);

    // Frontend validation
    const errors: Record<string, string> = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors[0];
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password, rememberMe);

      // Only navigate if login was successful (no error thrown)
      const returnUrl = sessionStorage.getItem('returnUrl') || '/dashboard';
      sessionStorage.removeItem('returnUrl');

      router.push(returnUrl);
    } catch (err) {
      // Display error to user - don't navigate
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed. Please check your credentials and try again.';
      setLoginError(errorMessage);
      console.error('Login error:', err);
      // Explicitly prevent any navigation
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A3D62] via-[#0f5280] to-[#0A3D62] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22C55E] via-[#3B82F6] to-[#8B5CF6]" />

          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0A3D62] to-[#0f5280] rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl text-white">⎈</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Welcome Back</h1>
            <p className="text-gray-600 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-[#22C55E]" />
              Continue your financial journey
            </p>
          </div>

          {/* Password reset success message */}
          {showResetSuccess && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Password reset successful!</p>
                <p className="text-sm text-green-700 mt-1">You can now log in with your new password.</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {loginError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{loginError}</p>
            </div>
          )}

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationErrors(prev => ({ ...prev, email: '' }));
                    setLoginError(null);
                  }}
                  disabled={isSubmitting}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent transition-all outline-none ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                    setLoginError(null);
                  }}
                  disabled={isSubmitting}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent transition-all outline-none ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#0A3D62] border-gray-300 rounded focus:ring-[#0A3D62] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#0A3D62] hover:text-[#083048] transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A3D62] to-[#0f5280] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-gray-500 rounded-md">Or continue with</span>
            </div>
          </div>

          {/* Social login button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition hover:scale-[1.02] active:scale-[0.98] bg-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#0A3D62] hover:text-[#083048] transition"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0A3D62] via-[#0f5280] to-[#0A3D62] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}






