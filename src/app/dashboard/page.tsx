'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import CSVUpload from '@/components/CSVUpload';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionService, DashboardSummary } from '@/services/TransactionService';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function DashboardContent() {
  const { user } = useAuth();
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Month/Year filtering - default to current month
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // 1-12 for API

  // Dashboard data from API
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await transactionService.getDashboardSummary(selectedMonth, selectedYear);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setErrorMessage('Failed to load dashboard data. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, selectedMonth, selectedYear]);

  // Get data from dashboard API response - parse strings to numbers
  const summary = dashboardData ? {
    totalIncome: parseFloat(String(dashboardData.total_income)),
    totalExpenses: parseFloat(String(dashboardData.total_expenses)),
    balance: parseFloat(String(dashboardData.net_balance)),
    savingsRate: parseFloat(String(dashboardData.total_income)) > 0
      ? ((parseFloat(String(dashboardData.net_balance)) / parseFloat(String(dashboardData.total_income))) * 100)
      : 0,
    transactionCount: dashboardData.recent_transactions.length,
  } : {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
    transactionCount: 0,
  };

  const recurringExpenses = dashboardData?.recurring_expenses ? parseFloat(String(dashboardData.recurring_expenses)) : 0;
  const instantExpenses = dashboardData?.instant_expenses ? parseFloat(String(dashboardData.instant_expenses)) : 0;

  // Parse string amounts to numbers for the chart
  const categorySpending = (dashboardData?.spending_by_category || []).map(cat => ({
    ...cat,
    total_amount: parseFloat(String(cat.total_amount)),
  }));

  const recentTransactions = dashboardData?.recent_transactions || [];

  // Month names for selector
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year and 2 years back)
  const yearOptions = [currentDate.getFullYear(), currentDate.getFullYear() - 1, currentDate.getFullYear() - 2];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleUploadComplete = async (result: { imported_count: number }) => {
    console.log('Upload result:', result);

    // Refresh dashboard data after successful upload
    if (user?.id) {
      try {
        const data = await transactionService.getDashboardSummary(selectedMonth, selectedYear);
        setDashboardData(data);

        // Show success message
        setSuccessMessage(`Successfully imported ${result.imported_count} transactions!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (error) {
        console.error('Failed to refresh dashboard:', error);
        setErrorMessage('Failed to refresh dashboard after import. Please refresh the page.');
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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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

          {/* Month/Year Selector */}
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">📅 Period:</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] bg-white font-medium"
                  >
                    {monthNames.map((month, index) => (
                      <option key={index + 1} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] bg-white font-medium"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-auto text-sm text-gray-600">
                  Showing data for <span className="font-bold text-[#0A3D62]">{monthNames[selectedMonth - 1]} {selectedYear}</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Income</p>
                  <p className="text-2xl font-bold text-[#22C55E]">
                    {formatCurrency(summary.totalIncome)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💵</span>
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
                    {formatCurrency(summary.totalExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#EF4444]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recurring</p>
                  <p className="text-2xl font-bold text-[#F59E0B]">
                    {formatCurrency(recurringExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instant</p>
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {formatCurrency(instantExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
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
                    {formatCurrency(summary.balance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#0A3D62]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending by Category Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categorySpending.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No spending data for {monthNames[selectedMonth - 1]} {selectedYear}</p>
                <p className="text-sm mt-1">Upload transactions or select a different month</p>
                <p className="text-xs mt-2 text-gray-400">
                  Total Expenses: {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
            ) : (
              <div>
                {/* Chart */}
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={categorySpending.map(item => ({
                          name: item.category_name,
                          value: item.total_amount,
                          color: item.category_color,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => {
                          const percent = Number(props.percent) || 0;
                          return `${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={110}
                        innerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {categorySpending.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.category_color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '8px 12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legend - Bigger and Better */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categorySpending.map((item) => {
                      return (
                        <div
                          key={item.category_id}
                          className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                          <div
                            className="w-6 h-6 rounded-lg flex-shrink-0 shadow-md"
                            style={{ backgroundColor: item.category_color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {item.category_name}
                            </p>
                            <p className="text-xs text-gray-600 font-semibold">
                              {formatCurrency(item.total_amount)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <a href="/transactions" className="text-sm text-[#0A3D62] hover:underline font-medium">
                View All →
              </a>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No transactions yet</p>
                <p className="text-sm mt-1">Upload a CSV file to get started</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gray-100">
                        {transaction.category?.icon || '💰'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.service}</p>
                        <p className="text-xs text-gray-500">
                          {transaction.category?.name || 'Miscellaneous'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold text-lg ${transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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






