import React from 'react';
import {
  GitBranch,
  CreditCard,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Tone-Calibrated AR Cadences',
    desc: 'Automate gentle courtesy reminders before due dates, firm nudges on due date, and structured escalations when invoices become delinquent.',
    tag: 'Automated Follow-Ups',
  },
  {
    icon: CreditCard,
    title: '1-Click Frictionless Payment Portal',
    desc: 'Each email embeds an instant, branded payment link supporting ACH transfers, corporate credit cards, Apple Pay, and automated receipt delivery.',
    tag: 'Higher Conversion',
  },
  {
    icon: ShieldCheck,
    title: 'Debtor Risk & Payment Scoring',
    desc: 'Identify chronic late-paying clients before renewing scopes or expanding credit limits with proprietary AI risk scores.',
    tag: 'Predictive Insights',
  },
  {
    icon: Layers,
    title: 'Native Stripe & QuickBooks Sync',
    desc: 'Real-time bi-directional synchronization. Invoices paid anywhere automatically stop active email sequences immediately.',
    tag: 'Zero Double-Nudges',
  },
  {
    icon: BarChart3,
    title: 'Executive AR Aging & Cashflow Forecast',
    desc: 'Get crystal-clear visibility into overdue aging buckets (0-15d, 16-30d, 31-60d, 60+d) and 30-day cash collection projections.',
    tag: 'Finance Analytics',
  },
  {
    icon: Zap,
    title: 'Batch Action & Smart Queue',
    desc: 'Review high-value balances in seconds, approve customized executive letters, or dispatch batch follow-ups with one click.',
    tag: 'Time Saver',
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span>Built for High-Growth Agencies & B2B Service Teams</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            Everything You Need to Collect Unpaid Invoices on Autopilot
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Stop wasting hours chasing receivables manually. CollectFlow handles the entire collections lifecycle with grace and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="p-6 hover:shadow-md transition-all border-slate-200/80 bg-white">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  {feat.tag}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
