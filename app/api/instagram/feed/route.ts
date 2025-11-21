/**
 * Instagram Feed API
 * Get latest Instagram posts from all companies for homepage display
 */

import { NextRequest, NextResponse } from 'next/server'
import { getInstagramPosts } from '@/lib/instagram'

/**
 * GET /api/instagram/feed?limit=50
 * Get latest Instagram posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 50

    const posts = await getInstagramPosts(limit)

    return NextResponse.json(
      { posts },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Instagram feed error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts', posts: [] },
      { status: 500 }
    )
  }
}
