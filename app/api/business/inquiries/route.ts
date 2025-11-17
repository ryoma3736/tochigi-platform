import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, paginatedResponse, UnauthorizedError } from '@/lib/errors';
import { inquiriesQuerySchema } from '@/lib/validators';

// TODO: 認証ミドルウェアを実装後、companyIdを取得する
function getCompanyIdFromRequest(request: NextRequest): string {
  const companyId = request.headers.get('x-company-id');
  if (!companyId) {
    throw new UnauthorizedError('認証が必要です');
  }
  return companyId;
}

// GET /api/business/inquiries - 問い合わせ一覧取得（業者向け）
export async function GET(request: NextRequest) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { searchParams } = new URL(request.url);

    // クエリパラメータのバリデーション
    const query = inquiriesQuerySchema.parse({
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      order: searchParams.get('order') || undefined,
    });

    // ページネーション計算
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    // ソート条件
    const orderBy: any = {};
    orderBy[query.sortBy] = query.order;

    // フィルター条件 - InquiryCompany経由で自社への問い合わせを取得
    const where: any = {
      companies: {
        some: {
          companyId,
        },
      },
    };

    if (query.status) {
      where.status = query.status;
    }

    // データ取得
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          message: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          selectedItems: true,
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return paginatedResponse(inquiries, query.page, query.limit, total);
  } catch (error) {
    return handleError(error);
  }
}
