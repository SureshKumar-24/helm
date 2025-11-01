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

// Backend API Types
export interface BackendTransaction {
  id: string;
  user_id: string;
  service: string;
  description: string | null;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  source: string;
  is_recurring: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  start_date: string | null;
  category: BackendCategory | null;
  created_at: string;
}

export interface BackendCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

// Transformation Functions
export function transformBackendTransaction(bt: BackendTransaction): Transaction {
  return {
    id: bt.id,
    date: bt.date,
    description: bt.service,
    amount: Math.abs(bt.amount),
    category: (bt.category?.name as Category) || 'Uncategorized',
    type: bt.type,
    notes: bt.description || undefined,
  };
}

export function transformBackendCategory(bc: BackendCategory): {
  name: string;
  icon: string;
  color: string;
} {
  return {
    name: bc.name,
    icon: bc.icon || '📦',
    color: bc.color || '#6B7280',
  };
}






