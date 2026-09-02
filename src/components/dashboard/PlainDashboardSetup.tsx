'use client';

import React from 'react';
import {
  FileText,
  UserPlus,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PlainDashboardSetupProps {
  onOpenCreateInvoice: () => void;
  onRefreshData: () => void;
}

export const PlainDashboardSetup: React.FC<PlainDashboardSetupProps> = ({
  onOpenCreateInvoice,
  onRefreshData,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/30 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-3xl space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fresh Account Workspace Initialized</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to Your Clean Workspace
          </h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Your dashboard is in a clean, fresh state ready for your financial records. Fill in your client details and create your first invoice to activate automated AR follow-ups and Stripe 1-click settlement.
          </p>
        </div>

        {/* 3 Quick-Start Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              1
            </div>
            <div className="font-bold text-sm text-white">Create First Invoice</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your debtor client, invoice amount, and due date.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
              2
            </div>
            <div className="font-bold text-sm text-white">Automated Cadence</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              CollectFlow tracks aging and dispatches calibrated reminders.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">
              3
            </div>
            <div className="font-bold text-sm text-white">Get Paid 2.4x Faster</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Debtors settle in 1 click via Stripe ACH & Card checkout.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenCreateInvoice}
            leftIcon={<FileText className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 shadow-lg shadow-emerald-500/25"
          >
            Create Your First Invoice
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={async () => {
              await fetch('/api/reset', { method: 'POST' });
              onRefreshData();
            }}
            className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold px-5"
          >
            Load Sample Demo Records
          </Button>
        </div>
      </div>
    </div>
  );
};
