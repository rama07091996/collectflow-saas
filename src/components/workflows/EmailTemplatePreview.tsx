'use client';

import React, { useState } from 'react';
import { WorkflowStep } from '@/lib/types';
import { interpolateTemplate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Tag,
  CreditCard,
  Send,
} from 'lucide-react';

interface EmailTemplatePreviewProps {
  step: WorkflowStep;
  onUpdateStep: (updated: WorkflowStep) => void;
  onSaveWorkflow: () => void;
  isSaving: boolean;
}

const TOKENS = [
  { label: 'Customer Name', tag: '{{customer_name}}' },
  { label: 'Invoice #', tag: '{{invoice_number}}' },
  { label: 'Amount', tag: '{{amount}}' },
  { label: 'Due Date', tag: '{{due_date}}' },
  { label: 'Payment Link', tag: '{{payment_link}}' },
  { label: 'Your Agency Name', tag: '{{company_name}}' },
];

export const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({
  step,
  onUpdateStep,
  onSaveWorkflow,
  isSaving,
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const previewSubject = interpolateTemplate(step.templateSubject, {
    customer_name: 'Jordan Chase',
    company_name: 'Apex Growth Media',
    invoice_number: 'INV-2024-0104',
    amount: '$14,200.00',
    due_date: 'Aug 20, 2024',
    payment_link: 'https://pay.collectflow.io/inv_02',
  });

  const previewBody = interpolateTemplate(step.templateBody, {
    customer_name: 'Jordan Chase',
    company_name: 'Apex Growth Media',
    invoice_number: 'INV-2024-0104',
    amount: '$14,200.00',
    due_date: 'Aug 20, 2024',
    payment_link: 'https://pay.collectflow.io/inv_02',
  });

  const insertToken = (tag: string) => {
    onUpdateStep({
      ...step,
      templateBody: step.templateBody + ` ${tag} `,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Template Editor */}
      <div className="lg:col-span-6 space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Step {step.stepOrder} Template Editor
              </h3>
              <p className="text-xs text-slate-500">
                Configure automated email copy and trigger timing.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Offset: {step.offsetDays} Days
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <Input
              label="Subject Line"
              value={step.templateSubject}
              onChange={(e) => onUpdateStep({ ...step, templateSubject: e.target.value })}
              className="text-xs font-medium"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Dynamic Merge Variables
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOKENS.map((token) => (
                  <button
                    key={token.tag}
                    type="button"
                    onClick={() => insertToken(token.tag)}
                    className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono transition-colors flex items-center gap-1 border border-slate-200"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{token.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Content Template
              </label>
              <textarea
                rows={9}
                value={step.templateBody}
                onChange={(e) => onUpdateStep({ ...step, templateBody: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_step"
                  checked={step.isAutomated}
                  onChange={(e) => onUpdateStep({ ...step, isAutomated: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="auto_step" className="text-xs font-medium text-slate-700">
                  Automatically dispatch when condition is met
                </label>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={onSaveWorkflow}
                isLoading={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
              >
                Save Cadence
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right: Live Interactive Render Preview */}
      <div className="lg:col-span-6 space-y-4">
        <Card className="p-5 bg-slate-900 text-slate-100 border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Live Rendered Client Preview</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded text-xs ${
                  viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded text-xs ${
                  viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            className={`mt-4 bg-white text-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-200 transition-all ${
              viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
          >
            {/* Mock Email Client Header */}
            <div className="bg-slate-100 p-3.5 border-b border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-500">
                <span>From: <strong>Apex Growth Media Billing &lt;billing@apexmedia.io&gt;</strong></span>
                <span>Just now</span>
              </div>
              <div className="text-slate-500">
                To: <strong>Jordan Chase &lt;finance@horizonmedia.co&gt;</strong>
              </div>
              <div className="text-slate-900 font-bold pt-1 text-sm border-t border-slate-200">
                {previewSubject}
              </div>
            </div>

            {/* Email Body */}
            <div className="p-5 text-xs text-slate-800 space-y-4">
              <p className="whitespace-pre-wrap leading-relaxed">{previewBody}</p>

              {/* Call to Action Button In Email */}
              <div className="pt-2 pb-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay $14,200.00 in 1-Click</span>
                </a>
                <p className="text-[10px] text-slate-400 mt-2">
                  Supports ACH, Corporate Card, Apple Pay, wire transfer.
                </p>
              </div>

              {/* Signature */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                Sent automatically by CollectFlow AR Engine on behalf of Apex Growth Media.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
