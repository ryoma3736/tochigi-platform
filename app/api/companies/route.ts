import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, paginatedResponse } from '@/lib/errors';
import { companiesQuerySchema } from '@/lib/validators';

// GET /api/companies - 業者一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータのバリデーション
    const query = companiesQuerySchema.parse({
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      order: searchParams.get('order') || undefined,
    });

    // フィルター条件の構築
    const where: any = {
      isActive: true,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // ページネーション計算
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    // ソート条件
    const orderBy: any = {};
    orderBy[query.sortBy] = query.order;

    // データ取得
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          services: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              description: true,
              priceFrom: true,
              priceTo: true,
              unit: true,
            },
          },
          _count: {
            select: {
              services: true,
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return paginatedResponse(companies, query.page, query.limit, total);
  } catch (error) {
    return handleError(error);
  }
}
