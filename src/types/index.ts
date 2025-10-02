// Core data types for Financial Helm

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: 'income' | 'expense';
  notes?: string;
}

export type Category =
  | 'Housing'
  | 'Transportation'
  | 'Food & Dining'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Education'
  | 'Savings'
  | 'Income'
  | 'Other';

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  transactionCount: number;
}



