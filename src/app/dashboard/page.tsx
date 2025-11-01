'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import CSVUpload from '@/components/CSVUpload';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionService } from '@/services/TransactionService';
import { useAuth } from '@/contexts/AuthContext';
import type { Transaction, FinancialSummary } from '@/types';

function DashboardContent() {
  const { user } = useAuth();
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
    transactionCount: 0,
  });

  // Fetch transactions from backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await transactionService.getTransactions();

        // Convert backend format to frontend format
        const formattedTransactions: Transaction[] = response.map((t: any) => ({
          id: t.id,
          date: t.date,
          description: t.service || t.description,
          amount: Math.abs(parseFloat(t.amount)),
          category: (t.category?.name || 'Miscellaneous') as Transaction['category'],
          type: t.type as 'income' | 'expense',
        }));

        setTransactions(formattedTransactions);
        calculateSummary(formattedTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const calculateSummary = (txns: Transaction[]) => {
    const income = txns.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = txns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(0) : 0;

    setSummary({
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      savingsRate: Number(savingsRate),
      transactionCount: txns.length,
    });
  };

  const recentTransactions = transactions.slice(0, 4);

  // Calculate category spending from actual transactions
  const categoryColors: Record<string, string> = {
    Entertainment: '#F59E0B',
    Music: '#8B5CF6',
    'Video Streaming': '#EF4444',
    'Software/Cloud': '#3B82F6',
    Communications: '#22C55E',
    Utilities: '#0A3D62',
    'Travel/Transport': '#06B6D4',
    Groceries: '#10B981',
    'Health/Wellness': '#EC4899',
    Miscellaneous: '#6B7280',
  };

  const categorySpending = Object.entries(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce(
        (acc, t) => {
          const cat = t.category || 'Miscellaneous';
          acc[cat] = (acc[cat] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>
      )
  ).map(([category, amount]) => ({
    category,
    amount,
    color: categoryColors[category] || '#6B7280',
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleUploadComplete = async (result: any) => {
    console.log('Upload result:', result);

    // Refresh transactions from backend after successful upload
    if (user?.id) {
      try {
        const response = await transactionService.getTransactions();

        // Convert backend format to frontend format
        const formattedTransactions: Transaction[] = response.map((t: any) => ({
          id: t.id,
          date: t.date,
          description: t.service || t.description,
          amount: Math.abs(parseFloat(t.amount)),
          category: (t.category?.name || 'Miscellaneous') as Transaction['category'],
          type: t.type as 'income' | 'expense',
        }));

        setTransactions(formattedTransactions);
        calculateSummary(formattedTransactions);
        
        // Show success message
        setSuccessMessage(`Successfully imported ${result.imported_count} transactions!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (error) {
        console.error('Failed to refresh transactions:', error);
        setErrorMessage('Failed to refresh transactions after import. Please refresh the page.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }

    setShowCSVUpload(false);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 8000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0A3D62] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800">Success!</h3>
                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="flex-shrink-0 text-green-500 hover:text-green-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here&apos;s your financial overview.</p>
          </div>
          <button
            onClick={() => setShowCSVUpload(!showCSVUpload)}
            className="px-4 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#083048] transition"
          >
            {showCSVUpload ? 'Hide Upload' : '📤 Upload CSV'}
          </button>
        </div>

        {/* CSV Upload Section */}
        {showCSVUpload && (
          <div className="mb-8">
            <CSVUpload
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
            />
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-[#0A3D62]">
                    {formatCurrency(summary.balance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#0A3D62]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
                  <p className="text-2xl font-bold text-[#22C55E]">
                    {formatCurrency(summary.totalIncome)}
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
                  <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-[#EF4444]">
                    {formatCurrency(summary.totalExpenses)}
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
                  <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                  <p className="text-2xl font-bold text-[#0A3D62]">{summary.savingsRate}%</p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySpending.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No spending data yet</p>
                  <p className="text-sm mt-1">Upload transactions to see category breakdown</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorySpending.map((item) => {
                    const percentage = (item.amount / summary.totalExpenses) * 100;
                    return (
                      <div key={item.category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <a href="/transactions" className="text-sm text-[#0A3D62] hover:underline">
                  View All
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No transactions yet</p>
                    <p className="text-sm mt-1">Upload a CSV file to get started</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income'
                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                            : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}
                        >
                          {transaction.type === 'income' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                          }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-6 bg-[#0A3D62]/5 rounded-lg hover:bg-[#0A3D62]/10 transition">
                  <span className="text-3xl mb-2">➕</span>
                  <span className="text-sm font-medium text-[#0A3D62]">Add Transaction</span>
                </button>
                <button className="flex flex-col items-center p-6 bg-[#22C55E]/5 rounded-lg hover:bg-[#22C55E]/10 transition">
                  <span className="text-3xl mb-2">🎯</span>
                  <span className="text-sm font-medium text-[#0A3D62]">Set Budget</span>
                </button>
                <button className="flex flex-col items-center p-6 bg-[#3B82F6]/5 rounded-lg hover:bg-[#3B82F6]/10 transition">
                  <span className="text-3xl mb-2">📊</span>
                  <span className="text-sm font-medium text-[#0A3D62]">View Reports</span>
                </button>
                <button className="flex flex-col items-center p-6 bg-[#F59E0B]/5 rounded-lg hover:bg-[#F59E0B]/10 transition">
                  <span className="text-3xl mb-2">⚙️</span>
                  <span className="text-sm font-medium text-[#0A3D62]">Settings</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}






