'use client';

import React, { useState } from 'react';
import { Customer } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, getRiskBadge } from '@/lib/utils';
import {
  Share2,
  Copy,
  Check,
  Mail,
  Phone,
  MessageSquare,
  Building,
  ExternalLink,
  Download,
} from 'lucide-react';

interface ShareContactModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareContactModal: React.FC<ShareContactModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const riskBadge = getRiskBadge(customer.riskLevel, customer.riskScore);

  const formattedContactCard = `📋 COLLECTFLOW DEBTOR CONTACT CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 Company: ${customer.companyName}
👤 Primary Contact: ${customer.name}
✉️ Billing Email: ${customer.email}
📞 Phone: ${customer.phone || 'N/A'}
💼 AP Contact: ${customer.apContactName || 'N/A'} (${customer.apEmail || customer.email})
📍 Address: ${customer.address || 'N/A'}
🌐 Website: ${customer.website || 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Outstanding Balance: ${formatCurrency(customer.totalOutstanding)}
💳 Payment Terms: Net ${customer.paymentTermsDays} Days
⚠️ Risk Rating: ${customer.riskLevel} (Score: ${customer.riskScore}/100)
🔗 Connected Integration: ${customer.sourceProvider || 'Stripe Invoicing'}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedContactCard);
    setCopied(true);
    toast('Contact details card copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${customer.name}
ORG:${customer.companyName}
EMAIL;TYPE=WORK:${customer.email}
TEL;TYPE=WORK:${customer.phone || ''}
ADR;TYPE=WORK:;;${customer.address || ''};;;;
NOTE:AP Contact: ${customer.apContactName || ''} (${customer.apEmail || ''}) | Outstanding: $${customer.totalOutstanding}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customer.companyName.toLowerCase().replace(/\s+/g, '_')}_contact.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(`vCard contact downloaded for ${customer.companyName}!`, 'success');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hi, here are the billing contact details for ${customer.companyName}:\nContact: ${customer.name} (${customer.email})\nAP Lead: ${customer.apContactName || 'Accounts Payable'}\nPhone: ${customer.phone || ''}\nOutstanding AR: ${formatCurrency(customer.totalOutstanding)}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Billing Contact Details: ${customer.companyName}`);
    const body = encodeURIComponent(formattedContactCard);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share Contact: ${customer.companyName}`}
      description="1-Click export and share verified billing & Accounts Payable contact details."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Contact Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">{customer.companyName}</h3>
              <p className="text-xs text-slate-500">Primary Contact: {customer.name}</p>
            </div>
            <span className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${riskBadge.className}`}>
              {riskBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{customer.phone || '+1 (555) 019-2831'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">AP: {customer.apContactName || 'Finance Team'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Outstanding: <strong>{formatCurrency(customer.totalOutstanding)}</strong></span>
            </div>
          </div>
        </div>

        {/* Text Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Formatted Card Preview</label>
            <span className="text-[10px] text-slate-400">Ready for Slack / Email / CRM</span>
          </div>
          <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 max-h-48">
            {formattedContactCard}
          </pre>
        </div>

        {/* Action Sharing Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <Button
            size="sm"
            variant="primary"
            onClick={handleCopyText}
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
          >
            {copied ? 'Copied' : 'Copy All'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadVCard}
            leftIcon={<Download className="w-3.5 h-3.5 text-slate-600" />}
            className="text-xs"
          >
            vCard (.vcf)
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleWhatsAppShare}
            leftIcon={<MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
            className="text-xs text-slate-700"
          >
            WhatsApp
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleEmailShare}
            leftIcon={<Mail className="w-3.5 h-3.5 text-blue-600" />}
            className="text-xs text-slate-700"
          >
            Email Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};
