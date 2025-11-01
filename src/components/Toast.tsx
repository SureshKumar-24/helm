'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div 
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50 max-w-md`}
      role="alert"
      aria-live="polite"
    >
      <span className="text-xl font-bold">{icon}</span>
      <span className="flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-2 hover:opacity-80 transition-opacity text-xl leading-none"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
