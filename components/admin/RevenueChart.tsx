/**
 * RevenueChart Component
 * Display revenue trends over time
 */

'use client';

interface MonthlyData {
  month: string;
  revenue: number;
  newSubscribers: number;
  churnedSubscribers: number;
}

interface RevenueChartProps {
  data: MonthlyData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        データがありません
      </div>
    );
  }

  // Find max revenue for scaling
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const chartHeight = 300;

  return (
    <div className="space-y-6">
      {/* Chart visualization */}
      <div className="relative" style={{ height: chartHeight }}>
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-4">
          {data.map((item, index) => {
            const barHeight = (item.revenue / maxRevenue) * (chartHeight - 40);
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="font-bold">
                      ¥{item.revenue.toLocaleString()}
                    </div>
                    <div className="text-gray-300">
                      新規: {item.newSubscribers}人
                    </div>
                    <div className="text-gray-300">
                      解約: {item.churnedSubscribers}人
                    </div>
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                    style={{ height: `${barHeight}px` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {new Date(item.month + '-01').toLocaleDateString('ja-JP', {
                    month: 'short',
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-gray-500">
          <div>¥{maxRevenue.toLocaleString()}</div>
          <div>¥{Math.round(maxRevenue / 2).toLocaleString()}</div>
          <div>¥0</div>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">月</th>
              <th className="text-right py-2 px-4">売上</th>
              <th className="text-right py-2 px-4">新規契約</th>
              <th className="text-right py-2 px-4">解約</th>
              <th className="text-right py-2 px-4">純増</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  {new Date(item.month + '-01').toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </td>
                <td className="py-2 px-4 text-right font-medium">
                  ¥{item.revenue.toLocaleString()}
                </td>
                <td className="py-2 px-4 text-right text-green-600">
                  +{item.newSubscribers}
                </td>
                <td className="py-2 px-4 text-right text-red-600">
                  -{item.churnedSubscribers}
                </td>
                <td className="py-2 px-4 text-right font-bold">
                  {item.newSubscribers - item.churnedSubscribers > 0 ? '+' : ''}
                  {item.newSubscribers - item.churnedSubscribers}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-sm text-gray-600">平均売上</p>
          <p className="text-xl font-bold text-gray-900">
            ¥{Math.round(data.reduce((sum, d) => sum + d.revenue, 0) / data.length).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">総新規契約</p>
          <p className="text-xl font-bold text-green-600">
            {data.reduce((sum, d) => sum + d.newSubscribers, 0)}人
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">総解約</p>
          <p className="text-xl font-bold text-red-600">
            {data.reduce((sum, d) => sum + d.churnedSubscribers, 0)}人
          </p>
        </div>
      </div>
    </div>
  );
}
