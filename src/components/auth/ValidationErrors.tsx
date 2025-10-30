/**
 * Validation Errors Component
 * Displays a list of validation errors
 */

import { AlertCircle } from 'lucide-react';

interface ValidationErrorsProps {
  errors: string[];
  className?: string;
}

export default function ValidationErrors({ errors, className = '' }: ValidationErrorsProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
