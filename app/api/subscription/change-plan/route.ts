/**
 * Change Subscription Plan API
 * Update a company's subscription plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateStripeSubscription, getSubscriptionPlan } from '@/lib/stripe';

/**
 * POST /api/subscription/change-plan
 * Change the subscription plan
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, newPlanId } = body;

    if (!companyId || !newPlanId) {
      return NextResponse.json(
        { error: 'Company ID and new plan ID are required' },
        { status: 400 }
      );
    }

    // Get company with current subscription
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

    // Get new plan details
    const newPlan = getSubscriptionPlan(newPlanId);

    if (!newPlan.priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 500 }
      );
    }

    // Update Stripe subscription
    const updatedSubscription = await updateStripeSubscription({
      subscriptionId: company.subscription.stripeSubscriptionId,
      priceId: newPlan.priceId,
    });

    // Update database
    const updateData: {
      plan: string;
      price: number;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    } = {
      plan: newPlan.id,
      price: newPlan.price,
    };

    if (
      'current_period_start' in updatedSubscription &&
      updatedSubscription.current_period_start
    ) {
      updateData.currentPeriodStart = new Date(updatedSubscription.current_period_start * 1000);
    }

    if ('current_period_end' in updatedSubscription && updatedSubscription.current_period_end) {
      updateData.currentPeriodEnd = new Date(updatedSubscription.current_period_end * 1000);
    }

    await prisma.subscription.update({
      where: { id: company.subscription.id },
      data: updateData,
    });

    // Update company plan
    await prisma.company.update({
      where: { id: companyId },
      data: {
        subscriptionPlan: newPlan.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription plan updated successfully',
      newPlan: {
        id: newPlan.id,
        name: newPlan.name,
        price: newPlan.price,
      },
    });
  } catch (error) {
    console.error('Change plan error:', error);
    return NextResponse.json(
      {
        error: 'Failed to change subscription plan',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
