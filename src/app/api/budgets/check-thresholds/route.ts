import { NextRequest, NextResponse } from 'next/server';
import { budgetCalculationService } from '@/services/BudgetCalculationService';

/**
 * POST /api/budgets/check-thresholds
 * 
 * Check if spending thresholds (80%, 90%, 100%) are crossed for a category
 * Returns alert if threshold is crossed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, categoryId } = body;

    if (!userId || !categoryId) {
      return NextResponse.json(
        { error: 'userId and categoryId are required' },
        { status: 400 }
      );
    }

    const alert = await budgetCalculationService.checkThresholds(categoryId, userId);

    if (alert) {
      return NextResponse.json({
        hasAlert: true,
        alert,
      });
    }

    return NextResponse.json({
      hasAlert: false,
      message: 'No threshold alerts',
    });
  } catch (error) {
    console.error('Error checking thresholds:', error);
    return NextResponse.json(
      { error: 'Failed to check thresholds' },
      { status: 500 }
    );
  }
}
