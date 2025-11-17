/**
 * Instagram Sync API
 * Syncs Instagram posts to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { instagramAPI } from '@/lib/instagram';
import { sendEmail } from '@/lib/email';
import { instagramSyncSuccess, instagramSyncError } from '@/lib/email-templates';

/**
 * POST /api/instagram/sync
 * Sync Instagram posts for a company
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
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

    // Fetch media from Instagram
    const mediaResponse = await instagramAPI.getUserMedia(company.instagramToken, 50);
    const posts = mediaResponse.data;

    // Upsert posts to database
    let syncedCount = 0;
    for (const post of posts) {
      await prisma.instagramPost.upsert({
        where: { postId: post.id },
        update: {
          caption: post.caption || null,
          mediaUrl: post.media_url,
          mediaType: post.media_type,
          permalink: post.permalink,
          timestamp: new Date(post.timestamp),
          likesCount: post.like_count || 0,
          commentsCount: post.comments_count || 0,
        },
        create: {
          companyId: company.id,
          postId: post.id,
          caption: post.caption || null,
          mediaUrl: post.media_url,
          mediaType: post.media_type,
          permalink: post.permalink,
          timestamp: new Date(post.timestamp),
          likesCount: post.like_count || 0,
          commentsCount: post.comments_count || 0,
        },
      });
      syncedCount++;
    }

    // Send success email
    try {
      const emailTemplate = instagramSyncSuccess(company.name, syncedCount);
      await sendEmail({
        to: company.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    } catch (emailError) {
      console.error('Failed to send sync success email:', emailError);
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      totalPosts: posts.length,
    });
  } catch (error) {
    console.error('Instagram sync error:', error);

    // Try to send error email if we have company info
    try {
      const body = await request.json();
      const company = await prisma.company.findUnique({
        where: { id: body.companyId },
      });

      if (company) {
        const emailTemplate = instagramSyncError(
          company.name,
          error instanceof Error ? error.message : 'Unknown error'
        );
        await sendEmail({
          to: company.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    } catch (emailError) {
      console.error('Failed to send sync error email:', emailError);
    }

    return NextResponse.json(
      { error: 'Failed to sync Instagram posts' },
      { status: 500 }
    );
  }
}
