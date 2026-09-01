import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Invoice, InvoiceStatus, RiskLevel } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDays(dateString: string): { text: string; isPast: boolean; days: number } {
  const target = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'Due today', isPast: false, days: 0 };
  } else if (diffDays > 0) {
    return { text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, isPast: false, days: diffDays };
  } else {
    const overdueDays = Math.abs(diffDays);
    return { text: `${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`, isPast: true, days: overdueDays };
  }
}

export function calculateDaysOverdue(dueDateString: string, status: InvoiceStatus): number {
  if (status === 'PAID') return 0;
  const due = new Date(dueDateString).getTime();
  const now = new Date().getTime();
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function interpolateTemplate(
  template: string,
  variables: {
    customer_name?: string;
    company_name?: string;
    invoice_number?: string;
    amount?: string;
    due_date?: string;
    days_overdue?: number | string;
    payment_link?: string;
  }
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, String(value ?? ''));
  }
  return result;
}

export function getStatusBadgeVariant(status: InvoiceStatus): {
  label: string;
  className: string;
  dotColor: string;
} {
  switch (status) {
    case 'PAID':
      return { label: 'Paid', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-500' };
    case 'OVERDUE':
      return { label: 'Overdue', className: 'bg-rose-50 text-rose-700 border-rose-200', dotColor: 'bg-rose-500' };
    case 'ESCALATED':
      return { label: 'Escalated', className: 'bg-amber-50 text-amber-800 border-amber-300', dotColor: 'bg-amber-500' };
    case 'SENT':
      return { label: 'Pending', className: 'bg-blue-50 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' };
    case 'VIEWED':
      return { label: 'Viewed', className: 'bg-indigo-50 text-indigo-700 border-indigo-200', dotColor: 'bg-indigo-500' };
    case 'PARTIALLY_PAID':
      return { label: 'Partial', className: 'bg-teal-50 text-teal-700 border-teal-200', dotColor: 'bg-teal-500' };
    case 'IN_DISPUTE':
      return { label: 'In Dispute', className: 'bg-purple-50 text-purple-700 border-purple-200', dotColor: 'bg-purple-500' };
    case 'DRAFT':
    default:
      return { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200', dotColor: 'bg-slate-400' };
  }
}

export function getRiskBadge(riskLevel: RiskLevel, riskScore: number): {
  label: string;
  className: string;
} {
  if (riskLevel === 'LOW') {
    return { label: `Low Risk (${riskScore})`, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (riskLevel === 'MEDIUM') {
    return { label: `Medium (${riskScore})`, className: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  if (riskLevel === 'HIGH') {
    return { label: `High Risk (${riskScore})`, className: 'bg-orange-50 text-orange-800 border-orange-200' };
  }
  return { label: `Critical (${riskScore})`, className: 'bg-rose-50 text-rose-800 border-rose-200' };
}
