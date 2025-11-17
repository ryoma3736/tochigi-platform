/**
 * Instagram Sync Cron Job
 * Automatically sync Instagram posts for all active companies
 *
 * This endpoint should be called by a cron service like:
 * - Vercel Cron Jobs
 * - GitHub Actions
 * - External cron service (e.g., cron-job.org)
 *
 * Recommended schedule: Every 6 hours
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { instagramAPI } from '@/lib/instagram';
import { sendEmail } from '@/lib/email';
import { instagramSyncSuccess, instagramSyncError } from '@/lib/email-templates';

/**
 * GET /api/cron/instagram-sync
 * Sync Instagram posts for all companies with connected accounts
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all companies with Instagram tokens
    const companies = await prisma.company.findMany({
      where: {
        instagramToken: { not: null },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        instagramToken: true,
        instagramHandle: true,
      },
    });

    const results = {
      total: companies.length,
      success: 0,
      failed: 0,
      details: [] as Array<{
        companyId: string;
        companyName: string;
        status: 'success' | 'failed';
        syncedCount?: number;
        error?: string;
      }>,
    };

    // Sync posts for each company
    for (const company of companies) {
      try {
        if (!company.instagramToken) continue;

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

        results.success++;
        results.details.push({
          companyId: company.id,
          companyName: company.name,
          status: 'success',
          syncedCount,
        });

        // Send success email (optional, only for significant updates)
        if (syncedCount > 0) {
          try {
            const emailTemplate = instagramSyncSuccess(company.name, syncedCount);
            await sendEmail({
              to: company.email,
              subject: emailTemplate.subject,
              html: emailTemplate.html,
            });
          } catch (emailError) {
            console.error(`Failed to send sync success email to ${company.name}:`, emailError);
          }
        }
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        results.details.push({
          companyId: company.id,
          companyName: company.name,
          status: 'failed',
          error: errorMessage,
        });

        // Send error email
        try {
          const emailTemplate = instagramSyncError(company.name, errorMessage);
          await sendEmail({
            to: company.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          });
        } catch (emailError) {
          console.error(`Failed to send sync error email to ${company.name}:`, emailError);
        }

        console.error(`Instagram sync failed for ${company.name}:`, error);
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      success: true,
      message: 'Instagram sync completed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run Instagram sync cron job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
