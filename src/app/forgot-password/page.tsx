'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateEmail } from '@/lib/auth/validation';
import { requestPasswordReset } from '@/lib/auth/passwordResetService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const router = useRouter();

  // Handle rate limit countdown
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown(rateLimitCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    setValidationErrors({});
    setError(null);

    // Frontend validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setValidationErrors({ email: emailValidation.errors[0] });
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      
      // Show success message
      setSuccess(true);
      
      // Redirect to OTP verification page after 2 seconds
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      const error = err as Error;
      console.error('Password reset request error:', error);
      
      // Check if it's a rate limit error
      if (error.message.includes('Too many')) {
        setError(error.message);
        setRateLimitCountdown(60); // 60 second countdown
      } else {
        setError(error.message || 'Failed to send reset code. Please try again.');
      }
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
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Forgot Password?</h1>
            <p className="text-gray-600">
              No worries! Enter your email and we&apos;ll send you a reset code
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Check your email!</p>
                <p className="text-sm text-green-700 mt-1">
                  If an account exists with this email, you&apos;ll receive a 6-digit code shortly.
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !success && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                {rateLimitCountdown > 0 && (
                  <p className="text-sm text-red-700 mt-2">
                    Please wait {rateLimitCountdown} seconds before trying again.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                    setValidationErrors({});
                    setError(null);
                  }}
                  disabled={isSubmitting || success || rateLimitCountdown > 0}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent transition-all outline-none ${
                    validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isSubmitting || success || rateLimitCountdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || success || rateLimitCountdown > 0}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A3D62] to-[#0f5280] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform transition-all duration-200 ${
                isSubmitting || success || rateLimitCountdown > 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending Code...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Code Sent!
                </>
              ) : rateLimitCountdown > 0 ? (
                <>Wait {rateLimitCountdown}s</>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Code
                </>
              )}
            </button>
          </form>

          {/* Back to login link */}
          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-[#0A3D62] hover:text-[#083048] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
