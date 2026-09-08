'use client';

import React, { useEffect, useState } from 'react';
import { Integration } from '@/lib/types';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { WebhookSimulator } from '@/components/integrations/WebhookSimulator';
import { PaymentGatewaySettings } from '@/components/integrations/PaymentGatewaySettings';
import { Loader2 } from 'lucide-react';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations');
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.data);
      }
    } catch (e) {
      console.error('Failed to load integrations', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Loading Gateway & Accounting Integrations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Accounting & Payment Integrations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure payment gateway API keys (Stripe/Card/ACH) and sync with accounting software. All data is backed in MongoDB.
        </p>
      </div>

      {/* Payment Gateways (Stripe, PayPal, Razorpay & MongoDB Transaction Stream) */}
      <PaymentGatewaySettings />

      {/* Accounting Integrations (QuickBooks, Xero, Stripe) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Connected Accounting Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((int) => (
            <IntegrationCard
              key={int.id}
              integration={int}
              onRefresh={fetchIntegrations}
            />
          ))}
        </div>
      </div>

      {/* Webhook Simulator & Event Log */}
      <WebhookSimulator onRefresh={fetchIntegrations} />
    </div>
  );
}
