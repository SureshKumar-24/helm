'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { transactionService, ImportResult, TransactionType } from '@/services/TransactionService';
import { handleApiError, isAuthError, isRateLimitError, retryWithBackoff, isOffline } from '@/lib/api/errorHandler';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CSVUploadProps {
  onUploadComplete: (result: ImportResult) => void;
  onError: (error: string) => void;
}

export default function CSVUpload({ onUploadComplete, onError }: CSVUploadProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transactionType, setTransactionType] = useState<'instant' | 'recurring'>('instant');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [selectedSampleFile, setSelectedSampleFile] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample files available for quick testing
  const sampleFiles = [
    { value: '', label: 'Choose a sample file...' },
    { value: '/sample-data/test_instant_transactions.csv', label: '💰 Instant Expenses (Test Data)' },
    { value: '/sample-data/test_recurring_transactions.csv', label: '🔄 Recurring Expenses (Test Data)' },
  ];

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      await transactionService.getCategories();
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Categories are cached in the service, no need to store locally
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size exceeds 10MB limit');
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      onError('Please select a CSV file');
      return;
    }

    setSelectedFile(file);
    setShowReview(true);
  }, [onError]);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find((f) => f.name.endsWith('.csv'));

      if (csvFile) {
        await processFile(csvFile);
      } else {
        onError('Please drop a CSV file');
      }
    },
    [onError, processFile]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await processFile(file);
      }
    },
    [processFile]
  );

  const handleSampleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const filePath = e.target.value;
      setSelectedSampleFile(filePath);

      if (!filePath) return;

      // Determine transaction type from file path
      if (filePath.includes('recurring')) {
        setTransactionType('recurring');
      } else {
        setTransactionType('instant');
      }

      try {
        const response = await fetch(`/${filePath}`);
        if (!response.ok) {
          throw new Error('Failed to load sample file');
        }

        const text = await response.text();
        const blob = new Blob([text], { type: 'text/csv' });
        const file = new File([blob], filePath.split('/').pop() || 'sample.csv', { type: 'text/csv' });

        await processFile(file);
      } catch (error) {
        console.error('Error loading sample file:', error);
        onError('Failed to load sample file');
      }
    },
    [onError, processFile]
  );

  const handleConfirm = async () => {
    if (!selectedFile) {
      onError('No file selected');
      return;
    }

    // Check if offline
    if (isOffline()) {
      onError('You are offline. Please check your internet connection.');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      setUploadProgress(30);

      // Use retry logic for transient failures (but not for rate limits)
      const result = await retryWithBackoff(
        () => transactionService.importTransactions(selectedFile, transactionType),
        2 // Only 2 retries for uploads to avoid hitting rate limits
      );

      setUploadProgress(100);
      setImportResult(result);

      // Show success message
      if (result.failed_count === 0) {
        onUploadComplete(result);
      }

      // Keep showing review with results
      setShowReview(true);
    } catch (error) {
      const apiError = handleApiError(error);

      if (isAuthError(error)) {
        onError('Authentication required. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else if (isRateLimitError(error)) {
        onError('Upload limit reached. Please try again in an hour.');
      } else {
        onError(apiError.detail || apiError.message);
      }

      setShowReview(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImportResult(null);
    setShowReview(false);
    setShowErrors(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const getCategoryDisplay = (transaction: TransactionType) => {
    if (!transaction.category) return 'Uncategorized';
    return `${transaction.category.icon || '📦'} ${transaction.category.name}`;
  };

  if (showReview && importResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Import Results
          </CardTitle>
          <div className="mt-2 space-y-2">
            {importResult.failed_count === 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <p className="text-sm font-medium">
                  Successfully imported {importResult.imported_count} transactions
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-yellow-600">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-sm font-medium">
                    Partial import: {importResult.imported_count} succeeded, {importResult.failed_count} failed
                  </p>
                </div>
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {showErrors ? 'Hide' : 'Show'} error details
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showErrors && importResult.errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Import Errors</h4>
              <div className="space-y-2">
                {importResult.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-800">
                    <span className="font-medium">Row {error.row}</span> - {error.field}: {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResult.transactions.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {importResult.transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.service}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getCategoryDisplay(transaction)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={handleCancel}>
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showReview && selectedFile && !importResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confirm Upload</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Review your selection before uploading to the server.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Selected File</p>
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <span className="text-4xl">📄</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Transaction Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="instant"
                      checked={transactionType === 'instant'}
                      onChange={(e) => setTransactionType(e.target.value as 'instant' | 'recurring')}
                      className="mr-2"
                      disabled={isProcessing}
                    />
                    <span className="text-sm">Instant Expenses</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="recurring"
                      checked={transactionType === 'recurring'}
                      onChange={(e) => setTransactionType(e.target.value as 'instant' | 'recurring')}
                      className="mr-2"
                      disabled={isProcessing}
                    />
                    <span className="text-sm">Recurring Expenses</span>
                  </label>
                </div>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">Uploading... {uploadProgress}%</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Expected Format: {transactionType === 'instant' ? 'Instant' : 'Recurring'} Expenses
              </h4>
              <code className="bg-white px-2 py-1 rounded text-xs block">
                {transactionType === 'instant' ? (
                  <>
                    service;amount;payment_date<br />
                    Example: Netflix;-15.99;2024-01-15
                  </>
                ) : (
                  <>
                    service;amount;frequency;start_date<br />
                    Example: Spotify;9.99;monthly;2024-01-01
                  </>
                )}
              </code>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm} disabled={isProcessing}>
                {isProcessing ? 'Uploading...' : 'Upload to Server'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Transactions</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Import your transactions from a CSV file to the server.
        </p>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop your CSV file here
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            or click to browse your files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
              Choose File
            </span>
          </label>
          <div className="mt-6 text-xs text-gray-500">
            <p>Supported format: CSV with semicolon (;) separator</p>
            <p className="mt-1">Maximum file size: 10MB</p>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <label htmlFor="sample-file-select" className="block text-sm font-semibold text-gray-900">
              Try a Sample File
            </label>
          </div>
          <select
            id="sample-file-select"
            value={selectedSampleFile}
            onChange={handleSampleFileSelect}
            className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 font-medium"
          >
            {sampleFiles.map((file) => (
              <option key={file.value} value={file.value}>
                {file.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 CSV Format Tips</h4>

          <div className="space-y-3 text-xs text-blue-800">
            <div>
              <p className="font-semibold mb-1">Instant Expenses:</p>
              <code className="bg-white px-2 py-1 rounded text-xs block">
                service;amount;payment_date<br />
                Example: Netflix;-15.99;2024-01-15
              </code>
            </div>

            <div>
              <p className="font-semibold mb-1">Recurring Expenses:</p>
              <code className="bg-white px-2 py-1 rounded text-xs block">
                service;amount;frequency;start_date<br />
                Example: Spotify;9.99;monthly;2024-01-01
              </code>
            </div>

            <div className="border-t border-blue-200 pt-2 mt-2">
              <p className="font-semibold mb-1">Notes:</p>
              <ul className="space-y-1 ml-2">
                <li>• First row must contain the header</li>
                <li>• Use semicolon (;) as field separator</li>
                <li>• Dates support formats: YYYY-MM-DD or DD/MM/YYYY</li>
                <li>• Amounts can be positive or negative (max ±10,000)</li>
                <li>• Valid frequencies: daily, weekly, monthly, yearly</li>
                <li>• Categories are assigned automatically by the server</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
