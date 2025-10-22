/**
 * CategoryService
 * 
 * Manages category CRUD operations and auto-categorization logic.
 */

import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

export interface CategoryCreate {
  name: string;
  emoji?: string;
  monthlyCeiling: number;
  isCustom?: boolean;
}

export interface CategoryUpdate {
  name?: string;
  emoji?: string;
  monthlyCeiling?: number;
  isActive?: boolean;
}

export interface CategoryWithStats extends Category {
  transactionCount?: number;
  totalSpent?: number;
}

// Category keywords for auto-categorization
const CATEGORY_PATTERNS: Record<string, string[]> = {
  'Housing': [
    'rent', 'mortgage', 'property', 'landlord', 'apartment', 'condo',
    'hoa', 'homeowners', 'property tax', 'home insurance'
  ],
  'Food & Dining': [
    'grocery', 'supermarket', 'food', 'restaurant', 'cafe', 'coffee',
    'starbucks', 'mcdonald', 'burger', 'pizza', 'chipotle', 'subway',
    'whole foods', 'trader joe', 'safeway', 'kroger', 'walmart grocery',
    'dining', 'lunch', 'dinner', 'breakfast', 'doordash', 'uber eats',
    'grubhub', 'postmates', 'delivery'
  ],
  'Transportation': [
    'gas', 'fuel', 'shell', 'chevron', 'exxon', 'bp', 'mobil',
    'uber', 'lyft', 'taxi', 'car', 'auto', 'vehicle', 'parking',
    'toll', 'metro', 'transit', 'bus', 'train', 'subway',
    'car payment', 'auto insurance', 'car insurance', 'dmv'
  ],
  'Entertainment': [
    'netflix', 'hulu', 'disney', 'spotify', 'apple music', 'youtube',
    'movie', 'cinema', 'theater', 'concert', 'ticket', 'event',
    'game', 'gaming', 'steam', 'playstation', 'xbox', 'nintendo',
    'entertainment', 'amusement', 'recreation'
  ],
  'Shopping': [
    'amazon', 'target', 'walmart', 'costco', 'best buy', 'apple store',
    'mall', 'shopping', 'retail', 'store', 'purchase', 'ebay',
    'clothing', 'shoes', 'fashion', 'apparel', 'accessories'
  ],
  'Healthcare': [
    'doctor', 'hospital', 'medical', 'pharmacy', 'cvs', 'walgreens',
    'health', 'dental', 'dentist', 'clinic', 'urgent care',
    'prescription', 'medicine', 'drug', 'healthcare', 'insurance'
  ],
  'Utilities': [
    'electric', 'electricity', 'power', 'gas bill', 'water', 'sewer',
    'internet', 'cable', 'phone', 'mobile', 'verizon', 'at&t',
    'comcast', 'spectrum', 'utility', 'bill'
  ],
  'Subscriptions': [
    'subscription', 'membership', 'monthly', 'annual', 'recurring',
    'adobe', 'microsoft', 'google', 'icloud', 'dropbox', 'gym',
    'fitness', 'planet fitness', '24 hour fitness'
  ],
};

