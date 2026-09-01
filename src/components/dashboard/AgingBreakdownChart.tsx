import React from 'react';
import { DashboardMetrics } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface AgingBreakdownChartProps {
  agingBuckets: DashboardMetrics['agingBuckets'];
}

export const AgingBreakdownChart: React.FC<AgingBreakdownChartProps> = ({ agingBuckets }) => {
  const total =
    agingBuckets.current +
    agingBuckets.days1To15 +
    agingBuckets.days16To30 +
    agingBuckets.days31To60 +
    agingBuckets.days60Plus;

  const buckets = [
    { label: 'Current (Not Due)', amount: agingBuckets.current, color: 'bg-emerald-500', barBg: 'bg-emerald-500/20' },
    { label: '1 - 15 Days Past Due', amount: agingBuckets.days1To15, color: 'bg-amber-500', barBg: 'bg-amber-500/20' },
    { label: '16 - 30 Days Past Due', amount: agingBuckets.days16To30, color: 'bg-orange-500', barBg: 'bg-orange-500/20' },
    { label: '31 - 60 Days Past Due', amount: agingBuckets.days31To60, color: 'bg-rose-500', barBg: 'bg-rose-500/20' },
    { label: '60+ Days Past Due', amount: agingBuckets.days60Plus, color: 'bg-rose-700', barBg: 'bg-rose-700/20' },
  ];

  return (
    <Card className="flex-1">
      <CardHeader>
        <div>
          <CardTitle>Accounts Receivable Aging Breakdown</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution of active receivables categorized by payment delay.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total Active AR: <span className="text-slate-900 font-bold">{formatCurrency(total)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cumulative Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {buckets.map((b, idx) => {
            const pct = total > 0 ? (b.amount / total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={idx}
                style={{ width: `${pct}%` }}
                className={`${b.color} transition-all duration-500 hover:opacity-80`}
                title={`${b.label}: ${formatCurrency(b.amount)} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Detailed Buckets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {buckets.map((bucket, idx) => {
            const pct = total > 0 ? ((bucket.amount / total) * 100).toFixed(1) : '0';
            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${bucket.color}`} />
                  <span className="text-xs font-medium text-slate-600 truncate">{bucket.label}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(bucket.amount)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
