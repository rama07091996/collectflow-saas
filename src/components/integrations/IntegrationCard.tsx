'use client';

import React, { useState } from 'react';
import { Integration } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import {
  Layers,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';

interface IntegrationCardProps {
  integration: Integration;
  onRefresh: () => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onRefresh,
}) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isConnected = integration.status === 'CONNECTED';

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          provider: integration.provider,
          connect: !isConnected,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          isConnected
            ? `Disconnected ${integration.provider}`
            : `Successfully connected ${integration.provider} account!`,
          'success'
        );
        onRefresh();
      }
    } catch (e) {
      toast('Failed to update integration state.', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          provider: integration.provider,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Synced ${integration.provider}: ${data.log}`, 'success');
        onRefresh();
      }
    } catch (e) {
      toast('Failed to run sync.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const getProviderDetails = () => {
    switch (integration.provider) {
      case 'STRIPE':
        return {
          name: 'Stripe Invoicing & Billing',
          desc: 'Bi-directional sync of customer cards, ACH mandates, and automated payment receipts.',
          logoBg: 'bg-indigo-600',
        };
      case 'QUICKBOOKS':
        return {
          name: 'QuickBooks Online',
          desc: 'Synchronize invoices, payments, chart of accounts, and AR subledger reconciliations.',
          logoBg: 'bg-emerald-600',
        };
      case 'XERO':
        return {
          name: 'Xero Accounting',
          desc: 'Import draft and approved client invoices with live payment status tracking.',
          logoBg: 'bg-sky-500',
        };
      case 'FRESHBOOKS':
      default:
        return {
          name: 'FreshBooks',
          desc: 'Cloud invoicing sync for agencies, contractors, and consulting firms.',
          logoBg: 'bg-blue-600',
        };
    }
  };

  const details = getProviderDetails();

  return (
    <Card className="p-6 flex flex-col justify-between h-full border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${details.logoBg} text-white font-bold text-sm flex items-center justify-center shadow`}>
              {integration.provider.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{details.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {isConnected ? (
                  <Badge variant="success" dot className="text-[10px]">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="neutral" className="text-[10px]">
                    Disconnected
                  </Badge>
                )}
                {integration.accountName && isConnected && (
                  <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {integration.accountName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant={isConnected ? 'outline' : 'primary'}
            onClick={handleToggle}
            isLoading={isToggling}
            className={`text-xs font-semibold ${
              !isConnected ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-rose-600 hover:bg-rose-50 border-rose-200'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        <p className="text-xs text-slate-600 mt-4 leading-relaxed">{details.desc}</p>

        {isConnected && integration.syncLog && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase mb-1">
              <span>Last Sync Run</span>
              <span>{integration.lastSyncAt ? formatDate(integration.lastSyncAt) : 'Just now'}</span>
            </div>
            <div className="text-xs font-medium text-slate-800">{integration.syncLog}</div>
          </div>
        )}
      </div>

      {isConnected && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Sync: Hourly + Webhooks</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSyncNow}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-emerald-600" />}
            className="text-xs text-slate-700 hover:text-slate-900"
          >
            Sync Now
          </Button>
        </div>
      )}
    </Card>
  );
};
