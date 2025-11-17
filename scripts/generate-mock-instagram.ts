#!/usr/bin/env tsx
/**
 * Mock Instagram Data Generator
 * Generates realistic Instagram posts for testing when Instagram API is not available
 *
 * Usage:
 *   npx tsx scripts/generate-mock-instagram.ts                    # Generate for all companies
 *   npx tsx scripts/generate-mock-instagram.ts --company-id=123   # Generate for specific company
 *   npx tsx scripts/generate-mock-instagram.ts --count=20         # Generate 20 posts per company
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Unsplash random image URLs for different categories
const MOCK_IMAGES = {
  restaurant: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
  ],
  retail: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  ],
  service: [
    'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
  ],
};

// Sample captions for different business types
const MOCK_CAPTIONS = {
  restaurant: [
    '本日のおすすめランチ！季節の野菜をたっぷり使った特製パスタです 🍝✨\n\n#栃木グルメ #ランチ #イタリアン #地元野菜',
    '新メニューのご紹介です！\n自家製デザートプレート、ぜひお試しください 🍰🍓\n\n#カフェ #デザート #栃木カフェ #スイーツ',
    '今週末は特別ディナーコースをご用意しております 🌟\nご予約お待ちしています！\n\n#ディナー #コース料理 #記念日',
    '朝採れ野菜を使った本日のサラダバー 🥗\n新鮮さが自慢です！\n\n#サラダ #野菜 #健康',
    'ランチタイム営業中です ☕️\n落ち着いた空間でゆっくりとお過ごしください\n\n#カフェタイム #ランチ #栃木',
  ],
  beauty: [
    '新しいヘアカラーのご提案 💇‍♀️✨\n季節に合わせたトレンドカラーで素敵に変身\n\n#ヘアサロン #カラーリング #美容室 #栃木',
    'リラックスできるヘッドスパが大好評です 🌿\nご予約受付中！\n\n#ヘッドスパ #癒し #美容',
    '春の新作ネイルデザイン 💅\nお気軽にご相談ください\n\n#ネイルサロン #ネイルデザイン #春ネイル',
    '最新のトリートメントで髪質改善 ✨\nダメージヘアのケアもお任せください\n\n#トリートメント #ヘアケア #美髪',
  ],
  retail: [
    '新商品が入荷しました！🛍️\n春の新作コレクション、ぜひチェックしてください\n\n#新商品 #ファッション #栃木',
    '週末セール開催中！ 🎉\n最大30%オフの商品も！\n\n#セール #お得 #ショッピング',
    'おすすめの春アイテムをご紹介 🌸\nスタッフが厳選したアイテムです\n\n#春物 #新作 #おすすめ',
    '本日の入荷情報 📦\n人気商品が再入荷しました！\n\n#入荷情報 #人気商品',
  ],
  service: [
    'お客様の笑顔が私たちの喜びです 😊\nいつもご利用ありがとうございます！\n\n#感謝 #お客様',
    '新しいサービスを開始しました！\n詳しくはプロフィールのリンクから 🔗\n\n#新サービス #お知らせ',
    'スタッフ一同、心を込めてサービスを提供しています ✨\n\n#サービス #おもてなし #栃木',
    'キャンペーン実施中！🎁\nこの機会にぜひご利用ください\n\n#キャンペーン #特典',
  ],
};

/**
 * Parse command line arguments
 */
function parseArgs(): {
  companyId?: string;
  count?: number;
} {
  const args = process.argv.slice(2);
  const result: { companyId?: string; count?: number } = { count: 10 };

  for (const arg of args) {
    if (arg.startsWith('--company-id=')) {
      result.companyId = arg.split('=')[1];
    } else if (arg.startsWith('--count=')) {
      result.count = parseInt(arg.split('=')[1], 10);
    }
  }

  return result;
}

/**
 * Get random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get mock image URL based on category
 */
