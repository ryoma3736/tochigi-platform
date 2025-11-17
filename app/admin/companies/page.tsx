/**
 * Admin Companies Page
 * Manage all registered companies
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CompanyTable from '@/components/admin/CompanyTable';

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
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/companies');
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyStatus = async (companyId: string, currentStatus: boolean) => {
    if (!confirm(`この業者を${currentStatus ? '無効化' : '有効化'}しますか?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/companies`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchCompanies();
      }
    } catch (error) {
      console.error('Failed to update company status:', error);
      alert('ステータスの更新に失敗しました');
    }
  };

  const filteredCompanies = companies.filter((company) => {
    if (filter === 'active') return company.isActive;
    if (filter === 'inactive') return !company.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">業者管理</h2>
          <p className="text-gray-600">登録されている業者の管理</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            すべて ({companies.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            有効 ({companies.filter((c) => c.isActive).length})
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilter('inactive')}
          >
            無効 ({companies.filter((c) => !c.isActive).length})
          </Button>
        </div>
      </div>

      <CompanyTable
        companies={filteredCompanies}
        onToggleStatus={toggleCompanyStatus}
        loading={loading}
      />
    </div>
  );
}
