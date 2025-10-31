'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Sparkles, ArrowRight, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  checkPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/lib/auth/validation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [registerError, setRegisterError] = useState<string | null>(null);

  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const passwordStrength = checkPasswordStrength(password);
  const passwordValidation = validatePassword(password);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#22C55E] via-[#0A3D62] to-[#8B5CF6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    setValidationErrors({});
    setRegisterError(null);

    // Frontend validation
    const errors: Record<string, string> = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors[0];
    }

    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    const matchValidation = validatePasswordMatch(password, confirmPassword);
    if (!matchValidation.isValid) {
      errors.confirmPassword = matchValidation.errors[0];
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password);

      // Only navigate if registration was successful (no error thrown)
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);

      // Handle validation errors from API - don't navigate
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          const apiErrors: Record<string, string> = {};
          err.response.data.detail.forEach((error: any) => {
            const field = error.loc[error.loc.length - 1];
            apiErrors[field] = error.msg;
          });
          setValidationErrors(apiErrors);
        } else {
          setRegisterError(err.response.data.detail);
        }
      } else {
        setRegisterError(err.message || 'Registration failed. Please try again.');
      }
      // Explicitly prevent any navigation
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#22C55E] via-[#0A3D62] to-[#8B5CF6] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22C55E] via-[#3B82F6] to-[#8B5CF6]" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Create Account</h1>
            <p className="text-gray-600">Start your journey to financial freedom</p>
          </div>

          {/* Error message */}
          {registerError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{registerError}</p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
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
                    setRegisterError(null);
                  }}
                  disabled={isSubmitting}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all outline-none ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                    setRegisterError(null);
                  }}
                  disabled={isSubmitting}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all outline-none ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: passwordStrength.score >= level
                            ? getPasswordStrengthColor(passwordStrength.score)
                            : '#e5e7eb'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium mb-2" style={{ color: getPasswordStrengthColor(passwordStrength.score) }}>
                    {getPasswordStrengthLabel(passwordStrength.score)}
                  </p>

                  {/* Password requirements checklist */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {password.length >= 8 ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/[A-Z]/.test(password) ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/[a-z]/.test(password) ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/\d/.test(password) ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One number
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                    setRegisterError(null);
                  }}
                  disabled={isSubmitting}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all outline-none ${validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    setValidationErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E]"
                  required
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#0A3D62] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#0A3D62] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {validationErrors.terms && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.terms}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#0A3D62] hover:text-[#083048] transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
