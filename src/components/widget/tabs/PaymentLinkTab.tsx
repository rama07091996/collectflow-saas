'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { DollarSign, CheckCircle2 } from 'lucide-react';
import { WidgetTabProps } from '../types';

export function PaymentLinkTab({}: WidgetTabProps) {
  const { toast } = useToast();
  const [payInvoiceId, setPayInvoiceId] = useState('inv_01');
  const [payAmount, setPayAmount] = useState('4200.00');
  const [payEmail, setPayEmail] = useState('billing@novalabs.bio');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerateLink = () => {
    const link = `https://pay.collectflow.io/checkout?invoice=${payInvoiceId}&amt=${payAmount}&email=${encodeURIComponent(payEmail)}`;
    setGeneratedLink(link);
    navigator.clipboard.writeText(link);
    toast('Stripe 1-Click Payment Link generated & copied to clipboard!', 'success');
  };

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
      <div className="text-xs text-slate-400 font-medium">
        Generate Encrypted 1-Click Stripe Checkout URL:
      </div>

      <div className="space-y-2.5 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Invoice ID</label>
          <input
            type="text"
            value={payInvoiceId}
            onChange={(e) => setPayInvoiceId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Settlement Amount ($ USD)</label>
          <input
            type="text"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Debtor AP Email</label>
          <input
            type="email"
            value={payEmail}
            onChange={(e) => setPayEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleGenerateLink}
          leftIcon={<DollarSign className="w-3.5 h-3.5" />}
          className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
        >
          Generate & Copy Stripe Link
        </Button>
      </div>

      {generatedLink && (
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-1.5">
          <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Link Ready
          </div>
          <div className="p-2 bg-slate-950 rounded text-[10px] font-mono text-slate-300 break-all select-all border border-slate-800">
            {generatedLink}
          </div>
        </div>
      )}
    </div>
  );
}
