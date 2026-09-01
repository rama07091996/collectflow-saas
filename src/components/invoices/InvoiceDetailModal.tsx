'use client';

import React, { useState } from 'react';
import { Invoice } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeVariant,
  getRiskBadge,
} from '@/lib/utils';
import {
  Send,
  CreditCard,
  Mail,
  Copy,
  Check,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReminder: (invoice: Invoice) => void;
  onSimulatePayment: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSendReminder,
  onSimulatePayment,
}) => {
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!invoice) return null;

  const statusBadge = getStatusBadgeVariant(invoice.status);
  const riskBadge = invoice.customer
    ? getRiskBadge(invoice.customer.riskLevel, invoice.customer.riskScore)
    : null;

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(invoice.paymentLinkUrl);
    setCopiedLink(true);
    toast('One-click payment portal URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{invoice.invoiceNumber}</h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.className}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Issued {formatDate(invoice.issueDate)} • Due {formatDate(invoice.dueDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'PAID' && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    onClose();
                    onSendReminder(invoice);
                  }}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  Send Nudge
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    onSimulatePayment(invoice);
                  }}
                  leftIcon={<CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
                  className="text-xs"
                >
                  Simulate Payment
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Debtor Profile Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Client & Debtor
            </span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">
              {invoice.customer?.companyName}
            </div>
            <div className="text-xs text-slate-600">{invoice.customer?.name}</div>
            <div className="text-xs text-slate-500">{invoice.customer?.email}</div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Payment Terms & Risk
            </span>
            <div className="mt-1 flex items-center gap-2">
              {riskBadge && (
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${riskBadge.className}`}>
                  {riskBadge.label}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Terms: Net {invoice.customer?.paymentTermsDays || 30} Days
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Outstanding vs Total
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatCurrency(invoice.amountDue > 0 ? invoice.amountDue : invoice.amount)}
            </div>
            <div className="text-xs text-emerald-700 font-medium">
              Lifetime Paid: {formatCurrency(invoice.customer?.totalPaid || 0)}
            </div>
          </div>
        </div>

        {/* One Click Payment Portal Link */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-emerald-950">One-Click Client Payment Portal</div>
              <div className="text-[11px] text-emerald-700 truncate">{invoice.paymentLinkUrl}</div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyPaymentLink}
            leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs shrink-0 bg-white border-emerald-300"
          >
            {copiedLink ? 'Copied' : 'Copy Link'}
          </Button>
        </div>

        {/* Line Items Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Invoice Breakdown
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            <div className="bg-slate-50/80 px-4 py-2 text-[11px] font-bold text-slate-500 uppercase flex justify-between">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            {invoice.items?.map((item) => (
              <div key={item.id} className="px-4 py-3 flex justify-between text-xs">
                <span className="text-slate-800 font-medium">{item.description}</span>
                <span className="text-slate-900 font-bold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="bg-slate-50/50 px-4 py-3 flex justify-between text-sm font-bold border-t border-slate-200">
              <span className="text-slate-900">Total Balance</span>
              <span className="text-emerald-700">{formatCurrency(invoice.amount)}</span>
            </div>
          </div>
        </div>

        {/* Communication Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Follow-Up & Reminder Audit Trail</span>
          </h4>
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {invoice.communications && invoice.communications.length > 0 ? (
              invoice.communications.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">{comm.subject}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{formatDate(comm.sentAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{comm.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> {comm.status}
                    </span>
                    {comm.openedAt && (
                      <span>Opened at {new Date(comm.openedAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                No reminders sent yet. Next automated reminder scheduled per cadence rules.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
