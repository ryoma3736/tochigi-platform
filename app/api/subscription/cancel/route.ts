/**
 * Cancel Subscription API
 * Cancel a company's subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cancelStripeSubscription, getSubscriptionPlan } from '@/lib/stripe';
import { sendEmail } from '@/lib/email';
import { subscriptionCancellation } from '@/lib/email-templates';

/**
 * POST /api/subscription/cancel
 * Cancel a subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, immediately = false } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get company with subscription
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { subscription: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (!company.subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel Stripe subscription
    const cancelledSubscription = await cancelStripeSubscription(
      company.subscription.stripeSubscriptionId,
      immediately
    );

    // Update database
    if (immediately) {
      // Immediately cancelled - update status to cancelled
      await prisma.subscription.update({
        where: { id: company.subscription.id },
        data: {
          status: 'cancelled',
        },
      });
    } else {
      // Cancel at period end - keep status as active
      await prisma.subscription.update({
        where: { id: company.subscription.id },
        data: {
          status: 'cancelling',
        },
      });
    }

    // Send cancellation email
    try {
      const plan = getSubscriptionPlan(company.subscription.plan);
      const emailTemplate = subscriptionCancellation({
        companyName: company.name,
        planName: plan.name,
        price: `¥${plan.price.toLocaleString()}`,
        startDate: company.subscription.currentPeriodStart.toLocaleDateString('ja-JP'),
        endDate: company.subscription.currentPeriodEnd.toLocaleDateString('ja-JP'),
      });

      await sendEmail({
        to: company.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: immediately
        ? 'Subscription cancelled immediately'
        : 'Subscription will be cancelled at the end of the billing period',
      endsAt:
        'current_period_end' in cancelledSubscription && cancelledSubscription.current_period_end
          ? new Date(cancelledSubscription.current_period_end * 1000).toISOString()
          : null,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to cancel subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
