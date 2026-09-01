'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import { Settings, Building2, Bell, Shield, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { currentOrg, currentUser } = useAuth();
  const { toast } = useToast();
  const [orgName, setOrgName] = useState(currentOrg.name);
  const [currency, setCurrency] = useState(currentOrg.currency);
  const [lateFeePercent, setLateFeePercent] = useState('1.5');
  const [gracePeriodDays, setGracePeriodDays] = useState('3');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast('Organization settings saved successfully.', 'success');
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your billing profile, currency defaults, and automated escalation parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Info */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Organization Profile</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            This name appears on client payment portals and automated email headers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Legal / Trading Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="text-xs font-medium"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="CAD">CAD ($) - Canadian Dollar</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Escalation Rules */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Late Fee & Escalation Policies</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Configure automated late penalty calculations and grace period allowances.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Grace Period (Days Before Reminder)"
              type="number"
              value={gracePeriodDays}
              onChange={(e) => setGracePeriodDays(e.target.value)}
              className="text-xs"
              helperText="Days to wait before sending first overdue reminder"
            />
            <Input
              label="Monthly Late Fee Interest Rate (%)"
              type="number"
              step="0.1"
              value={lateFeePercent}
              onChange={(e) => setLateFeePercent(e.target.value)}
              className="text-xs"
              helperText="Quoted in 14-day and 30-day escalation notices"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
