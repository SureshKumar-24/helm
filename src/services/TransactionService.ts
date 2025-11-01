/**
 * Transaction Service
 * Handles all transaction-related API operations
 */

import apiClient from '@/lib/api/client';

// Type Definitions
export interface TransactionType {
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
  category: CategoryType | null;
  created_at: string;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

export interface ImportResult {
  success: boolean;
  imported_count: number;
  failed_count: number;
  transactions: TransactionType[];
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  category_id?: string;
  type?: 'income' | 'expense';
  is_recurring?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateTransactionData {
  service_name: string;
  amount: number;
  date: string;
  category_id?: string;
  is_recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date?: string;
  notes?: string;
}

export interface DashboardSummary {
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  instant_expenses: number;
  recurring_expenses: number;
  net_balance: number;
  spending_by_category: CategorySpending[];
  recent_transactions: TransactionType[];
}

export interface CategorySpending {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  total_amount: number;
  percentage: number;
}

class TransactionService {
  private categoriesCache: CategoryType[] | null = null;
  private categoriesCacheTimestamp: number | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private pendingCategoryRequest: Promise<CategoryType[]> | null = null;

  /**
   * Import transactions from CSV file
   */
  async importTransactions(
    file: File,
    type: 'instant' | 'recurring'
  ): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post<ImportResult>(
      '/api/v1/transactions/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Get transactions with optional filters
   */
  async getTransactions(filters?: TransactionFilters): Promise<TransactionType[]> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.type) params.append('type', filters.type);
      if (filters.is_recurring !== undefined) {
        params.append('is_recurring', String(filters.is_recurring));
      }
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/transactions?${queryString}`
      : '/api/v1/transactions';

    const response = await apiClient.get<TransactionType[]>(url);
    return response.data;
  }

  /**
   * Get a single transaction by ID
   */
  async getTransactionById(id: string): Promise<TransactionType> {
    const response = await apiClient.get<TransactionType>(
      `/api/v1/transactions/${id}`
    );
    return response.data;
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    if (!this.categoriesCache || !this.categoriesCacheTimestamp) {
      return false;
    }
    const now = Date.now();
    return now - this.categoriesCacheTimestamp < this.CACHE_TTL;
  }

  /**
   * Get all categories with TTL caching and request deduplication
   */
  async getCategories(forceRefresh: boolean = false): Promise<CategoryType[]> {
    // Return cached categories if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid() && this.categoriesCache) {
      return this.categoriesCache;
    }

    // If there's already a pending request, return that promise (request deduplication)
    if (this.pendingCategoryRequest) {
      return this.pendingCategoryRequest;
    }

    // Create new request
    this.pendingCategoryRequest = apiClient
      .get<CategoryType[]>('/api/v1/transactions/categories/all')
      .then((response) => {
        // Cache the categories with timestamp
        this.categoriesCache = response.data;
        this.categoriesCacheTimestamp = Date.now();
        this.pendingCategoryRequest = null;
        return response.data;
      })
      .catch((error) => {
        // Clear pending request on error
        this.pendingCategoryRequest = null;
        throw error;
      });

    return this.pendingCategoryRequest;
  }

  /**
   * Clear the categories cache
   */
  clearCategoriesCache(): void {
    this.categoriesCache = null;
    this.categoriesCacheTimestamp = null;
    this.pendingCategoryRequest = null;
  }

  /**
   * Create a single transaction manually
   */
  async createTransaction(data: CreateTransactionData): Promise<TransactionType> {
    const formData = new FormData();
    
    formData.append('service_name', data.service_name);
    formData.append('amount', String(data.amount));
    formData.append('date', data.date);
    
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.is_recurring) formData.append('is_recurring', 'true');
    if (data.frequency) formData.append('frequency', data.frequency);
    if (data.start_date) formData.append('start_date', data.start_date);
    if (data.notes) formData.append('notes', data.notes);
    
    const response = await apiClient.post<TransactionType>(
      '/api/v1/transactions',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  /**
   * Update an existing transaction
   */
  async updateTransaction(
    id: string,
    data: Partial<CreateTransactionData>
  ): Promise<TransactionType> {
    const formData = new FormData();
    
    if (data.service_name) formData.append('service_name', data.service_name);
    if (data.amount !== undefined) formData.append('amount', String(data.amount));
    if (data.date) formData.append('date', data.date);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.is_recurring !== undefined) {
      formData.append('is_recurring', String(data.is_recurring));
    }
    if (data.frequency) formData.append('frequency', data.frequency);
    if (data.start_date) formData.append('start_date', data.start_date);
    if (data.notes !== undefined) formData.append('notes', data.notes);
    
    const response = await apiClient.put<TransactionType>(
      `/api/v1/transactions/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/transactions/${id}`);
  }

  /**
   * Get dashboard summary for a specific month and year
   */
  async getDashboardSummary(month: number, year: number): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>(
      `/api/v1/transactions/dashboard/summary?month=${month}&year=${year}`
    );
    return response.data;
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
