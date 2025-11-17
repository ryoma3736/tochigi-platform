import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse, NotFoundError } from '@/lib/errors';
import { servicesQuerySchema } from '@/lib/validators';

// GET /api/companies/[id]/services - 業者のサービス一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // 業者が存在するか確認
    const company = await prisma.company.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!company || !company.isActive) {
      throw new NotFoundError('業者');
    }

    // クエリパラメータのバリデーション
    const query = servicesQuerySchema.parse({
      isActive: searchParams.get('isActive') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    // フィルター条件
    const where: any = {
      companyId: id,
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    // ページネーション
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    // データ取得
    const services = await prisma.service.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(services);
  } catch (error) {
    return handleError(error);
  }
}
