/**
 * Instagram Posts API
 * Get Instagram posts from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/instagram/posts?companyId=xxx&limit=12
 * Get Instagram posts for a company
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get posts from database
    const posts = await prisma.instagramPost.findMany({
      where: { companyId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        postId: post.postId,
        caption: post.caption,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        permalink: post.permalink,
        timestamp: post.timestamp.toISOString(),
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
      })),
    });
  } catch (error) {
    console.error('Get Instagram posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
}
