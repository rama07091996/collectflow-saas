'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ArrowRight,
  Clock,
  Loader2,
} from 'lucide-react';

interface AutoPilotBannerProps {
  onRefreshData?: () => void;
}

export function AutoPilotBanner({ onRefreshData }: AutoPilotBannerProps) {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRunAutoPilot = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/ai/autopilot', { method: 'POST' });
      const data = await res.json();

      if (data.success && data.data) {
        setRunResult(data.data);
        setIsModalOpen(true);
        toast(`Autonomous engine dispatched ${data.data.processedCount} reminder emails!`, 'success');
        if (onRefreshData) onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to execute autopilot');
      }
    } catch (e: any) {
      toast(e.message || 'Error running autopilot', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Autonomous AR Auto-Pilot
              </span>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active
              </span>
            </div>
            <h3 className="font-bold text-base text-white tracking-tight mt-0.5">
              Auto-Generate & Send Due / Overdue Reminders
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Our AI scans upcoming and overdue invoices daily, drafts personalized tone-calibrated emails, and dispatches them with 1-click payment links.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="md"
            variant="primary"
            onClick={handleRunAutoPilot}
            isLoading={isRunning}
            leftIcon={!isRunning ? <Zap className="w-4 h-4 text-slate-950 fill-current" /> : undefined}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs py-2.5 px-5 shadow-lg shadow-emerald-500/20"
          >
            Run Auto-Reminder Engine
          </Button>
        </div>
      </div>

      {/* AutoPilot Run Results Modal */}
      {runResult && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Autonomous AR Run Summary"
          description={`Scanned and generated ${runResult.processedCount} automated reminder emails targeting ${formatCurrency(runResult.totalRecoverableAmount)} in receivables.`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All <strong>{runResult.processedCount}</strong> reminder emails were successfully generated with live 1-click Stripe payment links and logged into the communication audit trail.
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {runResult.dispatchedEmails?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.customerName}</span>
                    <span className="font-bold text-rose-600">{formatCurrency(item.amountDue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Invoice: #{item.invoiceNumber}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                      {item.stage}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded border border-slate-200 truncate">
                    Subject: {item.subject}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-xs font-bold"
              >
                Close Summary
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
