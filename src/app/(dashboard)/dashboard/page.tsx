'use client';

import React, { useEffect, useState } from 'react';
import { DashboardMetrics, Customer } from '@/lib/types';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { AutoPilotBanner } from '@/components/dashboard/AutoPilotBanner';
import { AgingBreakdownChart } from '@/components/dashboard/AgingBreakdownChart';
import { CashflowChart } from '@/components/dashboard/CashflowChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { CreateInvoiceModal } from '@/components/invoices/CreateInvoiceModal';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, itemsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/items?limit=100'),
      ]);
      const statsData = await statsRes.json();
      const itemsData = await itemsRes.json();

      if (statsData.success) setMetrics(statsData.data);
      if (itemsData.success) {
        // Fetch customers list for modal
        const invoicesRes = await fetch('/api/invoices');
        const invoicesData = await invoicesRes.json();
        setCustomers(invoicesData.customers || []);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Loading AR Dashboard & Cashflow Forecast...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Accounts Receivable Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cash flow acceleration, debtor aging metrics, and autonomous follow-up health.
          </p>
        </div>
      </div>

      {/* Autonomous AR Auto-Pilot Banner */}
      <AutoPilotBanner onRefreshData={fetchData} />

      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Action Queue Banner */}
      <QuickActions
        onOpenCreateInvoice={() => setIsCreateModalOpen(true)}
        onRefreshData={fetchData}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgingBreakdownChart agingBuckets={metrics.agingBuckets} />
        <CashflowChart cashflow={metrics.monthlyCashflow} />
      </div>

      {/* Audit & Event Feed */}
      <RecentActivityFeed />

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        customers={customers}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchData()}
      />
    </div>
  );
}
