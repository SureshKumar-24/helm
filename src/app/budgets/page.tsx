'use client';

import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Budget } from '@/types';

export default function Budgets() {
  const [budgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Housing',
      limit: 1500,
      spent: 1200,
      period: 'monthly',
    },
    {
      id: '2',
      category: 'Food & Dining',
      limit: 800,
      spent: 650,
      period: 'monthly',
    },
    {
      id: '3',
      category: 'Transportation',
      limit: 400,
      spent: 300,
      period: 'monthly',
    },
    {
      id: '4',
      category: 'Entertainment',
      limit: 300,
      spent: 250,
      period: 'monthly',
    },
    {
      id: '5',
      category: 'Shopping',
      limit: 500,
      spent: 400,
      period: 'monthly',
    },
    {
      id: '6',
      category: 'Healthcare',
      limit: 300,
      spent: 150,
      period: 'monthly',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-[#EF4444]';
    if (percentage >= 70) return 'text-[#F59E0B]';
    return 'text-[#22C55E]';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '#EF4444';
    if (percentage >= 70) return '#F59E0B';
    return '#22C55E';
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Budget Management</h1>
          <p className="text-gray-600">Set and track your spending limits by category.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-[#0A3D62]">{formatCurrency(totalBudget)}</p>
              <p className="text-xs text-gray-500 mt-2">Monthly limit</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {overallPercentage.toFixed(1)}% of budget used
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totalRemaining)}</p>
              <p className="text-xs text-gray-500 mt-2">Available to spend</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Overall Budget Progress</h3>
              <span className={`font-semibold ${getStatusColor(overallPercentage)}`}>
                {overallPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${overallPercentage}%`,
                  backgroundColor: getProgressColor(overallPercentage),
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span>Budget: {formatCurrency(totalBudget)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Budget List */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0A3D62]">Category Budgets</h2>
          <Button variant="secondary">+ Add Budget</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = getPercentage(budget.spent, budget.limit);
            const remaining = budget.limit - budget.spent;

            return (
              <Card key={budget.id} hover>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{budget.period}</p>
                    </div>
                    <span className={`text-xl font-bold ${getStatusColor(percentage)}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getProgressColor(percentage),
                        }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Spent</p>
                        <p className="font-semibold text-[#EF4444]">{formatCurrency(budget.spent)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="font-semibold text-[#0A3D62]">{formatCurrency(budget.limit)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Left</p>
                        <p className={`font-semibold ${remaining > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                          {formatCurrency(Math.max(remaining, 0))}
                        </p>
                      </div>
                    </div>

                    {/* Warning Message */}
                    {percentage >= 90 && (
                      <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3">
                        <p className="text-sm text-[#EF4444] font-medium">
                          ⚠️ You&apos;ve used {percentage.toFixed(0)}% of your budget!
                        </p>
                      </div>
                    )}

                    {percentage >= 70 && percentage < 90 && (
                      <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg p-3">
                        <p className="text-sm text-[#F59E0B] font-medium">
                          ⚡ Approaching limit: {percentage.toFixed(0)}% used
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 text-sm py-2 px-4 bg-[#0A3D62]/5 text-[#0A3D62] rounded-lg hover:bg-[#0A3D62]/10 transition">
                        Edit
                      </button>
                      <button className="flex-1 text-sm py-2 px-4 bg-[#EF4444]/5 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Budget Tips 💡</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#22C55E] mr-2">✓</span>
                <span>Review your budget weekly to stay on track</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#22C55E] mr-2">✓</span>
                <span>Set realistic limits based on your income and needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#22C55E] mr-2">✓</span>
                <span>Adjust budgets seasonally for varying expenses</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#22C55E] mr-2">✓</span>
                <span>Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



