/**
 * Admin Stats API
 * Get platform-wide statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/stats
 * Get overall platform statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get counts in parallel
    const [
      totalCompanies,
      activeCompanies,
      totalInquiries,
      instagramConnected,
      platformFullSubscribers,
      instagramOnlySubscribers,
      subscriptions,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { isActive: true } }),
      prisma.inquiry.count(),
      prisma.company.count({ where: { instagramToken: { not: null } } }),
      prisma.subscription.count({ where: { plan: 'platform_full', status: 'active' } }),
      prisma.subscription.count({ where: { plan: 'instagram_only', status: 'active' } }),
      prisma.subscription.findMany({
        where: { status: 'active' },
        select: { price: true },
      }),
    ]);

    // Calculate revenue
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthlyRevenue = totalRevenue; // MRR is same as total for active subscriptions

    return NextResponse.json({
      totalCompanies,
      activeCompanies,
      totalInquiries,
      totalRevenue,
      monthlyRevenue,
      instagramConnected,
      platformFullSubscribers,
      instagramOnlySubscribers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
