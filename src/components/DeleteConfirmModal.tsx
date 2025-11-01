'use client';

import { useEffect } from 'react';
import { TransactionType } from '@/services/TransactionService';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: TransactionType | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  transaction,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !transaction) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-red-50/80 via-orange-50/80 to-yellow-50/80 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-red-100">
        <div className="p-6">
          <div className="text-center">
            {/* Warning Icon */}
            <div className="text-6xl mb-4 animate-bounce">⚠️</div>
            
            {/* Title */}
            <h2 id="delete-modal-title" className="text-2xl font-bold text-red-600 mb-2">
              Delete Transaction?
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            
            {/* Transaction Details Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-6 text-left border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">{transaction.service}</div>
              {transaction.description && (
                <div className="text-sm text-gray-500 mb-2">{transaction.description}</div>
              )}
              <div className={`text-lg font-bold mb-1 ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </div>
              {transaction.is_recurring && (
                <div className="text-sm text-blue-600 mt-1">
                  🔄 {transaction.frequency} recurring
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
