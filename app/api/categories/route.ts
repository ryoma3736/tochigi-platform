import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/lib/errors';

// GET /api/categories - カテゴリー一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get('includeCount') === 'true';
    const groupBy = searchParams.get('groupBy') === 'true';

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: includeCount
        ? {
            _count: {
              select: {
                companies: {
                  where: { isActive: true },
                },
              },
            },
          }
        : undefined,
    });

    // グループ別に整理して返す
    if (groupBy) {
      const grouped = categories.reduce((acc: any, category: any) => {
        const group = category.group || 'その他';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(category);
        return acc;
      }, {});

      return successResponse({
        grouped,
        all: categories,
      });
    }

    return successResponse(categories);
  } catch (error) {
    return handleError(error);
  }
}
