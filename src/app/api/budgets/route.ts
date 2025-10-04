import { NextRequest, NextResponse } from 'next/server';
import { budgetCalculationService } from '@/services/BudgetCalculationService';

/**
 * GET /api/budgets/weekly
 * 
 * Get weekly budget status for all categories
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const weekStart = searchParams.get('weekStart');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const weekStartDate = weekStart ? new Date(weekStart) : undefined;
    const budgets = await budgetCalculationService.getWeeklyBudgetStatus(
      userId,
      weekStartDate
    );

    // Calculate overall statistics
    const totalLimit = budgets.reduce((sum, b) => sum + b.weeklyLimit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalLimit - totalSpent;
    const overallPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

    return NextResponse.json({
      budgets,
      summary: {
        totalLimit: Math.round(totalLimit * 100) / 100,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalRemaining: Math.round(totalRemaining * 100) / 100,
        overallPercentage: Math.round(overallPercentage * 10) / 10,
        categoriesCount: budgets.length,
        categoriesOverBudget: budgets.filter(b => b.status === 'over').length,
        categoriesAtRisk: budgets.filter(b => b.status === 'critical' || b.status === 'warning').length,
      },
    });
  } catch (error) {
    console.error('Error fetching weekly budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly budgets' },
      { status: 500 }
    );
  }
}
