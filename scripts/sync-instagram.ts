#!/usr/bin/env tsx
/**
 * Manual Instagram Sync Script
 * Synchronizes Instagram posts for specific companies or all companies
 *
 * Usage:
 *   npx tsx scripts/sync-instagram.ts                    # Sync all companies
 *   npx tsx scripts/sync-instagram.ts --company-id=123   # Sync specific company
 *   npx tsx scripts/sync-instagram.ts --email=test@example.com  # Sync by email
 *   npx tsx scripts/sync-instagram.ts --all              # Force sync all
 */

import { PrismaClient } from '@prisma/client';
import { instagramAPI } from '../lib/instagram';

const prisma = new PrismaClient();

interface SyncResult {
  companyId: string;
  companyName: string;
  status: 'success' | 'skipped' | 'failed';
  syncedCount?: number;
  skippedReason?: string;
  error?: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): {
  companyId?: string;
  email?: string;
  all?: boolean;
} {
  const args = process.argv.slice(2);
  const result: { companyId?: string; email?: string; all?: boolean } = {};

  for (const arg of args) {
    if (arg.startsWith('--company-id=')) {
      result.companyId = arg.split('=')[1];
    } else if (arg.startsWith('--email=')) {
      result.email = arg.split('=')[1];
    } else if (arg === '--all') {
      result.all = true;
    }
  }

  return result;
}

/**
 * Sync Instagram posts for a single company
 */
async function syncCompany(company: {
  id: string;
  name: string;
  email: string;
  instagramToken: string | null;
  instagramHandle: string | null;
}): Promise<SyncResult> {
  console.log(`\n📸 Syncing Instagram for: ${company.name} (@${company.instagramHandle || 'unknown'})`);

  // Check if company has Instagram token
  if (!company.instagramToken) {
    console.log('   ⚠️  Skipped: No Instagram token found');
    return {
      companyId: company.id,
      companyName: company.name,
      status: 'skipped',
      skippedReason: 'No Instagram token',
    };
  }

  try {
    // Fetch media from Instagram
    console.log('   🔄 Fetching posts from Instagram API...');
    const mediaResponse = await instagramAPI.getUserMedia(company.instagramToken, 50);
    const posts = mediaResponse.data;

    console.log(`   📥 Found ${posts.length} posts`);

    // Upsert posts to database
    let syncedCount = 0;
    let newCount = 0;
    let updatedCount = 0;

    for (const post of posts) {
      const existingPost = await prisma.instagramPost.findUnique({
        where: { postId: post.id },
      });

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

      if (existingPost) {
        updatedCount++;
      } else {
        newCount++;
      }
      syncedCount++;
    }

    console.log(`   ✅ Success: ${newCount} new, ${updatedCount} updated`);

    return {
      companyId: company.id,
      companyName: company.name,
      status: 'success',
      syncedCount,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`   ❌ Failed: ${errorMessage}`);

    return {
      companyId: company.id,
      companyName: company.name,
      status: 'failed',
      error: errorMessage,
    };
  }
}

/**
 * Main sync function
 */
async function main() {
  console.log('🚀 Instagram Sync Script Started\n');

  const args = parseArgs();
  let companies;

  try {
    // Determine which companies to sync
    if (args.companyId) {
      console.log(`🔍 Finding company by ID: ${args.companyId}`);
      const company = await prisma.company.findUnique({
        where: { id: args.companyId },
        select: {
          id: true,
          name: true,
          email: true,
          instagramToken: true,
          instagramHandle: true,
          isActive: true,
        },
      });

      if (!company) {
        console.error(`❌ Company not found with ID: ${args.companyId}`);
        process.exit(1);
      }

      companies = [company];
    } else if (args.email) {
      console.log(`🔍 Finding company by email: ${args.email}`);
      const company = await prisma.company.findUnique({
        where: { email: args.email },
        select: {
          id: true,
          name: true,
          email: true,
          instagramToken: true,
          instagramHandle: true,
          isActive: true,
        },
      });

      if (!company) {
        console.error(`❌ Company not found with email: ${args.email}`);
        process.exit(1);
      }

      companies = [company];
    } else {
      console.log('🔍 Finding all companies with Instagram connected');
      companies = await prisma.company.findMany({
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
          isActive: true,
        },
      });

      console.log(`📋 Found ${companies.length} companies to sync\n`);
    }

    // Sync each company
    const results: SyncResult[] = [];
    for (const company of companies) {
      const result = await syncCompany(company);
      results.push(result);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Sync Summary');
    console.log('='.repeat(60));

    const successful = results.filter((r) => r.status === 'success');
    const failed = results.filter((r) => r.status === 'failed');
    const skipped = results.filter((r) => r.status === 'skipped');

    console.log(`\n✅ Successful: ${successful.length}`);
    successful.forEach((r) => {
      console.log(`   - ${r.companyName}: ${r.syncedCount} posts synced`);
    });

    if (skipped.length > 0) {
      console.log(`\n⚠️  Skipped: ${skipped.length}`);
      skipped.forEach((r) => {
        console.log(`   - ${r.companyName}: ${r.skippedReason}`);
      });
    }

    if (failed.length > 0) {
      console.log(`\n❌ Failed: ${failed.length}`);
      failed.forEach((r) => {
        console.log(`   - ${r.companyName}: ${r.error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Sync completed!\n');

    process.exit(failed.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
