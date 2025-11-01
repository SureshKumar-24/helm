'use client';

import { useState, useEffect } from 'react';
import { transactionService, TransactionType, CategoryType, CreateTransactionData } from '@/services/TransactionService';
import { handleApiError } from '@/lib/api/errorHandler';

interface TransactionModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  transaction?: TransactionType | null;
  categories: CategoryType[];
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  service_name: string;
  amount: string;
  transaction_type: 'expense' | 'income';
  date: string;
  category_id: string;
  is_recurring: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | '';
  start_date: string;
  notes: string;
}

interface FormErrors {
  service_name?: string;
  amount?: string;
  date?: string;
  frequency?: string;
  start_date?: string;
}

export default function TransactionModal({
  isOpen,
  mode,
  transaction,
  categories,
  onClose,
  onSuccess,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<FormData>({
    service_name: '',
    amount: '',
    transaction_type: 'expense',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    is_recurring: false,
    frequency: '',
    start_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Trap focus in modal
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  // Pre-fill form data in edit mode
  useEffect(() => {
    if (mode === 'edit' && transaction) {
      setFormData({
        service_name: transaction.service,
        amount: String(Math.abs(transaction.amount)),
        transaction_type: transaction.type,
        date: transaction.date,
        category_id: transaction.category?.id || '',
        is_recurring: transaction.is_recurring,
        frequency: transaction.frequency || '',
        start_date: transaction.start_date || '',
        notes: transaction.description || '',
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        service_name: '',
        amount: '',
        transaction_type: 'expense',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        is_recurring: false,
        frequency: '',
        start_date: '',
        notes: '',
      });
    }
    setErrors({});
    setApiError(null);
    setShowSuccess(false);
    setIsDirty(false);
  }, [mode, transaction, isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (isDirty && !showSuccess) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Service name validation
    if (!formData.service_name.trim()) {
      newErrors.service_name = 'Service name is required';
    } else if (formData.service_name.length > 255) {
      newErrors.service_name = 'Service name must be less than 255 characters';
    }

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (amount < 0 || amount > 10000) {
      newErrors.amount = 'Amount must be between 0 and 10,000';
    } else if (amount === 0) {
      newErrors.amount = 'Amount cannot be zero';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const date = new Date(formData.date);
      const minDate = new Date('1900-01-01');
      const maxDate = new Date('2100-12-31');
      if (date < minDate || date > maxDate) {
        newErrors.date = 'Date must be between 1900 and 2100';
      }
    }

    // Recurring validation
    if (formData.is_recurring) {
      if (!formData.frequency) {
        newErrors.frequency = 'Frequency is required for recurring transactions';
      }
      if (!formData.start_date) {
        newErrors.start_date = 'Start date is required for recurring transactions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const amount = parseFloat(formData.amount);
      // Convert to negative if expense, keep positive if income
      const finalAmount = formData.transaction_type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

      const data: CreateTransactionData = {
        service_name: formData.service_name,
        amount: finalAmount,
        date: formData.date,
        category_id: formData.category_id || undefined,
        is_recurring: formData.is_recurring,
        frequency: formData.frequency || undefined,
        start_date: formData.start_date || undefined,
        notes: formData.notes || undefined,
      };

      if (mode === 'create') {
        await transactionService.createTransaction(data);
      } else if (transaction) {
        await transactionService.updateTransaction(transaction.id, data);
      }

      // Show success message
      setShowSuccess(true);

      // Close modal and trigger refresh after 1 second
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      const error = handleApiError(err);
      setApiError(error.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-lg flex items-center justify-center z-50 p-0 sm:p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#0A3D62] to-[#0d5a8f] text-white">
          <h2 id="modal-title" className="text-2xl font-bold">
            {mode === 'create' ? '➕ Add Transaction' : '✏️ Edit Transaction'}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition text-2xl leading-none hover:rotate-90 duration-300"
            aria-label="Close modal"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-b from-gray-50 to-white">
          {/* API Error Display */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {apiError}
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>{mode === 'create' ? 'Transaction created successfully!' : 'Transaction updated successfully!'}</span>
            </div>
          )}

          {/* Service Name */}
          <div className="mb-4">
            <label htmlFor="service_name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="service_name"
              value={formData.service_name}
              onChange={(e) => {
                setFormData({ ...formData, service_name: e.target.value });
                setIsDirty(true);
                if (errors.service_name) setErrors({ ...errors, service_name: undefined });
              }}
              maxLength={255}
              autoFocus
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${errors.service_name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., Netflix, Grocery Shopping"
              disabled={isLoading}
              aria-describedby={errors.service_name ? 'service_name-error' : undefined}
              aria-invalid={!!errors.service_name}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.service_name && (
                <p id="service_name-error" className="text-red-500 text-sm">{errors.service_name}</p>
              )}
              <p className="text-gray-400 text-xs ml-auto">
                {formData.service_name.length}/255
              </p>
            </div>
          </div>

          {/* Transaction Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, transaction_type: 'expense' });
                  setIsDirty(true);
                }}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition font-medium flex items-center justify-center gap-2 ${formData.transaction_type === 'expense'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                disabled={isLoading}
              >
                <span className="text-xl">↓</span>
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, transaction_type: 'income' });
                  setIsDirty(true);
                }}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition font-medium flex items-center justify-center gap-2 ${formData.transaction_type === 'income'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                disabled={isLoading}
              >
                <span className="text-xl">↑</span>
                Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  setIsDirty(true);
                  if (errors.amount) setErrors({ ...errors, amount: undefined });
                }}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="0.00"
                disabled={isLoading}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
                aria-invalid={!!errors.amount}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setIsDirty(true);
                if (errors.date) setErrors({ ...errors, date: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={isLoading}
              aria-describedby={errors.date ? 'date-error' : undefined}
              aria-invalid={!!errors.date}
            />
            {errors.date && (
              <p id="date-error" className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => {
                setFormData({ ...formData, category_id: e.target.value });
                setIsDirty(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
              disabled={isLoading}
            >
              <option value="">Auto-assign category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recurring Transaction */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    is_recurring: e.target.checked,
                    frequency: e.target.checked ? formData.frequency : '',
                    start_date: e.target.checked ? formData.start_date : '',
                  });
                  setIsDirty(true);
                  if (!e.target.checked) {
                    setErrors({ ...errors, frequency: undefined, start_date: undefined });
                  }
                }}
                className="w-4 h-4 text-[#0A3D62] border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62]"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">Recurring Transaction</span>
            </label>
          </div>

          {/* Frequency (shown only when recurring) */}
          {formData.is_recurring && (
            <div className="mb-4 ml-6">
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => {
                  setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' });
                  setIsDirty(true);
                  if (errors.frequency) setErrors({ ...errors, frequency: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${errors.frequency ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isLoading}
                aria-describedby={errors.frequency ? 'frequency-error' : undefined}
                aria-invalid={!!errors.frequency}
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.frequency && (
                <p id="frequency-error" className="text-red-500 text-sm mt-1">{errors.frequency}</p>
              )}
            </div>
          )}

          {/* Start Date (shown only when recurring) */}
          {formData.is_recurring && (
            <div className="mb-4 ml-6">
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => {
                  setFormData({ ...formData, start_date: e.target.value });
                  setIsDirty(true);
                  if (errors.start_date) setErrors({ ...errors, start_date: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isLoading}
                aria-describedby={errors.start_date ? 'start_date-error' : undefined}
                aria-invalid={!!errors.start_date}
              />
              {errors.start_date && (
                <p id="start_date-error" className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => {
                setFormData({ ...formData, notes: e.target.value });
                setIsDirty(true);
              }}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
              placeholder="Additional details..."
              disabled={isLoading}
            />
          </div>

          {/* Form Actions - will be added in next subtask */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#0A3D62]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isLoading
                ? (mode === 'create' ? 'Creating...' : 'Updating...')
                : (mode === 'create' ? 'Create Transaction' : 'Update Transaction')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
