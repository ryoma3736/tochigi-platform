import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse } from '@/lib/errors';

// GET /api/categories - カテゴリー一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get('includeCount') === 'true';

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

    return successResponse(categories);
  } catch (error) {
    return handleError(error);
  }
}
