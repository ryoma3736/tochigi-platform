import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse, paginatedResponse, NotFoundError, UnauthorizedError } from '@/lib/errors';
import { serviceSchema, servicesQuerySchema } from '@/lib/validators';

// TODO: 認証ミドルウェアを実装後、companyIdを取得する
function getCompanyIdFromRequest(request: NextRequest): string {
  const companyId = request.headers.get('x-company-id');
  if (!companyId) {
    throw new UnauthorizedError('認証が必要です');
  }
  return companyId;
}

// GET /api/business/services - サービス一覧取得（業者向け）
export async function GET(request: NextRequest) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { searchParams } = new URL(request.url);

    // クエリパラメータのバリデーション
    const query = servicesQuerySchema.parse({
      isActive: searchParams.get('isActive') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    // フィルター条件
    const where: any = {
      companyId,
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    // ページネーション
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    // データ取得
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.count({ where }),
    ]);

    return paginatedResponse(services, query.page, query.limit, total);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/business/services - サービス作成
export async function POST(request: NextRequest) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const body = await request.json();

    // バリデーション
    const validatedData = serviceSchema.parse(body);

    // 業者が存在するか確認
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, isActive: true },
    });

    if (!company || !company.isActive) {
      throw new NotFoundError('業者');
    }

    // サービス作成
    const service = await prisma.service.create({
      data: {
        companyId,
        name: validatedData.name,
        description: validatedData.description,
        priceFrom: validatedData.priceFrom,
        priceTo: validatedData.priceTo,
        unit: validatedData.unit,
        isActive: validatedData.isActive,
      },
    });

    return successResponse(service, 201);
  } catch (error) {
    return handleError(error);
  }
}
