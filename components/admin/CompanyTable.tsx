/**
 * CompanyTable Component
 * Display and manage companies in a table format
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: {
    name: string;
  };
  subscriptionPlan: string;
  isActive: boolean;
  instagramHandle: string | null;
  createdAt: string;
  subscription?: {
    status: string;
    currentPeriodEnd: string;
  };
  _count?: {
    services: number;
    inquiries: number;
    instagramPosts: number;
  };
}

interface CompanyTableProps {
  companies: Company[];
  onToggleStatus: (companyId: string, currentStatus: boolean) => void;
  onDelete?: (companyId: string) => void;
  loading?: boolean;
}

const PLAN_NAMES: Record<string, string> = {
  instagram_only: 'Instagram連携',
  platform_full: 'フルプラットフォーム',
};

const STATUS_NAMES: Record<string, string> = {
  active: '有効',
  cancelling: '解約予定',
  cancelled: '解約済み',
  past_due: '支払い遅延',
};

export default function CompanyTable({
  companies,
  onToggleStatus,
  onDelete,
  loading = false,
}: CompanyTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <p className="text-gray-600">該当する業者が見つかりませんでした</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            {/* Company Info */}
            <div className="flex-1">
              {/* Header with badges */}
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    company.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {company.isActive ? '有効' : '無効'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {company.category.name}
                </span>
                {company.subscription && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      company.subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : company.subscription.status === 'cancelling'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {STATUS_NAMES[company.subscription.status] || company.subscription.status}
                  </span>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">メールアドレス</p>
                  <p className="font-medium text-gray-900">{company.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">電話番号</p>
                  <p className="font-medium text-gray-900">{company.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">サブスクリプション</p>
                  <p className="font-medium text-gray-900">
                    {PLAN_NAMES[company.subscriptionPlan] || company.subscriptionPlan}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Instagram</p>
                  <p className="font-medium">
                    {company.instagramHandle ? (
                      <a
                        href={`https://instagram.com/${company.instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @{company.instagramHandle}
                      </a>
                    ) : (
                      <span className="text-gray-400">未連携</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">登録日</p>
                  <p className="font-medium text-gray-900">
                    {new Date(company.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                {company.subscription && (
                  <div>
                    <p className="text-gray-600 mb-1">次回更新日</p>
                    <p className="font-medium text-gray-900">
                      {new Date(company.subscription.currentPeriodEnd).toLocaleDateString(
                        'ja-JP'
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              {company._count && (
                <div className="mt-4 pt-4 border-t flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">サービス数: </span>
                    <span className="font-semibold">{company._count.services}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">問い合わせ: </span>
                    <span className="font-semibold">{company._count.inquiries}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">投稿数: </span>
                    <span className="font-semibold">{company._count.instagramPosts}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 ml-6">
              <Button
                variant={company.isActive ? 'outline' : 'default'}
                size="sm"
                onClick={() => onToggleStatus(company.id, company.isActive)}
                className="min-w-[100px]"
              >
                {company.isActive ? '無効化' : '有効化'}
              </Button>
              <Button variant="outline" size="sm" className="min-w-[100px]">
                詳細
              </Button>
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="min-w-[100px] text-red-600 hover:text-red-700 hover:border-red-300"
                  onClick={() => {
                    if (
                      confirm(
                        `本当に ${company.name} を削除しますか？この操作は取り消せません。`
                      )
                    ) {
                      onDelete(company.id);
                    }
                  }}
                >
                  削除
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
