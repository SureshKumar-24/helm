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
  const [showReview, setShowReview] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedSampleFile, setSelectedSampleFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample files available for quick testing
  const sampleFiles = [
    { value: '', label: 'Choose a sample file...' },
    { value: 'sample-transactions.csv', label: '📄 Quick Test (15 transactions)' },
    { value: 'sample-data/subscriptions-sample.csv', label: '📱 Subscriptions (10 items)' },
    { value: 'sample-data/one-time-expenses-sample.csv', label: '💰 One-Time Expenses (10 items)' },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Simple local category suggestion based on keywords
  const suggestCategoryLocal = useCallback((description: string): string => {
    const desc = description.toLowerCase();

    if (desc.includes('movie') || desc.includes('cinema') || desc.includes('theater') ||
      desc.includes('concert') || desc.includes('game')) {
      return 'Entertainment';
    }

    if (desc.includes('spotify') || desc.includes('apple music') || desc.includes('music')) {
      return 'Music';
    }

    if (desc.includes('netflix') || desc.includes('disney') || desc.includes('hulu') ||
      desc.includes('hbo') || desc.includes('prime video')) {
      return 'Video Streaming';
    }

    if (desc.includes('adobe') || desc.includes('microsoft') || desc.includes('dropbox') ||
      desc.includes('github') || desc.includes('cloud')) {
      return 'Software/Cloud';
    }

    if (desc.includes('phone') || desc.includes('mobile') || desc.includes('verizon') ||
      desc.includes('at&t') || desc.includes('t-mobile') || desc.includes('internet')) {
      return 'Communications';
    }

    if (desc.includes('electric') || desc.includes('water') || desc.includes('gas') ||
      desc.includes('utility')) {
      return 'Utilities';
    }

    if (desc.includes('uber') || desc.includes('lyft') || desc.includes('gas station') ||
      desc.includes('flight') || desc.includes('hotel') || desc.includes('airbnb')) {
      return 'Travel/Transport';
    }

    if (desc.includes('grocery') || desc.includes('supermarket') || desc.includes('whole foods') ||
      desc.includes('trader joe') || desc.includes('safeway')) {
      return 'Groceries';
    }

    if (desc.includes('gym') || desc.includes('fitness') || desc.includes('pharmacy') ||
      desc.includes('doctor') || desc.includes('hospital')) {
      return 'Health/Wellness';
    }

    return 'Miscellaneous';
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      setUploadProgress(20);
      const validation = await csvParserService.validateCSV(file);

      if (!validation.isValid) {
        onError(validation.errors.join(', '));
        setIsProcessing(false);
        return;
      }

      setUploadProgress(50);
      const transactions = await csvParserService.parseCSV(file);

      setUploadProgress(80);

      // Simple category assignment based on keywords
      const categorizedTransactions = transactions.map((t) => ({
        ...t,
        category: suggestCategoryLocal(t.description),
      }));

      setUploadProgress(100);
      setParsedTransactions(categorizedTransactions);
      setShowReview(true);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  }, [onError, suggestCategoryLocal]);

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

  const handleCategoryChange = (index: number, newCategory: string) => {
    const updated = [...parsedTransactions];
    updated[index] = { ...updated[index], category: newCategory };
    setParsedTransactions(updated);
  };

  const handleConfirm = async () => {
    try {
      // Just pass transactions to parent component (no backend call)
      onUploadComplete(parsedTransactions);

      // Reset state
      setParsedTransactions([]);
      setShowReview(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to process transactions:', err);
      onError('Failed to process transactions');
    }
  };

  const handleCancel = () => {
    setParsedTransactions([]);
    setShowReview(false);
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
                      <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income'
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
                          <option value="Entertainment">Entertainment</option>
                          <option value="Music">Music</option>
                          <option value="Video Streaming">Video Streaming</option>
                          <option value="Software/Cloud">Software/Cloud</option>
                          <option value="Communications">Communications</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Travel/Transport">Travel/Transport</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Health/Wellness">Health/Wellness</option>
                          <option value="Miscellaneous">Miscellaneous</option>
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
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
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
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
                  Choose File
                </span>
              </label>
              <div className="mt-6 text-xs text-gray-500">
                <p>Supported format: CSV with Date, Description, Amount columns</p>
                <p className="mt-1">Maximum file size: 10MB</p>
              </div>
            </>
          )}
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
          <h4 className="text-sm font-semibold text-blue-900 mb-2">CSV Format Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Your CSV should have columns for: Date, Description, and Amount</li>
            <li>• Dates can be in MM/DD/YYYY or YYYY-MM-DD format</li>
            <li>• Negative amounts are treated as expenses</li>
            <li>• Positive amounts are treated as income</li>
            <li>• You can review and edit categories before importing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
