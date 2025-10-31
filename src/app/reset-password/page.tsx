'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Check, X, KeyRound } from 'lucide-react';
import {
  validatePassword,
  validatePasswordMatch,
  checkPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/lib/auth/validation';
import { resetPassword } from '@/lib/auth/passwordResetService';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const passwordStrength = checkPasswordStrength(newPassword);
  const passwordValidation = validatePassword(newPassword);

  // Redirect if no token provided
  useEffect(() => {
    if (!resetToken) {
      router.push('/forgot-password');
    }
  }, [resetToken, router]);

  // Handle success redirect countdown
  useEffect(() => {
    if (success && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && redirectCountdown === 0) {
      router.push('/login?reset=success');
    }
  }, [success, redirectCountdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    setValidationErrors({});
    setError(null);

    // Frontend validation
    const errors: Record<string, string> = {};

    if (!passwordValidation.isValid) {
      errors.newPassword = passwordValidation.errors[0];
    }

    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.isValid) {
      errors.confirmPassword = matchValidation.errors[0];
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(resetToken, newPassword);
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      const error = err as Error;
      console.error('Password reset error:', error);
      
      // Handle expired token
      if (error.message.includes('expired') || error.message.includes('Invalid reset token')) {
        setError(error.message);
        // Redirect to forgot password after 3 seconds
        setTimeout(() => {
          router.push('/forgot-password?error=expired');
        }, 3000);
      } else {
        setError(error.message || 'Failed to reset password. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  if (!resetToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#22C55E] via-[#0A3D62] to-[#8B5CF6] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22C55E] via-[#3B82F6] to-[#8B5CF6]" />

          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl mb-4 shadow-lg">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Create New Password</h1>
            <p className="text-gray-600">
              Choose a strong password to secure your account
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Password reset successful!</p>
                <p className="text-sm text-green-700 mt-1">
                  Redirecting to login in {redirectCountdown} seconds...
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !success && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, newPassword: '' }));
                      setError(null);
                    }}
                    disabled={isSubmitting}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all outline-none ${
                      validationErrors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="••••••••"
                    required
                    autoFocus
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
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              passwordStrength.score >= level
                                ? getPasswordStrengthColor(passwordStrength.score)
                                : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs font-medium mb-3"
                      style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                    >
                      {getPasswordStrengthLabel(passwordStrength.score)}
                    </p>

                    {/* Password requirements checklist */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        {newPassword.length >= 8 ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {/[A-Z]/.test(newPassword) ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {/[a-z]/.test(newPassword) ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          One lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {/\d/.test(newPassword) ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span className={/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          One number
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {validationErrors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.newPassword}</p>
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
                      setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      setError(null);
                    }}
                    disabled={isSubmitting}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all outline-none ${
                      validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                  <p className="mt-2 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform transition-all duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#22C55E] via-[#0A3D62] to-[#8B5CF6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
