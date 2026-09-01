import React from 'react';
import { DashboardMetrics } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Invoiced */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Invoiced
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(metrics.totalInvoiced)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {metrics.invoicesCount.total} total
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +12%
          </span>
          <span>vs last quarter</span>
        </div>
      </Card>

      {/* Overdue Amount */}
      <Card className="p-5 border-slate-200 border-l-4 border-l-rose-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
            Overdue Balance
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-600 tracking-tight">
            {formatCurrency(metrics.totalOverdue)}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {metrics.invoicesCount.overdue} overdue
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingDown className="w-3.5 h-3.5" /> {metrics.overdueTrendPercent}%
          </span>
          <span>DSO reduced this month</span>
        </div>
      </Card>

      {/* Collected This Month */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Collected This Month
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-emerald-700 tracking-tight">
            {formatCurrency(metrics.totalPaidThisMonth)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {metrics.invoicesCount.paid} settled
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +{metrics.paidTrendPercent}%
          </span>
          <span>cash acceleration rate</span>
        </div>
      </Card>

      {/* Average Days to Pay */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Days to Pay (DSO)
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {metrics.averageDaysToPay} Days
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            -14d Faster
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-slate-600 font-medium">Industry Benchmark: 38 Days</span>
        </div>
      </Card>
    </div>
  );
};