function getMockImageUrl(categorySlug: string): string {
  if (categorySlug.includes('restaurant') || categorySlug.includes('food')) {
    return randomItem(MOCK_IMAGES.restaurant);
  } else if (categorySlug.includes('beauty') || categorySlug.includes('salon')) {
    return randomItem(MOCK_IMAGES.beauty);
  } else if (categorySlug.includes('retail') || categorySlug.includes('shop')) {
    return randomItem(MOCK_IMAGES.retail);
  } else {
    return randomItem(MOCK_IMAGES.service);
  }
}

/**
 * Get mock caption based on category
 */
function getMockCaption(categorySlug: string): string {
  if (categorySlug.includes('restaurant') || categorySlug.includes('food')) {
    return randomItem(MOCK_CAPTIONS.restaurant);
  } else if (categorySlug.includes('beauty') || categorySlug.includes('salon')) {
    return randomItem(MOCK_CAPTIONS.beauty);
  } else if (categorySlug.includes('retail') || categorySlug.includes('shop')) {
    return randomItem(MOCK_CAPTIONS.retail);
  } else {
    return randomItem(MOCK_CAPTIONS.service);
  }
}

/**
 * Generate random date within last 90 days
 */
function randomDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

/**
 * Generate mock Instagram posts for a company
 */
async function generateMockPosts(
  company: {
    id: string;
    name: string;
    category: { slug: string };
  },
  count: number
) {
  console.log(`\n📸 Generating ${count} mock posts for: ${company.name}`);

  let generatedCount = 0;

  for (let i = 0; i < count; i++) {
    const postId = `mock_${company.id}_${Date.now()}_${i}`;
    const mediaUrl = getMockImageUrl(company.category.slug);
    const caption = getMockCaption(company.category.slug);
    const timestamp = randomDate();
    const likesCount = Math.floor(Math.random() * 500) + 10;
    const commentsCount = Math.floor(Math.random() * 50);

    try {
      await prisma.instagramPost.upsert({
        where: { postId },
        update: {
          caption,
          mediaUrl,
          mediaType: 'IMAGE',
          permalink: `https://www.instagram.com/p/${postId}/`,
          timestamp,
          likesCount,
          commentsCount,
        },
        create: {
          companyId: company.id,
          postId,
          caption,
          mediaUrl,
          mediaType: 'IMAGE',
          permalink: `https://www.instagram.com/p/${postId}/`,
          timestamp,
          likesCount,
          commentsCount,
        },
      });

      generatedCount++;
    } catch (error) {
      console.error(`   ❌ Failed to generate post ${i + 1}:`, error);
    }

    // Small delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`   ✅ Generated ${generatedCount} posts`);
  return generatedCount;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Mock Instagram Data Generator Started\n');

  const args = parseArgs();
  let companies;

  try {
    // Determine which companies to generate data for
    if (args.companyId) {
      console.log(`🔍 Finding company by ID: ${args.companyId}`);
      const company = await prisma.company.findUnique({
        where: { id: args.companyId },
        include: {
          category: true,
        },
      });

      if (!company) {
        console.error(`❌ Company not found with ID: ${args.companyId}`);
        process.exit(1);
      }

      companies = [company];
    } else {
      console.log('🔍 Finding all active companies');
      companies = await prisma.company.findMany({
        where: { isActive: true },
        include: {
          category: true,
        },
        take: 10, // Limit to 10 companies for safety
      });

      console.log(`📋 Found ${companies.length} companies\n`);
    }

    // Generate mock posts for each company
    let totalGenerated = 0;
    for (const company of companies) {
      const generated = await generateMockPosts(company, args.count || 10);
      totalGenerated += generated;
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Generation Summary');
    console.log('='.repeat(60));
    console.log(`\n✅ Total posts generated: ${totalGenerated}`);
    console.log(`📁 Companies processed: ${companies.length}`);
    console.log('\n' + '='.repeat(60));
    console.log('✨ Mock data generation completed!\n');

    process.exit(0);
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
