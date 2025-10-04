/**
 * BudgetCalculationService
 * 
 * Core service for calculating weekly budgets, tracking spending, and managing carryovers.
 * This is the heart of the Smart Weekly Budget Coach feature.
 */

import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export interface WeeklyBudgetStatus {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  weekStart: Date;
  weekEnd: Date;
  weeklyLimit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'good' | 'warning' | 'critical' | 'over';
  carryover: number;
  dailySafeToSpend: number;
  message: string;
  lastUpdated: Date;
}

export interface ThresholdAlert {
  categoryId: string;
  categoryName: string;
  threshold: 80 | 90 | 100;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  percentageUsed: number;
  remaining: number;
}

export class BudgetCalculationService {
  /**
   * Calculate monthly ceiling based on historical average (last 3 months)
   */
  async calculateMonthlyCeiling(
    categoryId: string,
    userId: string,
    months: number = 3
  ): Promise<number> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        date: { gte: startDate },
        type: 'expense',
      },
      select: { amount: true },
    });

    if (transactions.length === 0) {
      // No historical data, use category's current ceiling or default
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { monthlyCeiling: true },
      });
      return category ? Number(category.monthlyCeiling) : 500;
    }

    const totalSpent = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
    const averageMonthly = totalSpent / months;

    // Add 10% buffer for flexibility
    return Math.ceil(averageMonthly * 1.1);
  }

  /**
   * Calculate weekly limit for a category
   * Formula: (monthlyCeiling / weeksInMonth) - carryover ± goalAdjustments
   */
  async calculateWeeklyLimit(
    categoryId: string,
    userId: string,
    weekStart: Date
  ): Promise<number> {
    // Get category monthly ceiling
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { monthlyCeiling: true },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const monthlyCeiling = Number(category.monthlyCeiling);

    // Calculate average weeks per month (4.33)
    const weeksPerMonth = 4.33;
    const baseWeeklyLimit = monthlyCeiling / weeksPerMonth;

    // Get carryover from previous week
    const carryover = await this.calculateCarryover(categoryId, userId, weekStart);

    // Calculate final weekly limit
    // Positive carryover adds to limit, negative carryover reduces it
    let weeklyLimit = baseWeeklyLimit + carryover;

    // Ensure limit doesn't go below zero
    weeklyLimit = Math.max(0, weeklyLimit);

    return Math.round(weeklyLimit * 100) / 100; // Round to 2 decimals
  }

  /**
   * Calculate carryover from previous week
   * Positive if under budget, negative if over
   */
  async calculateCarryover(
    categoryId: string,
    userId: string,
    currentWeekStart: Date
  ): Promise<number> {
    // Get previous week's budget
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const previousBudget = await prisma.weeklyBudget.findFirst({
      where: {
        userId,
        categoryId,
        weekStart: previousWeekStart,
      },
    });

    if (!previousBudget) {
      return 0; // No previous week data
    }

    // Carryover = weeklyLimit - spent
    const carryover = Number(previousBudget.weeklyLimit) - Number(previousBudget.spent);

    return Math.round(carryover * 100) / 100;
  }

  /**
   * Update weekly spending for current week
   */
  async updateWeeklySpending(
    categoryId: string,
    userId: string,
    amount: number,
    transactionDate: Date
  ): Promise<void> {
    // Get the week that contains this transaction date
    const weekStart = this.getStartOfWeek(transactionDate);
    const weekEnd = this.getEndOfWeek(transactionDate);

    // Find or create weekly budget
    let weeklyBudget = await prisma.weeklyBudget.findFirst({
      where: {
        userId,
        categoryId,
        weekStart,
      },
    });

    if (!weeklyBudget) {
      // Create new weekly budget
      const weeklyLimit = await this.calculateWeeklyLimit(categoryId, userId, weekStart);
      
      weeklyBudget = await prisma.weeklyBudget.create({
        data: {
          userId,
          categoryId,
          weekStart,
          weekEnd,
          weeklyLimit,
          spent: 0,
          carryover: await this.calculateCarryover(categoryId, userId, weekStart),
          status: 'active',
        },
      });
    }

    // Calculate total spent for this week
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
        type: 'expense',
      },
      select: { amount: true },
    });

    const totalSpent = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    // Update weekly budget
    await prisma.weeklyBudget.update({
      where: { id: weeklyBudget.id },
      data: {
        spent: totalSpent,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get current week's budget status for all categories
   */
  async getWeeklyBudgetStatus(
    userId: string,
    weekStart?: Date
  ): Promise<WeeklyBudgetStatus[]> {
    const currentWeekStart = weekStart || this.getStartOfWeek(new Date());
    const currentWeekEnd = this.getEndOfWeek(currentWeekStart);

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    const statuses: WeeklyBudgetStatus[] = [];

    for (const category of categories) {
      // Get or create weekly budget
      let weeklyBudget = await prisma.weeklyBudget.findFirst({
        where: {
          userId,
          categoryId: category.id,
          weekStart: currentWeekStart,
        },
      });

      if (!weeklyBudget) {
        // Create weekly budget for this category
        const weeklyLimit = await this.calculateWeeklyLimit(
          category.id,
          userId,
          currentWeekStart
        );
        const carryover = await this.calculateCarryover(
          category.id,
          userId,
          currentWeekStart
        );

        weeklyBudget = await prisma.weeklyBudget.create({
          data: {
            userId,
            categoryId: category.id,
            weekStart: currentWeekStart,
            weekEnd: currentWeekEnd,
            weeklyLimit,
            spent: 0,
            carryover,
            status: 'active',
          },
        });
      }

      const weeklyLimit = Number(weeklyBudget.weeklyLimit);
      const spent = Number(weeklyBudget.spent);
      const remaining = weeklyLimit - spent;
      const percentageUsed = weeklyLimit > 0 ? (spent / weeklyLimit) * 100 : 0;

      // Determine status
      let status: 'good' | 'warning' | 'critical' | 'over';
      if (percentageUsed >= 100) status = 'over';
      else if (percentageUsed >= 90) status = 'critical';
      else if (percentageUsed >= 80) status = 'warning';
      else status = 'good';

      // Calculate daily safe-to-spend
      const daysRemaining = this.getDaysRemainingInWeek(new Date());
      const dailySafeToSpend = daysRemaining > 0 ? remaining / daysRemaining : remaining;

      // Generate empathetic message
      const message = this.generateMessage(status, remaining, percentageUsed, category.name);

      statuses.push({
        id: weeklyBudget.id,
        categoryId: category.id,
        categoryName: category.name,
        categoryEmoji: category.emoji,
        weekStart: currentWeekStart,
        weekEnd: currentWeekEnd,
        weeklyLimit,
        spent,
        remaining,
        percentageUsed: Math.round(percentageUsed * 10) / 10,
        status,
        carryover: Number(weeklyBudget.carryover),
        dailySafeToSpend: Math.max(0, Math.round(dailySafeToSpend * 100) / 100),
        message,
        lastUpdated: weeklyBudget.updatedAt,
      });
    }

    return statuses;
  }

  /**
   * Check if spending thresholds are crossed (80%, 90%, 100%)
   */
  async checkThresholds(
    categoryId: string,
    userId: string
  ): Promise<ThresholdAlert | null> {
    const weekStart = this.getStartOfWeek(new Date());

    const weeklyBudget = await prisma.weeklyBudget.findFirst({
      where: {
        userId,
        categoryId,
        weekStart,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!weeklyBudget) {
      return null;
    }

    const weeklyLimit = Number(weeklyBudget.weeklyLimit);
    const spent = Number(weeklyBudget.spent);
    const percentageUsed = weeklyLimit > 0 ? (spent / weeklyLimit) * 100 : 0;
    const remaining = weeklyLimit - spent;

    // Determine which threshold was crossed
    let threshold: 80 | 90 | 100 | null = null;
    let severity: 'info' | 'warning' | 'critical' = 'info';
    let message = '';

    if (percentageUsed >= 100) {
      threshold = 100;
      severity = 'critical';
      message = `You've reached your weekly limit for ${weeklyBudget.category.name}. Let's look at options together 🤝`;
    } else if (percentageUsed >= 90) {
      threshold = 90;
      severity = 'warning';
      message = `You're at 90% of your ${weeklyBudget.category.name} budget. You have ${this.formatCurrency(remaining)} left ⚡`;
    } else if (percentageUsed >= 80) {
      threshold = 80;
      severity = 'info';
      message = `Heads up! You've used 80% of your ${weeklyBudget.category.name} budget. ${this.formatCurrency(remaining)} remaining 👍`;
    }

    if (threshold) {
      return {
        categoryId,
        categoryName: weeklyBudget.category.name,
        threshold,
        message,
        severity,
        percentageUsed: Math.round(percentageUsed * 10) / 10,
        remaining,
      };
    }

    return null;
  }

  /**
   * Initialize weekly budgets for all categories (run at start of each week)
   */
  async initializeWeeklyBudgets(userId: string, weekStart?: Date): Promise<number> {
    const currentWeekStart = weekStart || this.getStartOfWeek(new Date());
    const currentWeekEnd = this.getEndOfWeek(currentWeekStart);

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    let createdCount = 0;

    for (const category of categories) {
      // Check if budget already exists
      const existing = await prisma.weeklyBudget.findFirst({
        where: {
          userId,
          categoryId: category.id,
          weekStart: currentWeekStart,
        },
      });

      if (!existing) {
        const weeklyLimit = await this.calculateWeeklyLimit(
          category.id,
          userId,
          currentWeekStart
        );
        const carryover = await this.calculateCarryover(
          category.id,
          userId,
          currentWeekStart
        );

        await prisma.weeklyBudget.create({
          data: {
            userId,
            categoryId: category.id,
            weekStart: currentWeekStart,
            weekEnd: currentWeekEnd,
            weeklyLimit,
            spent: 0,
            carryover,
            status: 'active',
          },
        });

        createdCount++;
      }
    }

    return createdCount;
  }

  /**
   * Get start of week (Monday)
   */
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    return d;
  }

  /**
   * Get end of week (Sunday)
   */
  private getEndOfWeek(date: Date): Date {
    const start = this.getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  /**
   * Get days remaining in current week
   */
  private getDaysRemainingInWeek(date: Date): number {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    const endOfWeek = this.getEndOfWeek(date);
    endOfWeek.setHours(0, 0, 0, 0);
    
    const diffTime = endOfWeek.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays + 1); // Include today
  }

  /**
   * Generate empathetic message based on status
   */
  private generateMessage(
    status: 'good' | 'warning' | 'critical' | 'over',
    remaining: number,
    percentageUsed: number,
    categoryName: string
  ): string {
    const formattedRemaining = this.formatCurrency(Math.abs(remaining));

    switch (status) {
      case 'good':
        if (percentageUsed < 50) {
          return `Great start! You have ${formattedRemaining} left for the week 🎉`;
        }
        return `You're doing well! ${formattedRemaining} remaining 👍`;

      case 'warning':
        return `Approaching your limit. ${formattedRemaining} left for the week ⚡`;

      case 'critical':
        return `Almost at your limit! ${formattedRemaining} remaining. You've got this! 💪`;

      case 'over':
        if (remaining < 0) {
          return `Over budget by ${formattedRemaining}. Let's adjust together 🤝`;
        }
        return `You've reached your limit. Let's look at options 🤝`;

      default:
        return `${formattedRemaining} remaining`;
    }
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

// Export singleton instance
export const budgetCalculationService = new BudgetCalculationService();
