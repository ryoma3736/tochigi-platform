/**
 * Admin Dashboard Page
 * Main admin statistics dashboard
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import StatCard from '@/components/admin/StatCard';

interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  totalInquiries: number;
  totalRevenue: number;
  monthlyRevenue: number;
  instagramConnected: number;
  platformFullSubscribers: number;
  instagramOnlySubscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">統計情報の読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">概要</h2>
        <p className="text-gray-600">プラットフォーム全体の統計情報</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="登録業者数"
          value={stats.totalCompanies}
          icon="building"
          color="blue"
        />
        <StatCard
          title="アクティブ業者"
          value={stats.activeCompanies}
          icon="check"
          color="green"
        />
        <StatCard
          title="総問い合わせ数"
          value={stats.totalInquiries}
          icon="mail"
          color="purple"
        />
        <StatCard
          title="Instagram連携"
          value={stats.instagramConnected}
          icon="camera"
          color="pink"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">売上情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="総売上"
            value={`¥${stats.totalRevenue.toLocaleString()}`}
            icon="yen"
            color="green"
          />
          <StatCard
            title="今月の売上"
            value={`¥${stats.monthlyRevenue.toLocaleString()}`}
            icon="trending-up"
            color="blue"
          />
          <StatCard
            title="月次経常収益(MRR)"
            value={`¥${stats.monthlyRevenue.toLocaleString()}`}
            icon="repeat"
            color="purple"
            subtitle="サブスクリプション収益"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">プラン別契約数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-2">フルプラットフォーム</h4>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {stats.platformFullSubscribers}
            </p>
            <p className="text-sm text-gray-600">
              月額収益: ¥{(stats.platformFullSubscribers * 120000).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-2">Instagram連携プラン</h4>
            <p className="text-4xl font-bold text-pink-600 mb-2">
              {stats.instagramOnlySubscribers}
            </p>
            <p className="text-sm text-gray-600">
              月額収益: ¥{(stats.instagramOnlySubscribers * 50000).toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          クイックアクション
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/companies"
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <p className="font-semibold">業者管理</p>
            <p className="text-sm text-gray-600">業者の追加・編集・削除</p>
          </a>
          <a
            href="/admin/revenue"
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <p className="font-semibold">売上レポート</p>
            <p className="text-sm text-gray-600">詳細な売上分析</p>
          </a>
          <a
            href="/api/cron/instagram-sync"
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <p className="font-semibold">Instagram同期</p>
            <p className="text-sm text-gray-600">手動で同期を実行</p>
          </a>
        </div>
      </div>
    </div>
  );
}
