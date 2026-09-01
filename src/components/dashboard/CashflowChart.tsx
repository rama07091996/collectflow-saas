import React from 'react';
import { DashboardMetrics } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface CashflowChartProps {
  cashflow: DashboardMetrics['monthlyCashflow'];
}

export const CashflowChart: React.FC<CashflowChartProps> = ({ cashflow }) => {
  const maxVal = Math.max(...cashflow.map((c) => Math.max(c.collected, c.invoiced, c.projected))) * 1.1;

  return (
    <Card className="flex-1">
      <CardHeader>
        <div>
          <CardTitle>Cash Collection & Forecast Velocity</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical vs. projected automated collection performance.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 font-medium">Collected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-300" />
            <span className="text-slate-600 font-medium">Invoiced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-300 border border-dashed border-emerald-600" />
            <span className="text-slate-600 font-medium">Projected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
          {cashflow.map((item, idx) => {
            const collectedHeight = (item.collected / maxVal) * 100;
            const invoicedHeight = (item.invoiced / maxVal) * 100;
            const isForecast = item.month.includes('Forecast');

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap shadow-lg">
                  <div>Invoiced: {formatCurrency(item.invoiced)}</div>
                  <div>Collected: {formatCurrency(item.collected)}</div>
                </div>

                {/* Bars */}
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  {/* Invoiced Bar */}
                  <div
                    style={{ height: `${invoicedHeight}%` }}
                    className="w-1/2 bg-slate-200 group-hover:bg-slate-300 rounded-t transition-all duration-300"
                  />
                  {/* Collected / Projected Bar */}
                  <div
                    style={{ height: `${collectedHeight}%` }}
                    className={`w-1/2 rounded-t transition-all duration-300 ${
                      isForecast
                        ? 'bg-emerald-300 border-t-2 border-emerald-500 border-dashed'
                        : 'bg-emerald-500 group-hover:bg-emerald-600'
                    }`}
                  />
                </div>

                {/* Label */}
                <span className="text-[11px] font-semibold text-slate-500 text-center truncate max-w-[60px]">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
