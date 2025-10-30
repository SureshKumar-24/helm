'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type { ParsedTransaction } from '@/services/CSVParserService';

function TransactionsContent() {
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    // Load transactions from localStorage
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Transactions</h1>
          <p className="text-gray-600">View and manage all your transactions</p>
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
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-[#0A3D62] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'income'
                ? 'bg-[#22C55E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Income ({transactions.filter((t) => t.type === 'income').length})
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'expense'
                ? 'bg-[#EF4444] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Expenses ({transactions.filter((t) => t.type === 'expense').length})
          </button>
        </div>

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
                        Description
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {transaction.category || 'Uncategorized'}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
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
