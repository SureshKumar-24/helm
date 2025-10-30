/**
 * Loading Button Component
 * Button with loading state for form submissions
 */

import { ReactNode } from 'react';

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function LoadingButton({
  isLoading,
  loadingText = 'Loading...',
  children,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isLoading || disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:opacity-90'
      } ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
