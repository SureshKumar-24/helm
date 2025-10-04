import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/CategoryService';

// POST /api/categories/auto-categorize - Auto-categorize uncategorized transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const categorizedCount = await categoryService.autoCategorizeTransactions(userId);

    return NextResponse.json({ 
      success: true,
      categorizedCount,
      message: `Successfully categorized ${categorizedCount} transaction(s)`
    });
  } catch (error) {
    console.error('Error auto-categorizing transactions:', error);
    return NextResponse.json(
      { error: 'Failed to auto-categorize transactions' },
      { status: 500 }
    );
  }
}
