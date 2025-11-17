/**
 * Subscription Form Component
 * Display and select subscription plans
 */

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'instagram_only',
    name: 'Instagram連携プラン',
    price: 50000,
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

interface SubscriptionFormProps {
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
}

export default function SubscriptionForm({
  currentPlan,
  onSelectPlan,
}: SubscriptionFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {currentPlan ? 'プランを選択' : 'サブスクリプションプラン'}
        </h2>
        <p className="text-gray-600">
          ビジネスに最適なプランをお選びください
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`p-6 ${
              currentPlan === plan.id ? 'border-blue-500 border-2' : ''
            }`}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {currentPlan === plan.id && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    現在のプラン
                  </span>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-4xl font-bold">
                  ¥{plan.price.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/月</span>
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-3">含まれる機能:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={currentPlan === plan.id}
                  className="w-full"
                >
                  {currentPlan === plan.id ? '選択中' : 'このプランを選択'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold mb-2">お支払いについて</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• すべてのプランは月額制です</li>
          <li>• クレジットカード決済に対応しています</li>
          <li>• いつでもプラン変更・解約が可能です</li>
          <li>• プラン変更時は日割り計算で調整されます</li>
        </ul>
      </div>
    </div>
  );
}
