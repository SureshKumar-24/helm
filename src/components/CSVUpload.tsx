'use client';

import { useState, useRef, useCallback } from 'react';
import { csvParserService, ParsedTransaction } from '@/services/CSVParserService';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CSVUploadProps {
  onUploadComplete: (transactions: ParsedTransaction[]) => void;
  onError: (error: string) => void;
}

export default function CSVUpload({ onUploadComplete, onError }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [duplicateTransactions, setDuplicateTransactions] = useState<ParsedTransaction[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedSampleFile, setSelectedSampleFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample files available for quick testing
  const sampleFiles = [
    { value: '', label: 'Choose a sample file...' },
    { value: 'sample-transactions.csv', label: '📄 Quick Test (15 transactions)' },
    { value: 'sample-data/transactions-full-month.csv', label: '📅 Full Month (40 transactions) - Recommended' },
    { value: 'sample-data/transactions-3-months.csv', label: '📊 3 Months History (56 transactions)' },
    { value: 'sample-data/transactions-chase-format.csv', label: '🏦 Chase Bank Format (40 transactions)' },
    { value: 'sample-data/transactions-with-duplicates.csv', label: '🔄 With Duplicates (24 transactions)' },
    { value: 'sample-data/transactions-current-week.csv', label: '📆 Current Week Only (14 transactions)' },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(f => f.name.endsWith('.csv'));

    if (csvFile) {
      await processFile(csvFile);
    } else {
      onError('Please drop a CSV file');
    }
  }, [onError]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  }, []);

  const handleSampleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filePath = e.target.value;
    setSelectedSampleFile(filePath);

    if (!filePath) return;

    try {
      // Fetch the sample file from the public directory
      const response = await fetch(`/${filePath}`);
      if (!response.ok) {
        throw new Error('Failed to load sample file');
      }

      const text = await response.text();
      
      // Create a File object from the text
      const blob = new Blob([text], { type: 'text/csv' });
      const file = new File([blob], filePath.split('/').pop() || 'sample.csv', { type: 'text/csv' });

      await processFile(file);
    } catch (error) {
      console.error('Error loading sample file:', error);
      onError('Failed to load sample file. Make sure the file exists in the public directory.');
    }
  }, [onError]);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Validate file
      setUploadProgress(20);
      const validation = await csvParserService.validateCSV(file);

      if (!validation.isValid) {
        onError(validation.errors.join(', '));
        setIsProcessing(false);
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('CSV warnings:', validation.warnings);
      }

      // Parse file
      setUploadProgress(50);
      const transactions = await csvParserService.parseCSV(file);

      setUploadProgress(80);

      // Check for duplicates (fetch existing transactions from API)
      const existingTransactions = await fetchExistingTransactions();
      const duplicateCheck = await csvParserService.checkDuplicates(
        transactions,
        existingTransactions
      );

      // Auto-categorize transactions using CategoryService
      const categorizedTransactions = await Promise.all(
        duplicateCheck.unique.map(async (t) => ({
          ...t,
          category: await suggestCategory(t.description),
        }))
      );

      setUploadProgress(100);
      setParsedTransactions(categorizedTransactions);
      setDuplicateTransactions(duplicateCheck.duplicates);
      
      if (duplicateCheck.duplicates.length > 0) {
        setShowDuplicates(true);
      }
      
      setShowReview(true);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch existing transactions to check for duplicates
  const fetchExistingTransactions = async (): Promise<ParsedTransaction[]> => {
    try {
      // TODO: Get actual userId from auth context
      const userId = 'demo-user-id';
      
      const response = await fetch(`/api/transactions?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      return data.transactions.map((t: {
        date: string;
        description: string;
        amount: string | number;
        type: string;
      }) => ({
        date: new Date(t.date).toISOString().split('T')[0],
        description: t.description,
        amount: typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount,
        type: t.type,
      }));
    } catch (error) {
      console.error('Failed to fetch existing transactions:', error);
      return [];
    }
  };

  // Suggest category using CategoryService API
  const suggestCategory = async (description: string): Promise<string> => {
    try {
      const response = await fetch('/api/categories/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to suggest category');
      }

      const data = await response.json();
      return data.category;
    } catch (error) {
      console.error('Error suggesting category:', error);
      return 'Other';
    }
  };

  const handleCategoryChange = (index: number, newCategory: string) => {
    const updated = [...parsedTransactions];
    updated[index] = { ...updated[index], category: newCategory };
    setParsedTransactions(updated);
  };

  const handleConfirm = async () => {
    try {
      // TODO: Get actual userId from auth context
      const userId = 'demo-user-id';

      // Send transactions to API
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          transactions: parsedTransactions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save transactions');
      }

      const data = await response.json();
      onUploadComplete(data.transactions);
      
      // Reset state
      setParsedTransactions([]);
      setDuplicateTransactions([]);
      setShowReview(false);
      setShowDuplicates(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to save transactions:', err);
      onError('Failed to save transactions');
    }
  };

  const handleCancel = () => {
    setParsedTransactions([]);
    setDuplicateTransactions([]);
    setShowReview(false);
    setShowDuplicates(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (showReview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Transactions ({parsedTransactions.length})</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Review the imported transactions and adjust categories if needed.
          </p>
          {showDuplicates && duplicateTransactions.length > 0 && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Found {duplicateTransactions.length} duplicate transaction(s) that will be skipped.
                <button
                  onClick={() => setShowDuplicates(!showDuplicates)}
                  className="ml-2 text-yellow-900 underline hover:no-underline"
                >
                  {showDuplicates ? 'Hide' : 'Show'} duplicates
                </button>
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parsedTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingIndex === index ? (
                        <select
                          value={transaction.category}
                          onChange={(e) => {
                            handleCategoryChange(index, e.target.value);
                            setEditingIndex(null);
                          }}
                          onBlur={() => setEditingIndex(null)}
                          autoFocus
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="Housing">🏠 Housing</option>
                          <option value="Food & Dining">🍽️ Food & Dining</option>
                          <option value="Transportation">🚗 Transportation</option>
                          <option value="Entertainment">🎬 Entertainment</option>
                          <option value="Shopping">🛍️ Shopping</option>
                          <option value="Healthcare">⚕️ Healthcare</option>
                          <option value="Utilities">💡 Utilities</option>
                          <option value="Subscriptions">📱 Subscriptions</option>
                          <option value="Other">📊 Other</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {transaction.category || 'Set category'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{parsedTransactions.length}</span> transactions ready to import
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm}>
                Confirm & Import
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
          Import your bank transactions from a CSV file to get started.
        </p>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <div className="text-4xl">⏳</div>
              <div>
                <p className="text-lg font-medium text-gray-900">Processing CSV file...</p>
                <p className="text-sm text-gray-600 mt-1">This may take a moment</p>
              </div>
              <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </div>
          ) : (
            <>
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
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  Choose File
                </span>
              </label>
              <div className="mt-6 text-xs text-gray-500">
                <p>Supported formats: Chase, Bank of America, Wells Fargo, Generic CSV</p>
                <p className="mt-1">Maximum file size: 10MB</p>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Sample Files Dropdown */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <label htmlFor="sample-file-select" className="block text-sm font-semibold text-gray-900">
              Try a Sample File (Quick Start)
            </label>
          </div>
          <select
            id="sample-file-select"
            value={selectedSampleFile}
            onChange={handleSampleFileSelect}
            className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 font-medium"
          >
            {sampleFiles.map((file) => (
              <option key={file.value} value={file.value}>
                {file.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-600">
            ✨ Pre-loaded with realistic transaction data • Perfect for testing • No file upload needed
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 CSV Format Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Your CSV should have columns for: Date, Description, and Amount</li>
            <li>• Dates can be in MM/DD/YYYY or YYYY-MM-DD format</li>
            <li>• Negative amounts or amounts in parentheses are treated as expenses</li>
            <li>• Positive amounts are treated as income</li>
            <li>• You can review and edit categories before importing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
