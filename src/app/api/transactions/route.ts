import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { budgetCalculationService } from '@/services/BudgetCalculationService';

// GET /api/transactions - Fetch transactions with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: {
      userId: string;
      categoryId?: string;
      type?: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = { userId };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type && (type === 'income' || type === 'expense')) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            emoji: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, transactions } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'transactions array is required' },
        { status: 400 }
      );
    }

    // Validate each transaction
    for (const transaction of transactions) {
      if (!transaction.date || !transaction.description || transaction.amount === undefined) {
        return NextResponse.json(
          { error: 'Each transaction must have date, description, and amount' },
          { status: 400 }
        );
      }

      if (!['income', 'expense'].includes(transaction.type)) {
        return NextResponse.json(
          { error: 'Transaction type must be income or expense' },
          { status: 400 }
        );
      }
    }

    // Find or create categories
    const categoryMap = new Map<string, string>();
    
    for (const transaction of transactions) {
      if (transaction.category && !categoryMap.has(transaction.category)) {
        // Try to find existing category
        let category = await prisma.category.findFirst({
          where: {
            userId,
            name: transaction.category,
          },
        });

        // Create category if it doesn't exist
        if (!category) {
          category = await prisma.category.create({
            data: {
              userId,
              name: transaction.category,
              emoji: getCategoryEmoji(transaction.category),
              monthlyCeiling: 500, // Default ceiling
              isCustom: true,
            },
          });
        }

        categoryMap.set(transaction.category, category.id);
      }
    }

    // Create transactions
    const createdTransactions = await prisma.$transaction(
      transactions.map((transaction: {
        date: string;
        description: string;
        amount: number;
        type: string;
        category?: string;
        notes?: string;
      }) => {
        const categoryId = transaction.category 
          ? categoryMap.get(transaction.category) 
          : null;

        return prisma.transaction.create({
          data: {
            userId,
            categoryId,
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            notes: transaction.notes,
            source: 'csv',
          },
        });
      })
    );

    // Update weekly budgets for affected categories
    const affectedCategories = new Set<string>();
    for (const transaction of createdTransactions) {
      if (transaction.categoryId && transaction.type === 'expense') {
        affectedCategories.add(transaction.categoryId);
      }
    }

    // Update spending for each affected category
    for (const categoryId of affectedCategories) {
      try {
        // Get a transaction from this category to get the date
        const sampleTransaction = createdTransactions.find(
          (t) => t.categoryId === categoryId
        );
        if (sampleTransaction) {
          await budgetCalculationService.updateWeeklySpending(
            categoryId,
            userId,
            0, // Amount not needed, we recalculate from all transactions
            sampleTransaction.date
          );
        }
      } catch (error) {
        console.error(`Failed to update budget for category ${categoryId}:`, error);
        // Continue with other categories
      }
    }

    return NextResponse.json({
      success: true,
      count: createdTransactions.length,
      transactions: createdTransactions,
    });
  } catch (error) {
    console.error('Error creating transactions:', error);
    return NextResponse.json(
      { error: 'Failed to create transactions' },
      { status: 500 }
    );
  }
}

// PATCH /api/transactions/:id - Update transaction
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, categoryId, description, amount, type, notes } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      );
    }

    // Verify transaction belongs to user
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(type !== undefined && { type }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            emoji: true,
          },
        },
      },
    });

    return NextResponse.json({ transaction: updated });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/:id - Delete transaction
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      );
    }

    // Verify transaction belongs to user
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Delete transaction
    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}

// Helper function to get emoji for category
function getCategoryEmoji(categoryName: string): string {
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
