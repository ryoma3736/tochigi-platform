/**
 * Instagram Feed API
 * Get latest Instagram posts from all companies for homepage display
 */

import { NextRequest, NextResponse } from 'next/server';

// モックInstagram投稿データ（株式会社 栄匠 @eisho8400、Bloom鍼灸整骨院 @bloom_acu）
const MOCK_INSTAGRAM_POSTS = [
  {
    id: '1',
    postId: 'DOyPwfOE5L2',
    caption: '【和と洋が調和する、理想のくつろぎ空間】光が差し込むリビングは、木目調のアクセントウォールと無垢材の床が温かい雰囲気を演出。テレビ下のフロートシェルフは、空間を広く見せるだけでなく、お掃除も楽ちんです。隣の和室には、畳の下に引き出し収納を完備。#栄匠 #リフォーム #栃木県 #鹿沼市',
    mediaUrl: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.82787-15/550920489_18384381382132241_690134743529862613_n.jpg?stp=c234.0.702.702a_dst-jpg_e35_s640x640_tt6&_nc_cat=110&ccb=1-7&_nc_sid=18de74&_nc_ohc=cCIaBo8a89sQ7kNvwFGzbrD&_nc_oc=Adm_neiFEO2Au1Lgzq8m1bInbzzLSoUI_s2erFqsL2Dsmsz61fQOk15W7y5wNUQ5Hu6gU--SZVZwc4Nmue_t_3F-&_nc_zt=23&_nc_ht=scontent-nrt1-2.cdninstagram.com&oh=00_AfjiH3HnGbmr6X-iPcL14tErn0Gyr6QsvHtlxxC_aFMcXg&oe=6920EA2C',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOyPwfOE5L2/',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 41,
    commentsCount: 0,
    company: {
      id: 'eisho-reform',
      name: '株式会社 栄匠',
      instagramHandle: 'eisho8400',
      category: { name: '建設業', slug: 'construction' }
    }
  },
  {
    id: '2',
    postId: 'DOxAbCdEfGh',
    caption: '✨ 今日も多くの患者様にご来院いただきました。皆様の健康をサポートできて嬉しいです #鍼灸 #整骨院',
    mediaUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOxAbCdEfGh/',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 189,
    commentsCount: 8,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '3',
    postId: 'DOwXyZaBcDe',
    caption: '🏃‍♀️ ランナー向けのケアメニューもご用意しています。レース前後のケアはお任せください #ランニング #マラソン',
    mediaUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOwXyZaBcDe/',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 312,
    commentsCount: 15,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '4',
    postId: 'DOvFgHiJkLm',
    caption: '💆‍♂️ 肩こり・腰痛でお悩みの方へ。丁寧なカウンセリングと施術で根本改善を目指します #肩こり #腰痛',
    mediaUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOvFgHiJkLm/',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 267,
    commentsCount: 21,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '5',
    postId: 'DOuNoPqRsTu',
    caption: '🌿 自然治癒力を高める鍼灸治療。体の内側から健康に #東洋医学 #自然治癒力',
    mediaUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOuNoPqRsTu/',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 198,
    commentsCount: 9,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '6',
    postId: 'DOtVwXyZaBc',
    caption: '☀️ 朝の時間帯も予約受付中！出勤前のケアで1日を快適に #朝活 #健康習慣',
    mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOtVwXyZaBc/',
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 156,
    commentsCount: 6,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '7',
    postId: 'DOsDeFgHiJk',
    caption: '🎯 スポーツ障害の予防とケア。アスリートの皆様をサポートします #スポーツ障害 #アスリート',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOsDeFgHiJk/',
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 289,
    commentsCount: 14,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '8',
    postId: 'DOrLmNoPqRs',
    caption: '💪 筋膜リリースで可動域アップ！パフォーマンス向上を目指す方にオススメ #筋膜リリース #パフォーマンス',
    mediaUrl: 'https://images.unsplash.com/photo-1597764690523-15bea4c581c9?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOrLmNoPqRs/',
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 223,
    commentsCount: 11,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  },
  {
    id: '9',
    postId: 'DOqTuVwXyZa',
    caption: '🌸 春の新生活応援キャンペーン実施中！お気軽にお問い合わせください #新生活 #キャンペーン',
    mediaUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=800&fit=crop',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/DOqTuVwXyZa/',
    timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 178,
    commentsCount: 7,
    company: {
      id: 'bloom-acu',
      name: 'Bloom鍼灸整骨院',
      instagramHandle: 'bloom_acu',
      category: { name: '小売業', slug: 'retail' }
    }
  }
];

/**
 * GET /api/instagram/feed?limit=50
 * Get latest Instagram posts (using mock data for demo)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // モックデータを返す
    const posts = MOCK_INSTAGRAM_POSTS.slice(0, Math.min(limit, MOCK_INSTAGRAM_POSTS.length));

    return NextResponse.json(
      { posts },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Instagram feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts', posts: [] },
      { status: 500 }
    );
  }
}
