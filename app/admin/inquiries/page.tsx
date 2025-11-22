/**
 * Admin Inquiries Page
 * Manage all customer inquiries
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface InquiryCompany {
  company: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: string;
  createdAt: string;
  companies: InquiryCompany[];
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'read' | 'replied'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInquiries();
  }, [filter, currentPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '20');
      if (filter !== 'all') {
        params.set('status', filter);
      }

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const result = await response.json();
      setInquiries(result.data || []);
      setPagination(result.pagination || null);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      sent: { label: '送信済み', className: 'bg-blue-100 text-blue-800' },
      read: { label: '既読', className: 'bg-yellow-100 text-yellow-800' },
      replied: { label: '返信済み', className: 'bg-green-100 text-green-800' },
    };
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">問い合わせ管理</h2>
          <p className="text-gray-600">顧客からの問い合わせを管理</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
          >
            すべて
          </Button>
          <Button
            variant={filter === 'sent' ? 'default' : 'outline'}
            onClick={() => { setFilter('sent'); setCurrentPage(1); }}
          >
            送信済み
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            onClick={() => { setFilter('read'); setCurrentPage(1); }}
          >
            既読
          </Button>
          <Button
            variant={filter === 'replied' ? 'default' : 'outline'}
            onClick={() => { setFilter('replied'); setCurrentPage(1); }}
          >
            返信済み
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客情報
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                問い合わせ内容
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                送信先業者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  問い合わせがありません
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{inquiry.customerName}</div>
                    <div className="text-sm text-gray-500">{inquiry.customerEmail}</div>
                    <div className="text-sm text-gray-500">{inquiry.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={inquiry.message}>
                      {inquiry.message}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {inquiry.companies.map((ic) => (
                        <span
                          key={ic.company.id}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {ic.company.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(inquiry.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(inquiry.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            前へ
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            {currentPage} / {pagination.totalPages} ページ
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage === pagination.totalPages}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
