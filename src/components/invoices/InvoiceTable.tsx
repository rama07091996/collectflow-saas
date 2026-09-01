'use client';

import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { formatCurrency, formatDate, getStatusBadgeVariant, getRiskBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Send,
  CreditCard,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onSendReminder: (invoice: Invoice) => void;
  onSimulatePayment: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onSelectInvoice,
  onSendReminder,
  onSimulatePayment,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'amount' | 'dueDate' | 'invoiceNumber'>('dueDate');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field: 'amount' | 'dueDate' | 'invoiceNumber') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    let comp = 0;
    if (sortField === 'amount') comp = a.amountDue - b.amountDue;
    else if (sortField === 'dueDate') comp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    else comp = a.invoiceNumber.localeCompare(b.invoiceNumber);
    return sortAsc ? comp : -comp;
  });

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Batch Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between animate-in fade-in">
          <div className="text-xs font-semibold text-emerald-900">
            {selectedIds.length} invoice{selectedIds.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const target = invoices.find((i) => selectedIds.includes(i.id));
                if (target) onSendReminder(target);
              }}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Dispatch Batch Follow-Up
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds([])}
              className="text-xs"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
            <tr>
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={invoices.length > 0 && selectedIds.length === invoices.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th
                onClick={() => handleSort('invoiceNumber')}
                className="p-4 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Invoice #</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4">Debtor / Client</th>
              <th className="p-4">Risk Profile</th>
              <th
                onClick={() => handleSort('amount')}
                className="p-4 cursor-pointer hover:text-slate-900 text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Amount Due</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('dueDate')}
                className="p-4 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Due Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4">Status</th>
              <th className="p-4">Reminders</th>
              <th className="p-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {sortedInvoices.map((inv) => {
              const statusBadge = getStatusBadgeVariant(inv.status);
              const riskBadge = inv.customer
                ? getRiskBadge(inv.customer.riskLevel, inv.customer.riskScore)
                : null;
              const isSelected = selectedIds.includes(inv.id);

              return (
                <tr
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleSelectOne(inv.id, e as any)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>

                  {/* Invoice Number */}
                  <td className="p-4 font-semibold text-slate-900 flex items-center gap-2">
                    <span>{inv.invoiceNumber}</span>
                  </td>

                  {/* Debtor */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{inv.customer?.companyName}</div>
                    <div className="text-xs text-slate-400">{inv.customer?.email}</div>
                  </td>

                  {/* Risk Profile */}
                  <td className="p-4">
                    {riskBadge && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${riskBadge.className}`}>
                        {riskBadge.label}
                      </span>
                    )}
                  </td>

                  {/* Amount Due */}
                  <td className="p-4 text-right">
                    <div className="font-bold text-slate-900">
                      {formatCurrency(inv.amountDue > 0 ? inv.amountDue : inv.amount)}
                    </div>
                    {inv.amountPaid > 0 && inv.status !== 'PAID' && (
                      <div className="text-[11px] text-emerald-600 font-medium">
                        ({formatCurrency(inv.amountPaid)} paid)
                      </div>
                    )}
                  </td>

                  {/* Due Date & Overdue Days */}
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{formatDate(inv.dueDate)}</div>
                    {inv.daysOverdue && inv.daysOverdue > 0 ? (
                      <div className="text-[11px] text-rose-600 font-bold">
                        {inv.daysOverdue} days overdue
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">Issued {formatDate(inv.issueDate)}</div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                      {statusBadge.label}
                    </span>
                  </td>

                  {/* Reminders Count */}
                  <td className="p-4">
                    <div className="text-xs font-medium text-slate-700">
                      {inv.remindersSentCount} sent
                    </div>
                    {inv.lastReminderAt && (
                      <div className="text-[10px] text-slate-400">
                        Last {formatDate(inv.lastReminderAt)}
                      </div>
                    )}
                  </td>

                  {/* Quick Actions */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'PAID' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onSendReminder(inv)}
                            leftIcon={<Send className="w-3 h-3" />}
                            className="text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                            title="Send customized reminder email"
                          >
                            Nudge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSimulatePayment(inv)}
                            leftIcon={<CreditCard className="w-3 h-3 text-emerald-600" />}
                            className="text-xs py-1 px-2.5 border-slate-200 hover:bg-emerald-50 text-slate-700"
                            title="Simulate 1-click payment received"
                          >
                            Pay
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectInvoice(inv)}
                        className="text-xs p-1.5 text-slate-400 hover:text-slate-700"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
