'use client';

import React, { useEffect, useState } from 'react';
import { Invoice, Customer } from '@/lib/types';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { InvoiceFilters } from '@/components/invoices/InvoiceFilters';
import { InvoiceDetailModal } from '@/components/invoices/InvoiceDetailModal';
import { ManualReminderModal } from '@/components/invoices/ManualReminderModal';
import { CreateInvoiceModal } from '@/components/invoices/CreateInvoiceModal';
import { useToast } from '@/components/ui/Toast';
import { Loader2 } from 'lucide-react';

export default function InvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentTab, setCurrentTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reminderTarget, setReminderTarget] = useState<Invoice | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();
      if (currentTab !== 'ALL') params.set('status', currentTab);
      if (searchQuery) params.set('search', searchQuery);
      params.set('limit', '50');

      const [itemsRes, custRes] = await Promise.all([
        fetch(`/api/items?${params.toString()}`),
        fetch('/api/invoices'),
      ]);
      const itemsData = await itemsRes.json();
      const custData = await custRes.json();

      if (itemsData.success) {
        setInvoices(itemsData.data);
      }
      if (custData.success) {
        setCustomers(custData.customers || []);
      }
    } catch (e) {
      console.error('Failed to fetch invoices', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentTab, searchQuery]);

  const handleSimulatePayment = async (invoice: Invoice) => {
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        toast(`Simulated payment of $${invoice.amountDue.toLocaleString()} captured! Invoice marked PAID.`, 'success');
        fetchInvoices();
        if (selectedInvoice && selectedInvoice.id === invoice.id) {
          setSelectedInvoice(data.data);
        }
      }
    } catch (err) {
      toast('Failed to simulate payment.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Invoices & Accounts Receivable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track unpaid receivables, view debtor risk profiles, and dispatch automated follow-up cadences.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <InvoiceFilters
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Invoices Data Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onSelectInvoice={(inv) => {
            setSelectedInvoice(inv);
            setIsDetailOpen(true);
          }}
          onSendReminder={(inv) => {
            setReminderTarget(inv);
            setIsReminderOpen(true);
          }}
          onSimulatePayment={handleSimulatePayment}
        />
      )}

      {/* Detail Drawer Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSendReminder={(inv) => {
          setReminderTarget(inv);
          setIsReminderOpen(true);
        }}
        onSimulatePayment={handleSimulatePayment}
      />

      {/* Manual Reminder Sender Modal */}
      <ManualReminderModal
        invoice={reminderTarget}
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        onSuccess={() => fetchInvoices()}
      />

      {/* Create New Invoice Modal */}
      <CreateInvoiceModal
        customers={customers}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchInvoices()}
      />
    </div>
  );
}
