/**
 * StatCard Component
 * Display a single statistic card
 */

import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'red';
  subtitle?: string;
}

const iconMap: Record<string, string> = {
  building: '🏢',
  check: '✅',
  mail: '📧',
  camera: '📷',
  yen: '¥',
  'trending-up': '📈',
  repeat: '🔄',
  users: '👥',
  chart: '📊',
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
};

export default function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <span className="text-2xl">{iconMap[icon] || icon}</span>
        </div>
      </div>
    </Card>
  );
}