export class CategoryService {
  /**
   * Get all active categories for a user
   */
  async getActiveCategories(userId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get all categories (including inactive) for a user
   */
  async getAllCategories(userId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get categories with transaction statistics
   */
  async getCategoriesWithStats(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<CategoryWithStats[]> {
    const categories = await this.getActiveCategories(userId);

    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const where: {
          userId: string;
          categoryId: string;
          date?: {
            gte?: Date;
            lte?: Date;
          };
        } = {
          userId,
          categoryId: category.id,
        };

        if (startDate || endDate) {
          where.date = {};
          if (startDate) where.date.gte = startDate;
          if (endDate) where.date.lte = endDate;
        }

        const transactions = await prisma.transaction.findMany({
          where,
          select: {
            amount: true,
          },
        });

        const transactionCount = transactions.length;
        const totalSpent = transactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

        return {
          ...category,
          transactionCount,
          totalSpent,
        };
      })
    );

    return categoriesWithStats;
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(categoryId: string, userId: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });
  }

  /**
   * Create a new category
   */
  async createCategory(
    userId: string,
    data: CategoryCreate
  ): Promise<Category> {
    // Check if category with same name already exists
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
      },
    });

    if (existing) {
      throw new Error(`Category "${data.name}" already exists`);
    }

    return prisma.category.create({
      data: {
        userId,
        name: data.name,
        emoji: data.emoji || '📊',
        monthlyCeiling: data.monthlyCeiling,
        isCustom: data.isCustom ?? true,
        isActive: true,
      },
    });
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    categoryId: string,
    userId: string,
    updates: CategoryUpdate
  ): Promise<Category> {
    // Verify category belongs to user
    const existing = await this.getCategoryById(categoryId, userId);
    if (!existing) {
      throw new Error('Category not found');
    }

    // If name is being changed, check for duplicates
    if (updates.name && updates.name !== existing.name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          userId,
          name: updates.name,
          id: { not: categoryId },
        },
      });

      if (duplicate) {
        throw new Error(`Category "${updates.name}" already exists`);
      }
    }

    return prisma.category.update({
      where: { id: categoryId },
      data: updates,
    });
  }

  /**
   * Archive a category (soft delete)
   */
  async archiveCategory(categoryId: string, userId: string): Promise<void> {
    // Verify category belongs to user
    const existing = await this.getCategoryById(categoryId, userId);
    if (!existing) {
      throw new Error('Category not found');
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false },
    });
  }

  /**
   * Delete a category permanently
   * Note: This will set categoryId to null for all associated transactions
   */
  async deleteCategory(categoryId: string, userId: string): Promise<void> {
    // Verify category belongs to user
    const existing = await this.getCategoryById(categoryId, userId);
    if (!existing) {
      throw new Error('Category not found');
    }

    // Update transactions to remove category reference
    await prisma.transaction.updateMany({
      where: { categoryId },
      data: { categoryId: null },
    });

    // Delete the category
    await prisma.category.delete({
      where: { id: categoryId },
    });
  }

  /**
   * Suggest category based on transaction description
   * Uses keyword matching with scoring
   */
  suggestCategory(description: string): string {
    const normalizedDesc = description.toLowerCase();
    const scores: Record<string, number> = {};

    // Calculate scores for each category
    for (const [category, keywords] of Object.entries(CATEGORY_PATTERNS)) {
      let score = 0;

      for (const keyword of keywords) {
        if (normalizedDesc.includes(keyword.toLowerCase())) {
          // Longer keywords get higher scores (more specific)
          score += keyword.length;
        }
      }

      if (score > 0) {
        scores[category] = score;
      }
    }

    // Return category with highest score
    if (Object.keys(scores).length > 0) {
      const bestMatch = Object.entries(scores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      return bestMatch[0];
    }

    return 'Other';
  }

  /**
   * Bulk categorize transactions
   * Useful for re-categorizing existing transactions
   */
  async bulkCategorize(
    userId: string,
    transactionIds: string[],
    categoryId: string
  ): Promise<number> {
    // Verify category belongs to user
    const category = await this.getCategoryById(categoryId, userId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Update transactions
    const result = await prisma.transaction.updateMany({
      where: {
        id: { in: transactionIds },
        userId,
      },
      data: {
        categoryId,
      },
    });

    return result.count;
  }

  /**
   * Auto-categorize uncategorized transactions
   */
  async autoCategorizeTransactions(userId: string): Promise<number> {
    // Get uncategorized transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        categoryId: null,
      },
    });

    let categorizedCount = 0;

    for (const transaction of transactions) {
      const suggestedCategory = this.suggestCategory(transaction.description);

      // Find or create category
      let category = await prisma.category.findFirst({
        where: {
          userId,
          name: suggestedCategory,
        },
      });

      if (!category) {
        // Create default category
        category = await this.createCategory(userId, {
          name: suggestedCategory,
          emoji: this.getCategoryEmoji(suggestedCategory),
          monthlyCeiling: 500,
          isCustom: false,
        });
      }

      // Update transaction
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { categoryId: category.id },
      });

      categorizedCount++;
    }

    return categorizedCount;
  }

  /**
   * Get default emoji for category name
   */
  private getCategoryEmoji(categoryName: string): string {
    const emojiMap: Record<string, string> = {
      'Housing': '🏠',
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Healthcare': '⚕️',
      'Utilities': '💡',
      'Subscriptions': '📱',
      'Other': '📊',
    };

    return emojiMap[categoryName] || '📊';
  }

  /**
   * Calculate monthly ceiling based on historical spending
   */
  async calculateMonthlyCeiling(
    userId: string,
    categoryId: string,
    months: number = 3
  ): Promise<number> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        date: {
          gte: startDate,
        },
        type: 'expense',
      },
      select: {
        amount: true,
      },
    });

    if (transactions.length === 0) {
      return 500; // Default ceiling
    }

    const totalSpent = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    const averageMonthly = totalSpent / months;

    // Add 10% buffer
    return Math.ceil(averageMonthly * 1.1);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
