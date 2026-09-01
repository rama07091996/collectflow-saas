'use client';

import React, { useState, useEffect } from 'react';
import { Invoice } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Send, Sparkles, Mail, Eye } from 'lucide-react';

interface ManualReminderModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedInvoice: Invoice) => void;
}

export const ManualReminderModal: React.FC<ManualReminderModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (invoice) {
      const days = invoice.daysOverdue || 0;
      let defaultSubject = `Payment Reminder: Invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.amountDue > 0 ? invoice.amountDue : invoice.amount)})`;
      let defaultBody = `Hi ${invoice.customer?.name || 'Customer'},\n\nWe wanted to follow up on invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.amountDue > 0 ? invoice.amountDue : invoice.amount)}, which was due on ${formatDate(invoice.dueDate)}.\n\nYou can review details and settle instantly via our secure payment portal:\n${invoice.paymentLinkUrl}\n\nPlease let us know if you need any adjustments or updated billing information.\n\nBest regards,\nApex Growth Media Finance Team`;

      if (days > 14) {
        defaultSubject = `URGENT: Outstanding Balance - Invoice ${invoice.invoiceNumber} (${days} days overdue)`;
        defaultBody = `Dear ${invoice.customer?.name || 'Customer'},\n\nOur records indicate invoice ${invoice.invoiceNumber} is now ${days} days overdue with an unpaid balance of ${formatCurrency(invoice.amountDue)}.\n\nPlease remit payment today to avoid service suspension:\n${invoice.paymentLinkUrl}\n\nWarm regards,\nFinance & Collections Office`;
      }

      setSubject(defaultSubject);
      setBody(defaultBody);
    }
  }, [invoice]);

  if (!invoice) return null;

  const handleSend = async () => {
    setIsSending(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/remind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customNote: body }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Follow-up reminder dispatched to ${invoice.customer?.email}!`, 'success');
        onSuccess(data.data);
        onClose();
      } else {
        toast(data.error || 'Failed to dispatch reminder.', 'error');
      }
    } catch (err) {
      toast('Network error sending reminder.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispatch Nudge: ${invoice.invoiceNumber}`}
      description={`Send a direct email reminder to ${invoice.customer?.companyName} (${invoice.customer?.email})`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tone automatically calibrated for <strong>{invoice.daysOverdue || 0} days overdue</strong></span>
          </div>
          <span className="font-bold text-emerald-950">
            {formatCurrency(invoice.amountDue > 0 ? invoice.amountDue : invoice.amount)}
          </span>
        </div>

        <Input
          label="Subject Line"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="text-xs"
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Email Message Body</label>
          <textarea
            rows={7}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            isLoading={isSending}
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
          >
            Send Reminder Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
