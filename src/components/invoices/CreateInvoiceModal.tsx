'use client';

import React, { useState } from 'react';
import { Customer, Invoice } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Plus, DollarSign, Building2, User, Mail, Sparkles } from 'lucide-react';

interface CreateInvoiceModalProps {
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInvoice?: Invoice) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  customers,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isNewClient, setIsNewClient] = useState(customers.length === 0);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  
  // Custom new customer fields
  const [newClientName, setNewClientName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  const [amount, setAmount] = useState('8500');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('Professional Consulting Services & Software License');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast('Please enter a valid invoice amount.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let targetCustomerId = customerId;

      // If adding a new client, create them first or pass details
      if (isNewClient || customers.length === 0) {
        if (!newCompanyName && !newClientName) {
          toast('Please enter the client company name.', 'error');
          setIsSubmitting(false);
          return;
        }
        targetCustomerId = `cust_${Date.now()}`;
      }

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: targetCustomerId || customers[0]?.id || 'cust_new',
          customerName: newClientName || 'Primary Debtor',
          companyName: newCompanyName || 'Client Enterprise LLC',
          customerEmail: newClientEmail || 'billing@client.com',
          invoiceNumber,
          amount: Number(amount),
          dueDate: new Date(dueDate).toISOString(),
          notes: description,
          items: [
            {
              description,
              quantity: 1,
              unitPrice: Number(amount),
              amount: Number(amount),
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast(`Invoice ${invoiceNumber} created and automated cadence activated!`, 'success');
        onSuccess(data.data);
        onClose();
      } else {
        toast(data.error || 'Failed to create invoice.', 'error');
      }
    } catch (err) {
      toast('Network error creating invoice.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New B2B Invoice"
      description="Issue invoice, generate one-click payment portal, and enroll in smart collection cadence."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle between existing client or new client */}
        {customers.length > 0 && (
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setIsNewClient(false)}
              className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                !isNewClient ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Select Existing Debtor ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setIsNewClient(true)}
              className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                isNewClient ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Add New Debtor Client
            </button>
          </div>
        )}

        {/* Existing Client Dropdown */}
        {!isNewClient && customers.length > 0 ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client / Debtor Company
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.name})
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* New Client Input Form */
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>New Debtor Client Details</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Company Name"
                placeholder="Acme Corp"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="text-xs bg-white"
                required
              />
              <Input
                label="Contact Person"
                placeholder="John Doe"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="text-xs bg-white"
                required
              />
            </div>
            <Input
              label="Billing Email"
              type="email"
              placeholder="ap@acmecorp.com"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
              className="text-xs bg-white"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="text-xs font-mono"
            required
          />
          <Input
            label="Amount Due ($ USD)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            leftIcon={<DollarSign className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
            required
          />
        </div>

        <div>
          <Input
            label="Payment Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="text-xs"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Primary Deliverable / Service Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Description of delivered services or deliverables..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
          >
            Create Invoice & Start Cadence
          </Button>
        </div>
      </form>
    </Modal>
  );
};
