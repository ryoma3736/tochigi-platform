/**
 * Create Subscription API
 * Create a new Stripe subscription for a company
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createStripeCustomer,
  createCheckoutSession,
  getSubscriptionPlan,
  type SubscriptionPlanId,
} from '@/lib/stripe';
import { sendEmail } from '@/lib/email';
import { subscriptionWelcome } from '@/lib/email-templates';

/**
 * POST /api/subscription/create
 * Create a new subscription for a company
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, planId } = body;

    if (!companyId || !planId) {
      return NextResponse.json(
        { error: 'Company ID and plan ID are required' },
        { status: 400 }
      );
    }

    // Get company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { subscription: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check if company already has an active subscription
    if (company.subscription) {
      return NextResponse.json(
        { error: 'Company already has an active subscription' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = getSubscriptionPlan(planId);

    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 500 }
      );
    }

    // Create Stripe customer (always create new since no subscription exists)
    const customer = await createStripeCustomer({
      email: company.email,
      name: company.name,
      metadata: {
        companyId: company.id,
      },
    });
    const stripeCustomerId = customer.id;

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId: plan.priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?cancelled=true`,
      metadata: {
        companyId: company.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
