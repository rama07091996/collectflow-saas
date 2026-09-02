'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, Zap, Flame, AlertTriangle, ChevronRight } from 'lucide-react';
import { WidgetTabProps } from '../types';

export function ActionTriggersTab({ onClose }: WidgetTabProps) {
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleExecute = async (actionType: string, label: string) => {
    setLoadingAction(actionType);
    try {
      if (actionType === 'RUN_AUTOPILOT') {
        const res = await fetch('/api/ai/autopilot', { method: 'POST' });
        const data = await res.json();
        toast(data.message || 'Auto-Pilot reminders dispatched.', 'success');
      } else {
        const res = await fetch('/api/actions/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionType }),
        });
        const data = await res.json();
        toast(data.message || `${label} executed successfully.`, 'success');
      }
    } catch (e: any) {
      toast(`Action failed: ${e.message}`, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
      <div className="text-xs text-slate-400 font-medium">
        1-Click Enterprise Workflow Action Triggers:
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleExecute('RUN_AUTOPILOT', 'Autonomous Dunning')}
          disabled={loadingAction !== null}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all flex items-center justify-between group disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Run Autonomous Dunning Auto-Pilot</div>
              <div className="text-[10px] text-slate-400">Scans all overdue accounts and sends calibrated emails</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => handleExecute('NUDGE_ALL_OVERDUE', 'Nudge All Overdue')}
          disabled={loadingAction !== null}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all flex items-center justify-between group disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Nudge All Overdue Debtors</div>
              <div className="text-[10px] text-slate-400">Dispatches friendly payment link nudges</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
        </button>

        <button
          onClick={() => handleExecute('APPLY_LATE_FEE', 'Apply 1.5% Late Fee')}
          disabled={loadingAction !== null}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-left transition-all flex items-center justify-between group disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Apply 1.5% Statutory Late Fees</div>
              <div className="text-[10px] text-slate-400">Accrues interest penalties to delinquent ledger</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
        </button>

        <button
          onClick={() => handleExecute('ESCALATE_DELINQUENT', 'Escalate Delinquent')}
          disabled={loadingAction !== null}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition-all flex items-center justify-between group disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Dispatch Legal Escalation Notice</div>
              <div className="text-[10px] text-slate-400">Issues formal 30-day demand letter</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
        </button>
      </div>
    </div>
  );
}
