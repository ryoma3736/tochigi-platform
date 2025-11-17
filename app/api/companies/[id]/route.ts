import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, successResponse, NotFoundError } from '@/lib/errors';

// GET /api/companies/[id] - 業者詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        services: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        instagramPosts: {
          take: 6,
          orderBy: { timestamp: 'desc' },
          select: {
            id: true,
            postId: true,
            caption: true,
            mediaUrl: true,
            mediaType: true,
            permalink: true,
            timestamp: true,
            likesCount: true,
            commentsCount: true,
          },
        },
        _count: {
          select: {
            services: true,
            instagramPosts: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundError('業者');
    }

    // アクティブでない業者は返さない
    if (!company.isActive) {
      throw new NotFoundError('業者');
    }

    return successResponse(company);
  } catch (error) {
    return handleError(error);
  }
}
