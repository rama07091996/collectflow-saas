// TypeScript interfaces and DTOs for CollectFlow SaaS

export type UserRole = 'OWNER' | 'FINANCE_MANAGER' | 'COLLECTIONS_SPECIALIST' | 'VIEWER';

export type InvoiceStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'ESCALATED'
  | 'IN_DISPUTE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CommType = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PHONE_LOG' | 'ESCALATION_LETTER';

export type CommStatus = 'QUEUED' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';

export type IntegrationProvider = 'STRIPE' | 'QUICKBOOKS' | 'XERO' | 'FRESHBOOKS';

export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'SYNCING' | 'ERROR';

export type TriggerTiming = 'BEFORE_DUE' | 'ON_DUE' | 'AFTER_DUE' | 'ESCALATION';

export type WorkflowActionType =
  | 'SEND_REMINDER'
  | 'NUDGE_ALL_OVERDUE'
  | 'ESCALATE_DELINQUENT'
  | 'APPLY_LATE_FEE'
  | 'PAUSE_CADENCE'
  | 'RESUME_CADENCE'
  | 'SIMULATE_PAYMENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  paymentTermsDays: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  totalOutstanding: number;
  totalPaid: number;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CommunicationLog {
  id: string;
  invoiceId: string;
  customerId: string;
  type: CommType;
  subject: string;
  body: string;
  channel: string;
  status: CommStatus;
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  customerId: string;
  customer?: Customer;
  invoiceNumber: string;
  amount: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  paymentLinkUrl: string;
  pdfUrl?: string;
  notes?: string;
  disputeReason?: string;
  remindersSentCount: number;
  lastReminderAt?: string;
  items?: InvoiceItem[];
  communications?: CommunicationLog[];
  daysOverdue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  stepOrder: number;
  timing: TriggerTiming;
  offsetDays: number;
  channel: 'EMAIL' | 'SMS' | 'ESCALATION';
  templateSubject: string;
  templateBody: string;
  isAutomated: boolean;
  requireApproval: boolean;
}

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  steps: WorkflowStep[];
}

export interface Integration {
  id: string;
  organizationId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  accountName?: string;
  lastSyncAt?: string;
  syncFrequency: string;
  syncLog?: string;
}

// -------------------------------------------------------------
// REST API Request / Response DTOs
// -------------------------------------------------------------

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DashboardMetrics {
  totalInvoiced: number;
  totalOutstanding: number;
  totalOverdue: number;
  totalPaidThisMonth: number;
  totalInDispute: number;
  averageDaysToPay: number;
  collectionEfficiencyIndex: number;
  invoicesCount: {
    total: number;
    overdue: number;
    escalated: number;
    inDispute: number;
    partiallyPaid: number;
    sent: number;
    viewed: number;
    paid: number;
    draft: number;
  };
  overdueTrendPercent: number;
  paidTrendPercent: number;
  agingBuckets: {
    current: number;
    days1To15: number;
    days16To30: number;
    days31To60: number;
    days60Plus: number;
  };
  monthlyCashflow: {
    month: string;
    collected: number;
    invoiced: number;
    projected: number;
  }[];
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardMetrics;
}

export interface GetItemsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: 'dueDate' | 'amount' | 'amountDue' | 'invoiceNumber' | 'issueDate';
  sortOrder?: 'asc' | 'desc';
}

export interface GetItemsResponse {
  success: boolean;
  data: Invoice[];
  pagination: PaginationMeta;
  summary: {
    totalCount: number;
    filteredCount: number;
    totalAmountDue: number;
  };
}

export interface CreateItemRequest {
  customerId: string;
  invoiceNumber?: string;
  amount: number;
  issueDate?: string;
  dueDate: string;
  notes?: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
}

export interface CreateItemResponse {
  success: boolean;
  message: string;
  data: Invoice;
}

export interface ExecutionLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  targetInvoice: string;
  customer: string;
  channel: string;
  status: 'DISPATCHED' | 'QUEUED' | 'ESCALATED' | 'PAUSED' | 'SKIPPED';
  message: string;
}

export interface TriggerActionRequest {
  actionType: WorkflowActionType;
  invoiceId?: string;
  invoiceIds?: string[];
  customMessage?: string;
  channel?: 'EMAIL' | 'SMS' | 'ALL';
}

export interface TriggerActionResponse {
  success: boolean;
  message: string;
  data: {
    actionType: WorkflowActionType;
    triggeredAt: string;
    affectedCount: number;
    executionLogs: ExecutionLogEntry[];
    updatedInvoices: Invoice[];
  };
}
