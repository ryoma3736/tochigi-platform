import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse, NotFoundError, UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { updateInquiryStatusSchema } from '@/lib/validators';

// TODO: 認証ミドルウェアを実装後、companyIdを取得する
function getCompanyIdFromRequest(request: NextRequest): string {
  const companyId = request.headers.get('x-company-id');
  if (!companyId) {
    throw new UnauthorizedError('認証が必要です');
  }
  return companyId;
}

// GET /api/business/inquiries/[id] - 問い合わせ詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        companies: {
          where: {
            companyId,
          },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundError('問い合わせ');
    }

    // 自社への問い合わせかチェック
    if (inquiry.companies.length === 0) {
      throw new ForbiddenError('この問い合わせにアクセスする権限がありません');
    }

    return successResponse(inquiry);
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/business/inquiries/[id] - 問い合わせステータス更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = getCompanyIdFromRequest(request);
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    const validatedData = updateInquiryStatusSchema.parse(body);

    // 問い合わせが存在し、自社への問い合わせか確認
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        companies: {
          where: {
            companyId,
          },
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundError('問い合わせ');
    }

    // 自社への問い合わせかチェック
    if (inquiry.companies.length === 0) {
      throw new ForbiddenError('この問い合わせを更新する権限がありません');
    }

    // ステータス更新
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
    });

    return successResponse(updatedInquiry);
  } catch (error) {
    return handleError(error);
  }
}
