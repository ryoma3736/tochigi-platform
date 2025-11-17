import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse, NotFoundError, UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { serviceSchema } from '@/lib/validators';

// TODO: 認証ミドルウェアを実装後、companyIdを取得する
function getCompanyIdFromRequest(request: NextRequest): string {
  const companyId = request.headers.get('x-company-id');
  if (!companyId) {
    throw new UnauthorizedError('認証が必要です');
  }
  return companyId;
}

// GET /api/business/services/[id] - サービス詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundError('サービス');
    }

    // 自社のサービスかチェック
    if (service.companyId !== companyId) {
      throw new ForbiddenError('このサービスにアクセスする権限がありません');
    }

    return successResponse(service);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/business/services/[id] - サービス更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    const validatedData = serviceSchema.parse(body);

    // サービスが存在するか確認
    const existingService = await prisma.service.findUnique({
      where: { id },
      select: { id: true, companyId: true },
    });

    if (!existingService) {
      throw new NotFoundError('サービス');
    }

    // 自社のサービスかチェック
    if (existingService.companyId !== companyId) {
      throw new ForbiddenError('このサービスを更新する権限がありません');
    }

    // サービス更新
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        priceFrom: validatedData.priceFrom,
        priceTo: validatedData.priceTo,
        unit: validatedData.unit,
        isActive: validatedData.isActive,
      },
    });

    return successResponse(updatedService);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/business/services/[id] - サービス削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { id } = await params;

    // サービスが存在するか確認
    const existingService = await prisma.service.findUnique({
      where: { id },
      select: { id: true, companyId: true },
    });

    if (!existingService) {
      throw new NotFoundError('サービス');
    }

    // 自社のサービスかチェック
    if (existingService.companyId !== companyId) {
      throw new ForbiddenError('このサービスを削除する権限がありません');
    }

    // サービス削除（論理削除ではなく物理削除）
    await prisma.service.delete({
      where: { id },
    });

    return successResponse({ message: 'サービスを削除しました' });
  } catch (error) {
    return handleError(error);
  }
}
