'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionService, TransactionType, CategoryType, TransactionFilters } from '@/services/TransactionService';
import { handleApiError, isAuthError, retryWithBackoff, isOffline } from '@/lib/api/errorHandler';
import { transformBackendTransaction } from '@/types';
import TransactionModal from '@/components/TransactionModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Toast from '@/components/Toast';

function TransactionsContent() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filters change
      loadTransactions(abortController.signal);
    }, 300); // Debounce filter changes

    return () => {
      clearTimeout(timeoutId);
      abortController.abort(); // Cancel pending request when filters change
    };
  }, [filter, startDate, endDate, selectedCategory, isRecurring]);

  useEffect(() => {
    const abortController = new AbortController();
    loadTransactions(abortController.signal);
    
    return () => {
      abortController.abort(); // Cancel pending request when page changes
    };
  }, [currentPage, pageSize]);

  const loadCategories = async () => {
    try {
      const cats = await transactionService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadTransactions = async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    
    // Check if offline
    if (isOffline()) {
      setError('You are offline. Please check your internet connection.');
      setIsLoading(false);
      return;
    }
    
    try {
      const filters: TransactionFilters = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      };
      
      if (filter !== 'all') {
        filters.type = filter;
      }
      if (startDate) {
        filters.start_date = startDate;
      }
      if (endDate) {
        filters.end_date = endDate;
      }
      if (selectedCategory) {
        filters.category_id = selectedCategory;
      }
      if (isRecurring !== undefined) {
        filters.is_recurring = isRecurring;
      }
      
      // Use retry logic for transient failures
      const data = await retryWithBackoff(() => transactionService.getTransactions(filters));
      
      // Check if request was cancelled
      if (signal?.aborted) {
        return;
      }
      
      setTransactions(data);
      setTotalTransactions(data.length); // Note: API doesn't return total count, so we use returned length
    } catch (err) {
      // Ignore abort errors
      if (signal?.aborted) {
        return;
      }
      
      const apiError = handleApiError(err);
      
      if (isAuthError(err)) {
        setError('Authentication required. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(apiError.detail || apiError.message);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('');
    setIsRecurring(undefined);
    setFilter('all');
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;
    
    setIsDeleting(true);
    
    // Optimistic update: remove from UI immediately
    const previousTransactions = [...transactions];
    setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
    setIsDeleteModalOpen(false);
    
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      setToast({ message: 'Transaction deleted successfully', type: 'success' });
      setTransactionToDelete(null);
      // Refresh to ensure consistency
      loadTransactions();
    } catch (err) {
      // Revert optimistic update on error
      setTransactions(previousTransactions);
      const apiError = handleApiError(err);
      setToast({ message: 'Failed to delete: ' + apiError.message, type: 'error' });
      setIsDeleteModalOpen(true); // Reopen modal
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSuccess = () => {
    const message = modalMode === 'create' 
      ? 'Transaction created successfully' 
      : 'Transaction updated successfully';
    setToast({ message, type: 'success' });
    // Refresh list to get updated data
    loadTransactions();
  };

  const hasActiveFilters = startDate || endDate || selectedCategory || isRecurring !== undefined;
  
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const canGoPrevious = currentPage > 1;
  const canGoNext = transactions.length === pageSize; // If we got a full page, there might be more

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

  const getCategoryColor = (transaction: TransactionType) => {
    return transaction.category?.color || '#6B7280';
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Transactions</h1>
            <p className="text-gray-600">View and manage all your transactions</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3D62] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Transactions</h1>
            <p className="text-gray-600">View and manage all your transactions</p>
          </div>
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">⚠️</span>
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => loadTransactions()}
                  className="px-4 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#0A3D62]/90 transition"
                >
                  Try Again
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Transactions</h1>
            <p className="text-gray-600">View and manage all your transactions</p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setSelectedTransaction(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#0A3D62] text-white rounded-lg hover:bg-[#0A3D62]/90 transition flex items-center justify-center gap-2 font-medium shadow-md"
          >
            <span className="text-xl">➕</span>
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Income</p>
                  <p className="text-2xl font-bold text-[#22C55E]">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-[#EF4444]">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#EF4444]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📉</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                  <p className="text-2xl font-bold text-[#0A3D62]">
                    {formatCurrency(totalIncome - totalExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#0A3D62]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'all'
                      ? 'bg-[#0A3D62] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('income')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'income'
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilter('expense')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'expense'
                      ? 'bg-[#EF4444] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Expenses
                </button>
              </div>
              
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recurring
                  </label>
                  <select
                    value={isRecurring === undefined ? '' : isRecurring ? 'true' : 'false'}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIsRecurring(value === '' ? undefined : value === 'true');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  >
                    <option value="">All Transactions</option>
                    <option value="true">Recurring Only</option>
                    <option value="false">One-time Only</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filter === 'all' ? 'All Transactions' : filter === 'income' ? 'Income' : 'Expenses'} (
              {filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No transactions yet</p>
                <p className="text-gray-400 text-sm">Upload a CSV file to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{transaction.service}</div>
                            {transaction.description && (
                              <div className="text-xs text-gray-500">{transaction.description}</div>
                            )}
                            {transaction.is_recurring && (
                              <div className="text-xs text-blue-600 mt-1">
                                🔄 {transaction.frequency}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${getCategoryColor(transaction)}20`,
                              color: getCategoryColor(transaction),
                            }}
                          >
                            {getCategoryDisplay(transaction)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right">
                          <span
                            className={
                              transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                            }
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setModalMode('edit');
                                setSelectedTransaction(transaction);
                                setIsModalOpen(true);
                              }}
                              className="p-2 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                              title="Edit transaction"
                              aria-label="Edit transaction"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                setTransactionToDelete(transaction);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                              title="Delete transaction"
                              aria-label="Delete transaction"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredTransactions.length > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {filteredTransactions.length} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Per page:</label>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      canGoPrevious
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ← Previous
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!canGoNext}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      canGoNext
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <TransactionModal
          isOpen={isModalOpen}
          mode={modalMode}
          transaction={selectedTransaction}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          transaction={transactionToDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />

        {/* Toast Notification */}
        <Toast
          message={toast?.message || ''}
          type={toast?.type || 'info'}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsContent />
    </ProtectedRoute>
  );
}
