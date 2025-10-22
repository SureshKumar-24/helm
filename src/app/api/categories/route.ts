import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/CategoryService';

// GET /api/categories - Fetch categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const includeStats = searchParams.get('includeStats') === 'true';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    let categories;

    if (includeStats) {
      categories = await categoryService.getCategoriesWithStats(
        userId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
    } else {
      categories = await categoryService.getActiveCategories(userId);
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, emoji, monthlyCeiling, isCustom } = body;

    if (!userId || !name || monthlyCeiling === undefined) {
      return NextResponse.json(
        { error: 'userId, name, and monthlyCeiling are required' },
        { status: 400 }
      );
    }

    if (monthlyCeiling < 0) {
      return NextResponse.json(
        { error: 'monthlyCeiling must be positive' },
        { status: 400 }
      );
    }

    const category = await categoryService.createCategory(userId, {
      name,
      emoji,
      monthlyCeiling,
      isCustom,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PATCH /api/categories - Update category
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, name, emoji, monthlyCeiling, isActive } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      );
    }

    if (monthlyCeiling !== undefined && monthlyCeiling < 0) {
      return NextResponse.json(
        { error: 'monthlyCeiling must be positive' },
        { status: 400 }
      );
    }

    const updates: {
      name?: string;
      emoji?: string;
      monthlyCeiling?: number;
      isActive?: boolean;
    } = {};
    if (name !== undefined) updates.name = name;
    if (emoji !== undefined) updates.emoji = emoji;
    if (monthlyCeiling !== undefined) updates.monthlyCeiling = monthlyCeiling;
    if (isActive !== undefined) updates.isActive = isActive;

    const category = await categoryService.updateCategory(id, userId, updates);

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Category not found') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories - Delete or archive category
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      );
    }

    if (permanent) {
      await categoryService.deleteCategory(id, userId);
    } else {
      await categoryService.archiveCategory(id, userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (error instanceof Error && error.message === 'Category not found') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
