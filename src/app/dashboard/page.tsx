'use client';

import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Transaction, FinancialSummary } from '@/types';

export default function Dashboard() {
  const [summary] = useState<FinancialSummary>({
    totalIncome: 5000,
    totalExpenses: 3250,
    balance: 1750,
    savingsRate: 35,
    transactionCount: 42,
  });

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-10-01',
      description: 'Salary Deposit',
      amount: 5000,
      category: 'Income',
      type: 'income',
    },
    {
      id: '2',
      date: '2025-09-30',
      description: 'Rent Payment',
      amount: 1200,
      category: 'Housing',
      type: 'expense',
    },
    {
      id: '3',
      date: '2025-09-29',
      description: 'Grocery Store',
      amount: 85.50,
      category: 'Food & Dining',
      type: 'expense',
    },
    {
      id: '4',
      date: '2025-09-28',
      description: 'Gas Station',
      amount: 45,
      category: 'Transportation',
      type: 'expense',
    },
  ]);

  const categorySpending = [
    { category: 'Housing', amount: 1200, color: '#0A3D62' },
    { category: 'Food & Dining', amount: 650, color: '#22C55E' },
    { category: 'Transportation', amount: 300, color: '#3B82F6' },
    { category: 'Entertainment', amount: 250, color: '#F59E0B' },
    { category: 'Shopping', amount: 400, color: '#EF4444' },
    { category: 'Other', amount: 450, color: '#8B5CF6' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your financial overview.</p>
        </div>

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
                      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</p>
                    </div>
                  );
                })}
              </div>
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
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
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
                ))}
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



