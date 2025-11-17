/**
 * Admin Revenue API
 * Get revenue reports and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/revenue
 * Get revenue analytics
 */
export async function GET(request: NextRequest) {
  try {
    // Get all active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { status: 'active' },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate total revenue
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthlyRevenue = totalRevenue; // MRR

    // Calculate average revenue per customer
    const averageRevenuePerCustomer =
      subscriptions.length > 0 ? totalRevenue / subscriptions.length : 0;

    // Subscription breakdown by plan
    const platformFullSubs = subscriptions.filter((s) => s.plan === 'platform_full');
    const instagramOnlySubs = subscriptions.filter((s) => s.plan === 'instagram_only');

    const subscriptionBreakdown = {
      platformFull: {
        count: platformFullSubs.length,
        revenue: platformFullSubs.reduce((sum, sub) => sum + sub.price, 0),
      },
      instagramOnly: {
        count: instagramOnlySubs.length,
        revenue: instagramOnlySubs.reduce((sum, sub) => sum + sub.price, 0),
      },
    };

    // Generate mock monthly data (in production, calculate from actual data)
    const monthlyData = generateMonthlyData(subscriptions);

    // Recent transactions (mock data - in production, get from Stripe)
    const recentTransactions = subscriptions.slice(0, 10).map((sub) => ({
      id: sub.id,
      companyName: sub.company.name,
      amount: sub.price,
      plan: sub.plan === 'platform_full' ? 'フルプラットフォーム' : 'Instagram連携',
      date: sub.currentPeriodStart.toISOString(),
      status: 'succeeded',
    }));

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      averageRevenuePerCustomer: Math.round(averageRevenuePerCustomer),
      subscriptionBreakdown,
      monthlyData,
      recentTransactions,
    });
  } catch (error) {
    console.error('Admin revenue error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

/**
 * Generate monthly revenue data
 * In production, this should query actual historical data
 */
function generateMonthlyData(subscriptions: any[]) {
  const months = [
    '2024-07',
    '2024-08',
    '2024-09',
    '2024-10',
    '2024-11',
    '2024-12',
  ];

  return months.map((month, index) => {
    // Simulate growth
    const subscriberGrowth = index + 1;
    const simulatedRevenue = Math.floor(
      subscriptions.reduce((sum, sub) => sum + sub.price, 0) *
        (subscriberGrowth / months.length)
    );

    return {
      month,
      revenue: simulatedRevenue,
      newSubscribers: Math.floor(Math.random() * 5) + 1,
      churnedSubscribers: Math.floor(Math.random() * 2),
    };
  });
}
