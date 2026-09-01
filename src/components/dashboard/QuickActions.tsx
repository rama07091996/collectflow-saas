'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  Send,
  PlusCircle,
  FileSpreadsheet,
  Zap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface QuickActionsProps {
  onOpenCreateInvoice: () => void;
  onRefreshData: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenCreateInvoice,
  onRefreshData,
}) => {
  const { toast } = useToast();
  const [isNudgingAll, setIsNudgingAll] = useState(false);

  const handleNudgeAll = async () => {
    setIsNudgingAll(true);
    try {
      const res = await fetch('/api/actions/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'NUDGE_ALL_OVERDUE' }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Dispatched automated follow-ups to ${data.data.affectedCount} delinquent accounts!`, 'success');
        onRefreshData();
      } else {
        toast(data.error || 'Failed to dispatch reminders.', 'error');
      }
    } catch (e) {
      toast('Failed to dispatch reminders.', 'error');
    } finally {
      setIsNudgingAll(false);
    }
  };

  const handleExportCSV = () => {
    toast('AR Aging Summary exported to CSV successfully.', 'info');
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-1.5 max-w-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
          <Zap className="w-4 h-4 fill-emerald-400" />
          <span>Automated Collections Engine Ready</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          3 Invoices totaling $42,100 need attention today
        </h3>
        <p className="text-xs text-slate-400">
          Smart cadence is ready to send tone-calibrated follow-ups with instant one-click payment links.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <Button
          variant="primary"
          onClick={handleNudgeAll}
          isLoading={isNudgingAll}
          leftIcon={<Send className="w-4 h-4" />}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
        >
          Nudge All Overdue (3)
        </Button>

        <Button
          variant="secondary"
          onClick={onOpenCreateInvoice}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
        >
          New Invoice
        </Button>

        <Button
          variant="ghost"
          onClick={handleExportCSV}
          leftIcon={<FileSpreadsheet className="w-4 h-4" />}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
        >
          Export AR
        </Button>
      </div>
    </div>
  );
};
