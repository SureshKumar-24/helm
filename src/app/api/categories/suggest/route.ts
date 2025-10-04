import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/CategoryService';

// POST /api/categories/suggest - Suggest category for transaction description
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'description is required' },
        { status: 400 }
      );
    }

    const suggestedCategory = categoryService.suggestCategory(description);

    return NextResponse.json({ 
      category: suggestedCategory,
      confidence: suggestedCategory !== 'Other' ? 'high' : 'low'
    });
  } catch (error) {
    console.error('Error suggesting category:', error);
    return NextResponse.json(
      { error: 'Failed to suggest category' },
      { status: 500 }
    );
  }
}
