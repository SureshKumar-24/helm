'use client';

import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Transaction } from '@/types';

export default function Transactions() {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-10-01',
      description: 'Salary Deposit',
      amount: 5000,
      category: 'Income',
      type: 'income',
      notes: 'Monthly salary',
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
    {
      id: '5',
      date: '2025-09-27',
      description: 'Netflix Subscription',
      amount: 15.99,
      category: 'Entertainment',
      type: 'expense',
    },
    {
      id: '6',
      date: '2025-09-26',
      description: 'Freelance Project',
      amount: 500,
      category: 'Income',
      type: 'income',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredTransactions = transactions
    .filter((t) => filter === 'all' || t.type === filter)
    .filter((t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Transactions</h1>
          <p className="text-gray-600">Track and manage all your financial transactions.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(totalExpenses)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Net Balance</p>
              <p className="text-2xl font-bold text-[#0A3D62]">
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'primary' : 'ghost'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'income' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('income')}
                >
                  Income
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'expense' ? 'outline' : 'ghost'}
                  onClick={() => setFilter('expense')}
                >
                  Expenses
                </Button>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                />
                <Button size="md" variant="secondary">
                  + Add New
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No transactions found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or add a new transaction</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          transaction.type === 'income'
                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                            : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}
                      >
                        {transaction.type === 'income' ? '↑' : '↓'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">{transaction.category}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {transaction.notes && (
                          <p className="text-xs text-gray-400 mt-1">{transaction.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-bold ${
                          transaction.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button className="text-[#0A3D62] hover:text-[#083048] p-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-[#EF4444] hover:text-[#DC2626] p-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




