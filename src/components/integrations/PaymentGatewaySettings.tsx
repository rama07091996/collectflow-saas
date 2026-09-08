'use client';

import React, { useEffect, useState } from 'react';
import { PaymentGatewayConfig, PaymentRecord } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle2,
  Database,
  ExternalLink,
  RefreshCw,
  Zap,
  Lock,
  Sparkles,
} from 'lucide-react';

export const PaymentGatewaySettings: React.FC = () => {
  const { toast } = useToast();
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayConfig | null>(null);
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [mode, setMode] = useState<'TEST' | 'LIVE'>('TEST');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [gwRes, payRes] = await Promise.all([
        fetch('/api/payments/gateways'),
        fetch('/api/payments/checkout'),
      ]);
      const gwData = await gwRes.json();
      const payData = await payRes.json();

      if (gwData.success && gwData.data) {
        setGateways(gwData.data);
        const stripe = gwData.data.find((g: any) => g.provider === 'STRIPE') || gwData.data[0];
        if (stripe) {
          setSelectedGateway(stripe);
          setPublishableKey(stripe.publishableKey || '');
          setSecretKey(stripe.secretKey || '');
          setWebhookSecret(stripe.webhookSecret || '');
          setMode(stripe.mode || 'TEST');
        }
      }

      if (payData.success && payData.data) {
        setPayments(payData.data);
      }
    } catch (e) {
      console.error('Failed to load gateways', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGateway) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/payments/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedGateway.provider,
          publishableKey,
          secretKey,
          webhookSecret,
          mode,
          isEnabled: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast(`${selectedGateway.name} keys saved to MongoDB!`, 'success');
        fetchData();
      } else {
        toast(data.error || 'Failed to update gateway', 'error');
      }
    } catch {
      toast('Network error updating gateway', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gateway API Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Payment Gateway Integration</h2>
              <p className="text-xs text-slate-500">
                Configure your Stripe, ACH, and Card keys. All configuration is stored securely in MongoDB.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-3 h-3" />
              <span>MongoDB Synced</span>
            </span>
          </div>
        </div>

        {/* Provider Tabs */}
        <div className="flex gap-2">
          {gateways.map((g) => (
            <button
              key={g.provider}
              type="button"
              onClick={() => {
                setSelectedGateway(g);
                setPublishableKey(g.publishableKey || '');
                setSecretKey(g.secretKey || '');
                setWebhookSecret(g.webhookSecret || '');
                setMode(g.mode || 'TEST');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedGateway?.provider === g.provider
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSaveGateway} className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="text-xs font-semibold text-slate-700">Environment Mode:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('TEST')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mode === 'TEST'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Test / Sandbox
              </button>
              <button
                type="button"
                onClick={() => setMode('LIVE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mode === 'LIVE'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Production / Live
              </button>
            </div>
          </div>

          <Input
            label="Publishable API Key"
            placeholder="pk_test_..."
            value={publishableKey}
            onChange={(e) => setPublishableKey(e.target.value)}
            leftIcon={<Key className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs font-mono"
            required
          />

          <Input
            label="Secret API Key"
            type="password"
            placeholder="sk_test_..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            leftIcon={<Lock className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs font-mono"
            required
          />

          <Input
            label="Webhook Signing Secret"
            type="password"
            placeholder="whsec_..."
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs font-mono"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Keys are encrypted in DB and used for automated 1-click debtor checkout.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              Save Gateway Keys to MongoDB
            </Button>
          </div>
        </form>
      </div>

      {/* MongoDB Live Payments Transaction Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              MongoDB Payments Transaction Stream ({payments.length})
            </h3>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} leftIcon={<RefreshCw className="w-3 h-3" />}>
            Refresh DB
          </Button>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No payment transactions recorded in MongoDB yet. Process a checkout or signup to see live records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Type / Description</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-900">{p.id}</td>
                    <td className="py-2.5 px-3">{p.notes || p.planName || 'Invoice Settlement'}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">
                      ${p.amount?.toLocaleString()} {p.currency}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{p.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
