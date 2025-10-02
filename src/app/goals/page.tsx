'use client';

import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { FinancialGoal } from '@/types';

export default function Goals() {
  const [goals] = useState<FinancialGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2025-12-31',
      category: 'Savings',
    },
    {
      id: '2',
      name: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 2300,
      deadline: '2026-06-30',
      category: 'Travel',
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 2000,
      currentAmount: 1500,
      deadline: '2025-11-15',
      category: 'Technology',
    },
    {
      id: '4',
      name: 'Down Payment for Car',
      targetAmount: 15000,
      currentAmount: 8000,
      deadline: '2026-12-31',
      category: 'Transportation',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return '#22C55E';
    if (percentage >= 50) return '#3B82F6';
    if (percentage >= 25) return '#F59E0B';
    return '#EF4444';
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Financial Goals</h1>
          <p className="text-gray-600">Track your progress toward your savings goals.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Goals</p>
                  <p className="text-3xl font-bold text-[#0A3D62]">{goals.length}</p>
                </div>
                <div className="w-14 h-14 bg-[#0A3D62]/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                  <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totalSaved)}</p>
                  <p className="text-xs text-gray-500 mt-1">of {formatCurrency(totalTarget)}</p>
                </div>
                <div className="w-14 h-14 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
                  <p className="text-3xl font-bold text-[#0A3D62]">{overallProgress.toFixed(0)}%</p>
                </div>
                <div className="w-14 h-14 bg-[#3B82F6]/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Goal Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0A3D62]">Your Goals</h2>
          <Button variant="secondary">+ Add New Goal</Button>
        </div>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = getPercentage(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysLeft = getDaysRemaining(goal.deadline);

            return (
              <Card key={goal.id} hover>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{goal.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-[#0A3D62]/10 text-[#0A3D62] px-2 py-1 rounded">
                          {goal.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#0A3D62]">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Circle Visual */}
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-[#22C55E]">
                            {formatCurrency(goal.currentAmount)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-gray-600">
                            {formatCurrency(goal.targetAmount)}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                        <div
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getProgressColor(percentage),
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300"
                        ></div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Remaining</p>
                        <p className="font-semibold text-[#0A3D62]">{formatCurrency(remaining)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Target Date</p>
                        <p className="font-semibold text-[#0A3D62]">
                          {new Date(goal.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Monthly Savings Suggestion */}
                    {daysLeft > 0 && remaining > 0 && (
                      <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Suggested monthly savings:</p>
                        <p className="text-sm font-semibold text-[#22C55E]">
                          {formatCurrency(remaining / Math.ceil(daysLeft / 30))}/month
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 text-sm py-2 px-4 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition">
                        Add Funds
                      </button>
                      <button className="text-sm py-2 px-4 bg-[#0A3D62]/5 text-[#0A3D62] rounded-lg hover:bg-[#0A3D62]/10 transition">
                        Edit
                      </button>
                      <button className="text-sm py-2 px-4 bg-[#EF4444]/5 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Goal Setting Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Achieving Your Goals 🌟</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Be Specific</h4>
                  <p className="text-sm text-gray-600">
                    Set clear, measurable goals with exact amounts and deadlines
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Set Realistic Timelines</h4>
                  <p className="text-sm text-gray-600">
                    Choose achievable deadlines based on your income and expenses
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💪</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Stay Consistent</h4>
                  <p className="text-sm text-gray-600">
                    Make regular contributions, even if they&apos;re small
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review Regularly</h4>
                  <p className="text-sm text-gray-600">
                    Check your progress monthly and adjust as needed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



