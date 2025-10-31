'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, Shield, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { verifyOTP } from '@/lib/auth/passwordResetService';

export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }
  }, [email, router]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    if (isExpired) {
      setError('This code has expired. Please request a new one.');
      return;
    }

    if (attemptsRemaining <= 0) {
      setError('Maximum attempts exceeded. Please request a new code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await verifyOTP(email, otp);
      
      // Store reset token and redirect to reset password page
      router.push(`/reset-password?token=${encodeURIComponent(response.reset_token)}`);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      
      // Decrement attempts
      setAttemptsRemaining((prev) => prev - 1);
      
      // Handle specific errors
      if (err.message.includes('Maximum')) {
        setError('Maximum verification attempts exceeded. Please request a new code.');
      } else if (err.message.includes('expired')) {
        setError('This code has expired. Please request a new one.');
        setIsExpired(true);
      } else {
        setError(err.message || 'Invalid code. Please try again.');
      }
      
      // Clear OTP input for retry
      setOtp('');
      inputRef.current?.focus();
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    router.push('/forgot-password');
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A3D62] via-[#0f5280] to-[#0A3D62] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22C55E] via-[#3B82F6] to-[#8B5CF6]" />

          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Check Your Email</h1>
            <p className="text-gray-600">
              We sent a 6-digit code to
            </p>
            <p className="text-[#0A3D62] font-medium mt-1">{email}</p>
          </div>

          {/* Timer and attempts info */}
          <div className="mb-6 flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isExpired ? 'text-red-500' : 'text-gray-600'}`} />
              <div>
                <p className="text-xs text-gray-500">Expires in</p>
                <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                  {isExpired ? 'Expired' : formatTime(timeRemaining)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Attempts left</p>
              <p className={`text-sm font-semibold ${attemptsRemaining <= 2 ? 'text-red-600' : 'text-gray-900'}`}>
                {attemptsRemaining}/5
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit Code
              </label>
              <input
                ref={inputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                value={otp}
                onChange={handleOtpChange}
                disabled={isSubmitting || isExpired || attemptsRemaining <= 0}
                className={`block w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all outline-none ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${isSubmitting || isExpired || attemptsRemaining <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the code exactly as shown in your email
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6 || isExpired || attemptsRemaining <= 0}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform transition-all duration-200 ${
                isSubmitting || otp.length !== 6 || isExpired || attemptsRemaining <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Code
                </>
              )}
            </button>
          </form>

          {/* Resend code section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResendCode}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition"
            >
              <RefreshCw className="w-4 h-4" />
              Resend Code
            </button>
          </div>

          {/* Back button */}
          <div className="mt-4">
            <Link
              href="/forgot-password"
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
