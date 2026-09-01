'use client';

import React, { useEffect, useState } from 'react';
import { Customer } from '@/lib/types';
import { ShareContactModal } from '@/components/customers/ShareContactModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, getRiskBadge } from '@/lib/utils';
import {
  Users,
  Search,
  Share2,
  Mail,
  Phone,
  Building2,
  Globe,
  Download,
  ShieldCheck,
  ExternalLink,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function CustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      if (data.success && data.customers) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error('Failed to load customers', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.apContactName && c.apContactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.apEmail && c.apEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    const matchesSource = sourceFilter === 'ALL' || c.sourceProvider === sourceFilter;

    return matchesSearch && matchesRisk && matchesSource;
  });

  const handleExportCSV = () => {
    const headers = ['Company', 'Contact Name', 'Email', 'Phone', 'AP Contact', 'AP Email', 'Outstanding Balance', 'Risk Rating', 'Terms'];
    const rows = filteredCustomers.map((c) => [
      `"${c.companyName}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone || ''}"`,
      `"${c.apContactName || ''}"`,
      `"${c.apEmail || ''}"`,
      c.totalOutstanding,
      c.riskLevel,
      `Net ${c.paymentTermsDays}`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `collectflow_debtor_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(`Exported ${filteredCustomers.length} debtor contacts to CSV!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Debtor & Accounts Payable Directory Aggregator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Aggregated Client & Debtor Contacts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified contact intelligence across Stripe, QuickBooks, and Xero with 1-click contact card sharing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs text-slate-700 hover:text-slate-900"
          >
            Export All Contacts (CSV)
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by company, primary contact, AP manager, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="text-xs h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Accounting Integrations</option>
              <option value="STRIPE">Stripe Invoicing</option>
              <option value="QUICKBOOKS">QuickBooks Online</option>
              <option value="XERO">Xero Accounting</option>
              <option value="FRESHBOOKS">FreshBooks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => {
          const riskBadge = getRiskBadge(customer.riskLevel, customer.riskScore);

          return (
            <Card
              key={customer.id}
              className="p-5 border-slate-200/90 flex flex-col justify-between hover:shadow-md transition-all group bg-white"
            >
              <div>
                {/* Header with Company & Risk */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {customer.companyName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-600 font-medium">{customer.name}</span>
                      {customer.sourceProvider && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                          {customer.sourceProvider}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${riskBadge.className}`}
                  >
                    {riskBadge.label}
                  </span>
                </div>

                {/* Contact Data Points */}
                <div className="space-y-2 text-xs text-slate-600 py-3 border-y border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Billing Email:</span>
                    <a
                      href={`mailto:${customer.email}`}
                      className="font-medium text-slate-800 hover:text-emerald-600 truncate max-w-[190px]"
                    >
                      {customer.email}
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Direct Phone:</span>
                    <a
                      href={`tel:${customer.phone}`}
                      className="font-medium text-slate-800 hover:text-emerald-600"
                    >
                      {customer.phone || '+1 (555) 019-2831'}
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AP Manager:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[190px]">
                      {customer.apContactName || 'Accounts Payable'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Payment Terms:</span>
                    <span className="font-semibold text-slate-900">
                      Net {customer.paymentTermsDays} Days
                    </span>
                  </div>
                </div>

                {/* Balance & Revenue */}
                <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Outstanding
                    </span>
                    <span
                      className={`text-sm font-bold block mt-0.5 ${
                        customer.totalOutstanding > 0 ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {formatCurrency(customer.totalOutstanding)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Lifetime Paid
                    </span>
                    <span className="text-sm font-bold text-emerald-700 block mt-0.5">
                      {formatCurrency(customer.totalPaid)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-Click Share Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsShareModalOpen(true);
                  }}
                  leftIcon={<Share2 className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 py-1.5"
                >
                  Share Contact Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Share Contact Modal */}
      <ShareContactModal
        customer={selectedCustomer}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
