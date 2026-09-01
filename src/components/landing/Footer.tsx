import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
            <TrendingUp className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">CollectFlow B2B</span>
          <span className="text-slate-500 ml-2">© 2024 CollectFlow Technologies Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            App Dashboard
          </Link>
          <Link href="/invoices" className="hover:text-white transition-colors">
            Invoices Table
          </Link>
          <Link href="/workflows" className="hover:text-white transition-colors">
            Cadence Builder
          </Link>
          <Link href="/integrations" className="hover:text-white transition-colors">
            Stripe & QuickBooks
          </Link>
        </div>
      </div>
    </footer>
  );
};
