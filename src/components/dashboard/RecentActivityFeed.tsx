import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  CheckCircle2,
  Mail,
  Eye,
  AlertTriangle,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'PAYMENT' | 'REMINDER_SENT' | 'EMAIL_OPENED' | 'ESCALATION' | 'SYNC';
  title: string;
  description: string;
  time: string;
  amount?: number;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'PAYMENT',
    title: 'Payment Received ($24,500.00)',
    description: 'Nova Labs BioTech paid INV-2024-0098 via Stripe ACH.',
    time: '2 hours ago',
    amount: 24500,
  },
  {
    id: 'act_2',
    type: 'EMAIL_OPENED',
    title: 'Reminder Opened',
    description: 'Jordan Chase (Horizon Media) viewed reminder email for INV-2024-0104.',
    time: '4 hours ago',
  },
  {
    id: 'act_3',
    type: 'REMINDER_SENT',
    title: 'Automated 7-Day Follow-Up Dispatched',
    description: 'Summit Retail Partners received automated gentle notice.',
    time: '6 hours ago',
  },
  {
    id: 'act_4',
    type: 'ESCALATION',
    title: 'Delinquency Warning Escalated',
    description: 'Executive notification queued for Apex Logistics LLC (INV-2024-0089).',
    time: 'Yesterday',
  },
  {
    id: 'act_5',
    type: 'SYNC',
    title: 'QuickBooks Online Sync Complete',
    description: 'Matched 14 invoice statuses and ledger records.',
    time: 'Yesterday',
  },
];

export const RecentActivityFeed: React.FC = () => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'PAYMENT':
        return <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>;
      case 'EMAIL_OPENED':
        return <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Eye className="w-4 h-4" /></div>;
      case 'REMINDER_SENT':
        return <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Mail className="w-4 h-4" /></div>;
      case 'ESCALATION':
        return <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><AlertTriangle className="w-4 h-4" /></div>;
      case 'SYNC':
      default:
        return <div className="p-2 rounded-lg bg-slate-100 text-slate-600"><RefreshCw className="w-4 h-4" /></div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live AR & Automation Audit Feed</CardTitle>
        <span className="text-xs text-slate-500 font-medium">Real-time event stream</span>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 p-0">
        {ACTIVITIES.map((activity) => (
          <div key={activity.id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/70 transition-colors">
            {getIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {activity.title}
                </span>
                <span className="text-[11px] text-slate-400 shrink-0">{activity.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{activity.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
