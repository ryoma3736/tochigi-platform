/**
 * Admin Revenue Page
 * Revenue reports and analytics
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import RevenueChart from '@/components/admin/RevenueChart';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  averageRevenuePerCustomer: number;
  subscriptionBreakdown: {
    platformFull: {
      count: number;
      revenue: number;
    };
    instagramOnly: {
      count: number;
      revenue: number;
    };
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    newSubscribers: number;
    churnedSubscribers: number;
  }>;
  recentTransactions: Array<{
    id: string;
    companyName: string;
    amount: number;
    plan: string;
    date: string;
    status: string;
  }>;
}

export default function AdminRevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/admin/revenue');
      const data = await response.json();
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">売上データの読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">売上レポート</h2>
        <p className="text-gray-600">詳細な売上分析とトレンド</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">総売上</h3>
          <p className="text-3xl font-bold text-gray-900">
            ¥{revenueData.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">累計</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">今月の売上</h3>
          <p className="text-3xl font-bold text-blue-600">
            ¥{revenueData.monthlyRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">月次経常収益(MRR)</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">顧客単価</h3>
          <p className="text-3xl font-bold text-green-600">
            ¥{revenueData.averageRevenuePerCustomer.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">平均月額</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">プラン別売上</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">
              フルプラットフォームプラン
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">契約数:</span>
                <span className="font-bold">
                  {revenueData.subscriptionBreakdown.platformFull.count}件
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">月額収益:</span>
                <span className="font-bold text-blue-600">
                  ¥{revenueData.subscriptionBreakdown.platformFull.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>単価:</span>
                <span>¥120,000/月</span>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 p-6 rounded-lg">
            <h4 className="font-semibold text-pink-900 mb-4">Instagram連携プラン</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">契約数:</span>
                <span className="font-bold">
                  {revenueData.subscriptionBreakdown.instagramOnly.count}件
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">月額収益:</span>
                <span className="font-bold text-pink-600">
                  ¥
                  {revenueData.subscriptionBreakdown.instagramOnly.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>単価:</span>
                <span>¥50,000/月</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">月次推移</h3>
        <RevenueChart data={revenueData.monthlyData} />
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">最近の取引</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">業者名</th>
                <th className="text-left py-3 px-4">プラン</th>
                <th className="text-right py-3 px-4">金額</th>
                <th className="text-left py-3 px-4">日付</th>
                <th className="text-left py-3 px-4">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{transaction.companyName}</td>
                  <td className="py-3 px-4">{transaction.plan}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    ¥{transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(transaction.date).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status === 'succeeded' ? '完了' : '保留中'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
