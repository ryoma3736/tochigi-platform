/**
 * Instagram Publish API
 * Publish content to Instagram
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { instagramAPI } from '@/lib/instagram';

/**
 * POST /api/instagram/publish
 * Publish a photo to Instagram
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, imageUrl, caption } = body;

    if (!companyId || !imageUrl) {
      return NextResponse.json(
        { error: 'Company ID and image URL are required' },
        { status: 400 }
      );
    }

    // Get company with Instagram token
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (!company.instagramToken) {
      return NextResponse.json(
        { error: 'Instagram account not connected' },
        { status: 400 }
      );
    }

    // Create media container
    const container = await instagramAPI.createPhotoContainer(
      company.instagramToken,
      imageUrl,
      caption
    );

    // Publish media
    const published = await instagramAPI.publishMedia(
      company.instagramToken,
      container.id
    );

    // Fetch the published post details
    const postDetails = await instagramAPI.getMediaDetails(
      published.id,
      company.instagramToken
    );

    // Save to database
    await prisma.instagramPost.create({
      data: {
        companyId: company.id,
        postId: postDetails.id,
        caption: postDetails.caption || null,
        mediaUrl: postDetails.media_url,
        mediaType: postDetails.media_type,
        permalink: postDetails.permalink,
        timestamp: new Date(postDetails.timestamp),
        likesCount: postDetails.like_count || 0,
        commentsCount: postDetails.comments_count || 0,
      },
    });

    return NextResponse.json({
      success: true,
      postId: published.id,
      permalink: postDetails.permalink,
    });
  } catch (error) {
    console.error('Instagram publish error:', error);
    return NextResponse.json(
      {
        error: 'Failed to publish to Instagram',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
