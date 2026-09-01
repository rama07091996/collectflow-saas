'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Calculator, Sparkles, TrendingUp, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const InteractiveCalculator: React.FC = () => {
  const [monthlyInvoicing, setMonthlyInvoicing] = useState<number>(100000);
  const [overduePercentage, setOverduePercentage] = useState<number>(25);

  const annualInvoiced = monthlyInvoicing * 12;
  const annualOverdueAtRisk = annualInvoiced * (overduePercentage / 100);
  // CollectFlow typical recovery improvement: 78% of overdue cash collected 14 days earlier
  const recoveredCashAccelerated = annualOverdueAtRisk * 0.78;
  const hoursSavedPerMonth = Math.round((monthlyInvoicing / 10000) * 3.5);
  const estimatedAnnualInterestSaved = (annualOverdueAtRisk * 0.08 * 14) / 365;

  return (
    <section id="calculator" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Cashflow ROI Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            How Much Working Capital is Trapped in Your AR?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Adjust the sliders below to calculate how much trapped cash CollectFlow will unlock for your agency.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Average Monthly Invoiced Volume
                </label>
                <span className="text-base font-bold text-emerald-700">
                  {formatCurrency(monthlyInvoicing)} / mo
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={monthlyInvoicing}
                onChange={(e) => setMonthlyInvoicing(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>$10,000</span>
                <span>$250,000</span>
                <span>$500,000+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Estimated Invoices Paid Late or Past Due
                </label>
                <span className="text-base font-bold text-rose-600">{overduePercentage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={overduePercentage}
                onChange={(e) => setOverduePercentage(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>5% (Healthy)</span>
                <span>25% (Average)</span>
                <span>60% (Severe)</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="font-semibold text-slate-800">Based on data from 400+ SMBs & Digital Agencies:</div>
              <div>• Typical DSO (Days Sales Outstanding) reduction: <strong>14.2 days</strong></div>
              <div>• Automatic bad debt write-off prevention: <strong>89.4%</strong></div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Annual Accelerated Cash
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {formatCurrency(recoveredCashAccelerated)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Injected back into your business bank account faster each year.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Manual Hours Saved</span>
                <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                  {hoursSavedPerMonth} hrs / mo
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">DSO Reduction</span>
                <span className="text-xl font-bold text-white mt-0.5 block">14 Days Faster</span>
              </div>
            </div>

            <Link href="/dashboard" className="block pt-2">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3"
              >
                Unlock Your Trapped Cash
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
