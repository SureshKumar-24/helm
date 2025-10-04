import { NextRequest, NextResponse } from 'next/server';
import { budgetCalculationService } from '@/services/BudgetCalculationService';

/**
 * POST /api/budgets/initialize
 * 
 * Initialize weekly budgets for all categories
 * This should be called:
 * - At the start of each week (Monday)
 * - When a new user signs up
 * - When new categories are created
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weekStart } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const weekStartDate = weekStart ? new Date(weekStart) : undefined;
    const createdCount = await budgetCalculationService.initializeWeeklyBudgets(
      userId,
      weekStartDate
    );

    return NextResponse.json({
      success: true,
      createdCount,
      message: `Initialized ${createdCount} weekly budget(s)`,
    });
  } catch (error) {
    console.error('Error initializing weekly budgets:', error);
    return NextResponse.json(
      { error: 'Failed to initialize weekly budgets' },
      { status: 500 }
    );
  }
}
