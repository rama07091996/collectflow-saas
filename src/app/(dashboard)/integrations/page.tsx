'use client';

import React, { useEffect, useState } from 'react';
import { Integration } from '@/lib/types';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { WebhookSimulator } from '@/components/integrations/WebhookSimulator';
import { Loader2, Layers, ShieldCheck } from 'lucide-react';

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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
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
          Connect your accounting software and payment gateways for instant two-way synchronization.
        </p>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((int) => (
          <IntegrationCard
            key={int.id}
            integration={int}
            onRefresh={fetchIntegrations}
          />
        ))}
      </div>

      {/* Webhook Simulator & Event Log */}
      <WebhookSimulator onRefresh={fetchIntegrations} />
    </div>
  );
}
