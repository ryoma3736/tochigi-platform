/**
 * Stripe Client and Subscription Plan Definitions
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

/**
 * Subscription Plan Definitions
 */
export const SUBSCRIPTION_PLANS = {
  INSTAGRAM_ONLY: {
    id: 'instagram_only',
    name: 'Instagram連携プラン',
    price: 50000, // 50,000円/月
    currency: 'jpy',
    interval: 'month' as const,
    features: [
      'Instagram投稿の自動同期',
      'Instagram投稿のギャラリー表示',
      '基本的な問い合わせ管理',
      'プロフィール編集',
    ],
    priceId: process.env.STRIPE_PRICE_INSTAGRAM_ONLY,
  },
  PLATFORM_FULL: {
    id: 'platform_full',
    name: 'フルプラットフォームプラン',
    price: 120000, // 120,000円/月
    currency: 'jpy',
    interval: 'month' as const,
    features: [
      'Instagram投稿の自動同期',
      'Instagram投稿のギャラリー表示',
      '詳細な問い合わせ管理',
      'サービス管理機能',
      '優先カスタマーサポート',
      '高度な分析レポート',
      'カスタムブランディング',
    ],
    priceId: process.env.STRIPE_PRICE_PLATFORM_FULL,
  },
} as const;

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;

/**
 * Get subscription plan by ID
 */
export function getSubscriptionPlan(planId: string) {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  if (!plan) {
    throw new Error(`Invalid subscription plan: ${planId}`);
  }
  return plan;
}

/**
 * Create Stripe customer
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });

  return customer;
}

/**
 * Create Stripe subscription
 */
export async function createStripeSubscription(params: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: params.metadata,
  });

  return subscription;
}

/**
 * Update Stripe subscription
 */
export async function updateStripeSubscription(params: {
  subscriptionId: string;
  priceId: string;
}): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(params.subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: params.priceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });

  return updatedSubscription;
}

/**
 * Cancel Stripe subscription
 */
export async function cancelStripeSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  } else {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });

  return session;
}

/**
 * Construct Stripe webhook event
 */
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return event;
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

/**
 * Retrieve Stripe customer
 */
export async function getStripeCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.deleted ? null : customer;
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    return null;
  }
}

/**
 * Retrieve Stripe subscription
 */
export async function getStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving Stripe subscription:', error);
    return null;
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'JPY'): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
