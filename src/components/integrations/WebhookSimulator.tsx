'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Terminal, Play, Zap, CheckCircle2 } from 'lucide-react';

export const WebhookSimulator: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[2024-09-01 14:15:02] [Stripe Webhook] invoice.paid payload received for $24,500.00. Settled INV-2024-0098.',
    '[2024-09-01 12:00:18] [QuickBooks Sync] Fetched 14 AR ledger accounts. Balanced with zero variances.',
    '[2024-09-01 09:30:45] [CollectFlow Scheduler] Cadence triggered: Dispatched 2 automated email follow-ups.',
  ]);

  const handleSimulateWebhook = async (type: 'payment' | 'new_invoice') => {
    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 700));

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    let newLog = '';

    if (type === 'payment') {
      newLog = `[${timestamp}] [Stripe Webhook] charge.succeeded: $14,200 captured from Horizon Media Group.`;
      toast('Simulated Stripe payment webhook received!', 'success');
    } else {
      newLog = `[${timestamp}] [QuickBooks Webhook] invoice.created: INV-2024-0199 ($8,500.00) imported and enrolled in cadence.`;
      toast('Simulated QuickBooks new invoice sync completed!', 'info');
    }

    setLogs((prev) => [newLog, ...prev]);
    setIsSimulating(false);
    onRefresh();
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600" />
          <CardTitle>Webhook & Integration Event Console</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulateWebhook('new_invoice')}
            disabled={isSimulating}
            className="text-xs"
          >
            Simulate New Invoice Webhook
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleSimulateWebhook('payment')}
            disabled={isSimulating}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 font-semibold"
          >
            Simulate Stripe Payment Webhook
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2 h-44 overflow-y-auto border border-slate-800 shadow-inner">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 select-none">&gt;</span>
              <span className="text-slate-300">{log}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
