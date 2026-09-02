'use client';

import React from 'react';
import { WidgetTabProps } from '../types';

export function ARPulseTab({}: WidgetTabProps) {
  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Overdue</div>
          <div className="text-lg font-bold text-rose-400">$77,850</div>
          <div className="text-[10px] text-rose-400 font-medium">3 Delinquent</div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Paid This Month</div>
          <div className="text-lg font-bold text-emerald-400">$73,300</div>
          <div className="text-[10px] text-emerald-400 font-medium">+22.4% vs last mo</div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Days to Pay</div>
          <div className="text-lg font-bold text-white">21.4 Days</div>
          <div className="text-[10px] text-emerald-400 font-medium">Dropped by 14d</div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Collection Eff.</div>
          <div className="text-lg font-bold text-emerald-400">88.4%</div>
          <div className="text-[10px] text-slate-400 font-medium">Optimal CEI index</div>
        </div>
      </div>
    </div>
  );
}
