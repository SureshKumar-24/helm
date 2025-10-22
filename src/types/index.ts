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
  | 'Entertainment'
  | 'Music'
  | 'Video Streaming'
  | 'Software/Cloud'
  | 'Communications'
  | 'Utilities'
  | 'Travel/Transport'
  | 'Groceries'
  | 'Health/Wellness'
  | 'Miscellaneous'
  | 'Income'
  | 'Uncategorized';

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






