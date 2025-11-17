import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse, NotFoundError, UnauthorizedError } from '@/lib/errors';
import { companyProfileSchema } from '@/lib/validators';

// TODO: 認証ミドルウェアを実装後、companyIdを取得する
// 現在は簡易的にヘッダーから取得
function getCompanyIdFromRequest(request: NextRequest): string {
  const companyId = request.headers.get('x-company-id');
  if (!companyId) {
    throw new UnauthorizedError('認証が必要です');
  }
  return companyId;
}

// GET /api/business/profile - プロフィール取得
export async function GET(request: NextRequest) {
  try {
    const companyId = getCompanyIdFromRequest(request);

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subscription: true,
        _count: {
          select: {
            services: true,
            inquiries: true,
            instagramPosts: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundError('業者プロフィール');
    }

    return successResponse(company);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/business/profile - プロフィール更新
export async function PUT(request: NextRequest) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const body = await request.json();

    // バリデーション
    const validatedData = companyProfileSchema.parse(body);

    // 業者が存在するか確認
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      throw new NotFoundError('業者プロフィール');
    }

    // カテゴリーが存在するか確認
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      throw new NotFoundError('カテゴリー');
    }

    // プロフィール更新
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        description: validatedData.description,
        address: validatedData.address,
        categoryId: validatedData.categoryId,
        instagramHandle: validatedData.instagramHandle,
        instagramToken: validatedData.instagramToken,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(updatedCompany);
  } catch (error) {
    return handleError(error);
  }
}
