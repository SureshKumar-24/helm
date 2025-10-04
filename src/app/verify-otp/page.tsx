'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsVerifying(false);
    setIsVerified(true);
    
    console.log('OTP verified:', otp.join(''));
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B82F6] via-[#0A3D62] to-[#8B5CF6] flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl"
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 35}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#22C55E]" />

          {/* Back button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#0A3D62] transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          {!isVerified ? (
            <>
              {/* Header */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Verify OTP</h1>
                <p className="text-gray-600">
                  We&apos;ve sent a 6-digit code to your email
                  <br />
                  <span className="font-semibold text-[#0A3D62]">user@example.com</span>
                </p>
              </motion.div>

              {/* OTP Form */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* OTP Input */}
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all outline-none"
                      required
                    />
                  ))}
                </div>

                {/* Timer and Resend */}
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend code in{' '}
                      <span className="font-semibold text-[#0A3D62]">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB] transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Code
                    </button>
                  )}
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isVerifying || otp.some((digit) => !digit)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-5 h-5" />
                      </motion.div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Verify & Continue
                    </>
                  )}
                </motion.button>
              </motion.form>

              {/* Help text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the code?{' '}
                  <button className="font-semibold text-[#0A3D62] hover:underline">
                    Contact support
                  </button>
                </p>
              </motion.div>
            </>
          ) : (
            // Success state
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-[#22C55E]/10 rounded-full mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <CheckCircle2 className="w-12 h-12 text-[#22C55E]" />
                </motion.div>
              </motion.div>
              <h2 className="text-3xl font-bold text-[#0A3D62] mb-3">Verified!</h2>
              <p className="text-gray-600 mb-8">
                Your account has been successfully verified.
                <br />
                Redirecting to dashboard...
              </p>
              <motion.div
                className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}




