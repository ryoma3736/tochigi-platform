/**
 * PlanSelector Component
 * Standalone component for selecting subscription plans
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  priceId?: string;
}

export const AVAILABLE_PLANS: Plan[] = [
  {
    id: 'instagram_only',
    name: 'Instagram連携プラン',
    price: 50000,
    currency: 'JPY',
    interval: 'month',
    features: [
      'Instagram投稿の自動同期',
      'Instagram投稿のギャラリー表示',
      '基本的な問い合わせ管理',
      'プロフィール編集',
    ],
  },
  {
    id: 'platform_full',
    name: 'フルプラットフォームプラン',
    price: 120000,
    currency: 'JPY',
    interval: 'month',
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
];

interface PlanSelectorProps {
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
  showCurrentBadge?: boolean;
  buttonText?: {
    select?: string;
    current?: string;
    disabled?: string;
  };
}

export default function PlanSelector({
  currentPlan,
  onSelectPlan,
  isLoading = false,
  showCurrentBadge = true,
  buttonText = {},
}: PlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (isLoading || currentPlan === planId) return;
    setSelectedPlan(planId);
    onSelectPlan(planId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getButtonText = (plan: Plan) => {
    if (currentPlan === plan.id) {
      return buttonText.current || '選択中';
    }
    if (isLoading && selectedPlan === plan.id) {
      return '処理中...';
    }
    return buttonText.select || 'このプランを選択';
  };

  const isButtonDisabled = (plan: Plan) => {
    if (currentPlan === plan.id) return true;
    if (isLoading) return true;
    return false;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {AVAILABLE_PLANS.map((plan) => {
        const isCurrentPlan = currentPlan === plan.id;
        const isSelected = selectedPlan === plan.id;

        return (
          <Card
            key={plan.id}
            className={`p-6 transition-all duration-200 ${
              isCurrentPlan
                ? 'border-blue-500 border-2 shadow-lg'
                : isSelected
                ? 'border-blue-300 border-2'
                : 'hover:shadow-md'
            }`}
          >
            <div className="space-y-4">
              {/* Plan Header */}
              <div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                {showCurrentBadge && isCurrentPlan && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    現在のプラン
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t border-b py-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-lg font-normal text-gray-600">
                    /{plan.interval === 'month' ? '月' : '年'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">税込価格</p>
              </div>

              {/* Features */}
              <div>
                <p className="font-semibold mb-3 text-gray-700">含まれる機能:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isButtonDisabled(plan)}
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                >
                  {getButtonText(plan)}
                </Button>
              </div>

              {/* Additional Info for Upgrades/Downgrades */}
              {currentPlan && currentPlan !== plan.id && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    {plan.price > (AVAILABLE_PLANS.find(p => p.id === currentPlan)?.price || 0)
                      ? 'アップグレード時は即座に適用され、日割り計算されます'
                      : 'ダウングレード時は次回更新日から適用されます'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
