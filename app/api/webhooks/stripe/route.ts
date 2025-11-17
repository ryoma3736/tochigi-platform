/**
 * Stripe Webhook Handler
 * Handles Stripe webhook events for subscription management
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { constructWebhookEvent, getSubscriptionPlan } from '@/lib/stripe';
import { sendEmail } from '@/lib/email';
import { subscriptionWelcome, subscriptionPaymentFailed } from '@/lib/email-templates';
import Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Construct and verify webhook event
    const event = await constructWebhookEvent(body, signature);

    console.log('Stripe webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const companyId = session.metadata?.companyId;
  const planId = session.metadata?.planId;

  if (!companyId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    console.error(`Company not found: ${companyId}`);
    return;
  }

  const plan = getSubscriptionPlan(planId);

  // The subscription will be created in customer.subscription.created event
  console.log(`Checkout completed for ${company.name} - ${plan.name}`);
}

/**
 * Handle customer.subscription.created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;

  // Find company by Stripe customer ID
  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
    include: { company: true },
  });

  let company;
  if (existingSubscription) {
    company = existingSubscription.company;
  } else {
    // Try to find by metadata
    const metadata = subscription.metadata;
    if (metadata?.companyId) {
      company = await prisma.company.findUnique({
        where: { id: metadata.companyId },
      });
    }
  }

  if (!company) {
    console.error(`Company not found for subscription: ${subscriptionId}`);
    return;
  }

  // Get plan from price
  const priceId = subscription.items.data[0]?.price.id;
  let planId = 'platform_full';

  if (priceId === process.env.STRIPE_PRICE_INSTAGRAM_ONLY) {
    planId = 'instagram_only';
  } else if (priceId === process.env.STRIPE_PRICE_PLATFORM_FULL) {
    planId = 'platform_full';
  }

  const plan = getSubscriptionPlan(planId);

  // Create or update subscription
  const periodStart =
    'current_period_start' in subscription && subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000)
      : new Date();
  const periodEnd =
    'current_period_end' in subscription && subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

  await prisma.subscription.upsert({
    where: { companyId: company.id },
    update: {
      plan: plan.id,
      price: plan.price,
      status: 'active',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
    create: {
      companyId: company.id,
      plan: plan.id,
      price: plan.price,
      status: 'active',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  });

  // Update company plan
  await prisma.company.update({
    where: { id: company.id },
    data: { subscriptionPlan: plan.id },
  });

  // Send welcome email
  try {
    const emailTemplate = subscriptionWelcome({
      companyName: company.name,
      planName: plan.name,
      price: `¥${plan.price.toLocaleString()}`,
      startDate: periodStart.toLocaleDateString('ja-JP'),
      endDate: periodEnd.toLocaleDateString('ja-JP'),
    });

    await sendEmail({
      to: company.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  // Find subscription
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { company: true },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Update subscription
  const updateData: {
    status: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  } = {
    status: subscription.status === 'active' ? 'active' : subscription.status,
  };

  if ('current_period_start' in subscription && subscription.current_period_start) {
    updateData.currentPeriodStart = new Date(subscription.current_period_start * 1000);
  }
  if ('current_period_end' in subscription && subscription.current_period_end) {
    updateData.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: updateData,
  });

  console.log(`Subscription updated: ${subscriptionId}`);
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  // Find subscription
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: 'cancelled' },
  });

  console.log(`Subscription cancelled: ${subscriptionId}`);
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId =
    'subscription' in invoice && invoice.subscription
      ? typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id
      : undefined;

  if (!subscriptionId) return;

  // Find subscription
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Ensure subscription is active
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: 'active' },
  });

  console.log(`Payment succeeded for subscription: ${subscriptionId}`);
}

/**
 * Handle invoice.payment_failed event
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId =
    'subscription' in invoice && invoice.subscription
      ? typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id
      : undefined;
  const customerId =
    'customer' in invoice && invoice.customer
      ? typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id
      : undefined;

  if (!subscriptionId) return;

  // Find subscription
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { company: true },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: 'past_due' },
  });

  // Send payment failed email
  try {
    const plan = getSubscriptionPlan(dbSubscription.plan);
    const emailTemplate = subscriptionPaymentFailed({
      companyName: dbSubscription.company.name,
      planName: plan.name,
      price: `¥${plan.price.toLocaleString()}`,
      startDate: dbSubscription.currentPeriodStart.toLocaleDateString('ja-JP'),
      endDate: dbSubscription.currentPeriodEnd.toLocaleDateString('ja-JP'),
    });

    await sendEmail({
      to: dbSubscription.company.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
  } catch (emailError) {
    console.error('Failed to send payment failed email:', emailError);
  }

  console.log(`Payment failed for subscription: ${subscriptionId}`);
}
