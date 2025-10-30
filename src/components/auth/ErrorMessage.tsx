/**
 * Error Message Component
 * Displays inline error messages with proper styling and accessibility
 */

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}
