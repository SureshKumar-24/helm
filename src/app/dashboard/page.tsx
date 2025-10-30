'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import CSVUpload from '@/components/CSVUpload';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type { Transaction, FinancialSummary } from '@/types';

function DashboardContent() {
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
    transactionCount: 0,
  });

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      const parsedTransactions = JSON.parse(stored);
      setTransactions(parsedTransactions);
      calculateSummary(parsedTransactions);
    }
  }, []);

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

  const handleUploadComplete = (uploadedTransactions: { date: string; description: string; amount: number; type: string; category?: string }[]) => {
    console.log('Uploaded transactions:', uploadedTransactions);
    
    // Convert to Transaction format with IDs
    const transactionsWithIds: Transaction[] = uploadedTransactions.map((t, index) => ({
      id: `${Date.now()}-${index}`,
      date: t.date,
      description: t.description,
      amount: t.amount,
      category: (t.category || 'Uncategorized') as Transaction['category'],
      type: t.type as 'income' | 'expense',
    }));
    
    // Store in localStorage
    localStorage.setItem('transactions', JSON.stringify(transactionsWithIds));
    
    // Update state
    setTransactions(transactionsWithIds);
    calculateSummary(transactionsWithIds);
    
    setShowCSVUpload(false);
    alert(`Successfully imported ${uploadedTransactions.length} transactions! 🎉`);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    alert(`Error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income'
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
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
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






