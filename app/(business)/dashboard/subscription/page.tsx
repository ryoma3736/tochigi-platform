/**
 * Subscription Management Page
 * Manage subscription plan and billing
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SubscriptionForm from '@/components/business/SubscriptionForm';
import PlanSelector from '@/components/business/PlanSelector';

interface Subscription {
  id: string;
  plan: string;
  price: number;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

const PLANS = {
  instagram_only: {
    name: 'Instagram連携プラン',
    price: 50000,
    features: [
      'Instagram投稿の自動同期',
      'Instagram投稿のギャラリー表示',
      '基本的な問い合わせ管理',
      'プロフィール編集',
    ],
  },
  platform_full: {
    name: 'フルプラットフォームプラン',
    price: 120000,
    features: [
      'Instagram投稿の自動同期',
      'Instagram投稿のギャラリー表示',
      '詳細な問い合わせ管理',
      'サービス管理機能',
      '優先カスタマーサポート',
      '高度な分析レポート',
      'カスタムブランディング',
    ],
  },
};

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  // Mock company ID - in production, get from session/auth
  const companyId = 'mock-company-id';

  useEffect(() => {
    // Mock loading subscription
    // In production, fetch from API
    setTimeout(() => {
      setSubscription(null); // No subscription yet
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateSubscription = async (planId: string) => {
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, planId }),
      });

      const data = await response.json();

      if (data.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      console.error('Failed to create subscription:', error);
      alert('サブスクリプションの作成に失敗しました');
    }
  };

  const handleChangePlan = async (newPlanId: string) => {
    if (!confirm('プランを変更しますか?')) return;

    try {
      const response = await fetch('/api/subscription/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, newPlanId }),
      });

      const data = await response.json();

      if (data.success) {
        alert('プランを変更しました');
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to change plan');
      }
    } catch (error) {
      console.error('Failed to change plan:', error);
      alert('プラン変更に失敗しました');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('サブスクリプションを解約しますか?')) return;

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, immediately: false }),
      });

      const data = await response.json();

      if (data.success) {
        alert('サブスクリプションの解約を受け付けました');
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('解約処理に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">サブスクリプション管理</h1>

      {subscription ? (
        <div className="space-y-6">
          {/* Current Subscription */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">現在のプラン</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">プラン名</p>
                <p className="text-xl font-bold">
                  {PLANS[subscription.plan as keyof typeof PLANS]?.name || subscription.plan}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">月額料金</p>
                <p className="text-xl font-bold">¥{subscription.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ステータス</p>
                <p className="text-xl font-bold">
                  {subscription.status === 'active' && '有効'}
                  {subscription.status === 'cancelling' && '解約予定'}
                  {subscription.status === 'cancelled' && '解約済み'}
                  {subscription.status === 'past_due' && '支払い遅延'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">次回更新日</p>
                <p className="text-xl">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button onClick={() => setShowPlanSelector(!showPlanSelector)}>
                プラン変更
              </Button>
              <Button variant="outline" onClick={handleCancelSubscription}>
                解約する
              </Button>
            </div>
          </Card>

          {showPlanSelector && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">プラン変更</h2>
              <PlanSelector
                currentPlan={subscription.plan}
                onSelectPlan={handleChangePlan}
              />
            </Card>
          )}
        </div>
      ) : (
        <SubscriptionForm onSelectPlan={handleCreateSubscription} />
      )}
    </div>
  );
}
