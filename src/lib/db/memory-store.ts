import {
  Customer,
  Invoice,
  Workflow,
  Integration,
  InvoiceStatus,
  GetItemsQueryParams,
  GetItemsResponse,
  CreateItemRequest,
  TriggerActionRequest,
  TriggerActionResponse,
  ExecutionLogEntry,
  DashboardStatsResponse,
} from '../types';
import {
  SEED_CUSTOMERS,
  SEED_INVOICES,
  SEED_INTEGRATIONS,
  SEED_WORKFLOW,
} from './seed-data';
import { calculateDaysOverdue, formatCurrency, formatDate } from '../utils';

class CollectFlowStore {
  private customers: Customer[] = [];
  private invoices: Invoice[] = [];
  private workflow: Workflow = { ...SEED_WORKFLOW };
  private integrations: Integration[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.customers = JSON.parse(JSON.stringify(SEED_CUSTOMERS));
    this.invoices = JSON.parse(JSON.stringify(SEED_INVOICES));
    this.workflow = JSON.parse(JSON.stringify(SEED_WORKFLOW));
    this.integrations = JSON.parse(JSON.stringify(SEED_INTEGRATIONS));
    this.recalculateOverdue();
  }

  private recalculateOverdue() {
    this.invoices.forEach((inv) => {
      inv.daysOverdue = calculateDaysOverdue(inv.dueDate, inv.status);
    });
  }

  // -------------------------------------------------------------
  // Customers
  // -------------------------------------------------------------
  public getCustomers(): Customer[] {
    return this.customers;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  // -------------------------------------------------------------
  // Items / Invoices (with Pagination, Filter, Search, Sorting)
  // -------------------------------------------------------------
  public getItems(params: GetItemsQueryParams): GetItemsResponse {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const status = params.status || 'ALL';
    const search = (params.search || '').trim().toLowerCase();
    const sortBy = params.sortBy || 'dueDate';
    const sortOrder = params.sortOrder || 'desc';

    let filtered = [...this.invoices];

    // Status filtering
    if (status !== 'ALL') {
      if (status === 'OVERDUE') {
        filtered = filtered.filter((i) => i.status === 'OVERDUE' || i.status === 'ESCALATED');
      } else if (status === 'PENDING') {
        filtered = filtered.filter((i) => i.status === 'SENT' || i.status === 'VIEWED' || i.status === 'PARTIALLY_PAID');
      } else if (status === 'PAID') {
        filtered = filtered.filter((i) => i.status === 'PAID');
      } else if (status === 'PARTIALLY_PAID') {
        filtered = filtered.filter((i) => i.status === 'PARTIALLY_PAID');
      } else if (status === 'IN_DISPUTE') {
        filtered = filtered.filter((i) => i.status === 'IN_DISPUTE');
      } else if (status === 'ESCALATED') {
        filtered = filtered.filter((i) => i.status === 'ESCALATED');
      } else if (status === 'DRAFT') {
        filtered = filtered.filter((i) => i.status === 'DRAFT');
      } else {
        filtered = filtered.filter((i) => i.status === status);
      }
    }

    // Search query
    if (search) {
      filtered = filtered.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(search) ||
          i.customer?.name.toLowerCase().includes(search) ||
          i.customer?.companyName.toLowerCase().includes(search) ||
          i.customer?.email.toLowerCase().includes(search) ||
          (i.notes && i.notes.toLowerCase().includes(search))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'amountDue') {
        comparison = a.amountDue - b.amountDue;
      } else if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'issueDate') {
        comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
      } else {
        comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    const totalAmountDue = filtered.reduce((acc, item) => acc + item.amountDue, 0);

    return {
      success: true,
      data: paginatedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      summary: {
        totalCount: this.invoices.length,
        filteredCount: total,
        totalAmountDue,
      },
    };
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.find((i) => i.id === id);
  }

  public createItem(data: CreateItemRequest): Invoice {
    const customer = this.getCustomerById(data.customerId) || this.customers[0];
    const amount = Number(data.amount);
    const id = `inv_${Date.now()}`;
    const invoiceNumber = data.invoiceNumber || `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: Invoice = {
      id,
      organizationId: 'org_apex',
      customerId: customer.id,
      customer,
      invoiceNumber,
      amount,
      amountPaid: 0,
      amountDue: amount,
      currency: 'USD',
      issueDate: data.issueDate || new Date().toISOString(),
      dueDate: data.dueDate,
      status: 'SENT',
      paymentLinkUrl: `https://pay.collectflow.io/${id}`,
      notes: data.notes || 'Consulting & professional deliverables',
      remindersSentCount: 0,
      daysOverdue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: data.items
        ? data.items.map((item: any, idx: number) => ({
            id: item.id || `item_${id}_${idx + 1}`,
            invoiceId: id,
            description: item.description || 'Invoice Item',
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || amount,
            amount: Number(item.amount) || ((Number(item.quantity) || 1) * (Number(item.unitPrice) || amount)),
          }))
        : [
            {
              id: `item_${Date.now()}`,
              invoiceId: id,
              description: data.notes || 'Professional Marketing & Tech Services',
              quantity: 1,
              unitPrice: amount,
              amount: amount,
            },
          ],
      communications: [
        {
          id: `comm_${Date.now()}`,
          invoiceId: id,
          customerId: customer.id,
          type: 'EMAIL',
          subject: `New Invoice ${invoiceNumber} ($${amount.toLocaleString()}) Ready`,
          body: `Invoice ${invoiceNumber} issued to ${customer.name} (${customer.email}) for $${amount.toLocaleString()}. Enrolled in automated Net-${customer.paymentTermsDays} cadence.`,
          channel: 'email',
          status: 'DELIVERED',
          sentAt: new Date().toISOString(),
        },
      ],
    };

    customer.totalOutstanding += amount;
    this.invoices.unshift(newInvoice);
    return newInvoice;
  }

  // -------------------------------------------------------------
  // Workflow Trigger Action Engine
  // -------------------------------------------------------------
  public triggerAction(req: TriggerActionRequest): TriggerActionResponse {
    const timestamp = new Date().toISOString();
    const logs: ExecutionLogEntry[] = [];
    const updatedInvoices: Invoice[] = [];

    const targetInvoices: Invoice[] = [];
    if (req.actionType === 'NUDGE_ALL_OVERDUE') {
      const overdue = this.invoices.filter((i) => i.status === 'OVERDUE' || i.status === 'ESCALATED');
      targetInvoices.push(...overdue);
    } else if (req.invoiceIds && req.invoiceIds.length > 0) {
      const found = this.invoices.filter((i) => req.invoiceIds!.includes(i.id));
      targetInvoices.push(...found);
    } else if (req.invoiceId) {
      const single = this.getInvoiceById(req.invoiceId);
      if (single) targetInvoices.push(single);
    }

    if (targetInvoices.length === 0) {
      throw new Error('No eligible target invoice(s) found for the requested action.');
    }

    for (const invoice of targetInvoices) {
      const customer = invoice.customer || this.getCustomerById(invoice.customerId);
      const days = invoice.daysOverdue || 0;
      const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      if (req.actionType === 'SEND_REMINDER' || req.actionType === 'NUDGE_ALL_OVERDUE') {
        const subject = req.customMessage
          ? `Follow-Up: Payment for ${invoice.invoiceNumber}`
          : days > 14
          ? `URGENT: Outstanding Balance - Invoice ${invoice.invoiceNumber} (${days} days overdue)`
          : `Friendly Reminder: Payment due for ${invoice.invoiceNumber} (${formatCurrency(invoice.amountDue)})`;

        const body = req.customMessage || `Dear ${customer?.name || 'Customer'},\n\nThis is a follow-up reminder for invoice ${invoice.invoiceNumber} ($${invoice.amountDue.toLocaleString()}).\n\nPay securely in one click: ${invoice.paymentLinkUrl}\n\nWarm regards,\nAccounts Receivable Team`;

        invoice.communications = invoice.communications || [];
        invoice.communications.unshift({
          id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          type: days > 25 ? 'ESCALATION_LETTER' : 'EMAIL',
          subject,
          body,
          channel: req.channel === 'SMS' ? 'sms' : 'email',
          status: 'DELIVERED',
          sentAt: timestamp,
        });

        invoice.remindersSentCount += 1;
        invoice.lastReminderAt = timestamp;
        updatedInvoices.push(invoice);

        logs.push({
          id: logId,
          timestamp: new Date().toISOString(),
          level: 'INFO',
          targetInvoice: invoice.invoiceNumber,
          customer: customer?.companyName || 'Unknown Debtor',
          channel: req.channel === 'SMS' ? 'SMS Gateway' : 'Automated Email Engine',
          status: 'DISPATCHED',
          message: `Dispatched tone-calibrated reminder (${days}d overdue, balance $${invoice.amountDue.toLocaleString()}) to ${customer?.email || 'debtor'}.`,
        });
      } else if (req.actionType === 'ESCALATE_DELINQUENT') {
        invoice.status = 'ESCALATED';
        invoice.communications = invoice.communications || [];
        invoice.communications.unshift({
          id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          type: 'ESCALATION_LETTER',
          subject: `FINAL DEMAND: Account Delinquency Warning - ${invoice.invoiceNumber}`,
          body: `Formal notice of delinquency for invoice ${invoice.invoiceNumber}. Account has been referred to executive legal review.`,
          channel: 'email',
          status: 'DELIVERED',
          sentAt: timestamp,
        });
        updatedInvoices.push(invoice);

        logs.push({
          id: logId,
          timestamp: new Date().toISOString(),
          level: 'WARN',
          targetInvoice: invoice.invoiceNumber,
          customer: customer?.companyName || 'Unknown Debtor',
          channel: 'Executive Escalation Pipeline',
          status: 'ESCALATED',
          message: `Account status updated to ESCALATED. Dispatched formal legal notice to ${customer?.email}.`,
        });
      } else if (req.actionType === 'APPLY_LATE_FEE') {
        const lateFee = Math.round(invoice.amountDue * 0.015);
        invoice.amountDue += lateFee;
        invoice.amount += lateFee;
        invoice.items = invoice.items || [];
        invoice.items.push({
          id: `item_fee_${Date.now()}`,
          invoiceId: invoice.id,
          description: '1.5% Late Assessment Fee for Overdue Settlement',
          quantity: 1,
          unitPrice: lateFee,
          amount: lateFee,
        });
        updatedInvoices.push(invoice);

        logs.push({
          id: logId,
          timestamp: new Date().toISOString(),
          level: 'INFO',
          targetInvoice: invoice.invoiceNumber,
          customer: customer?.companyName || 'Unknown Debtor',
          channel: 'Billing Subledger',
          status: 'DISPATCHED',
          message: `Applied 1.5% late fee of $${lateFee.toLocaleString()} to balance. New balance: $${invoice.amountDue.toLocaleString()}.`,
        });
      } else if (req.actionType === 'PAUSE_CADENCE') {
        invoice.status = 'IN_DISPUTE';
        updatedInvoices.push(invoice);

        logs.push({
          id: logId,
          timestamp: new Date().toISOString(),
          level: 'INFO',
          targetInvoice: invoice.invoiceNumber,
          customer: customer?.companyName || 'Unknown Debtor',
          channel: 'Cadence Controller',
          status: 'PAUSED',
          message: `Automated email sequence paused for ${invoice.invoiceNumber} pending dispute resolution.`,
        });
      }
    }

    return {
      success: true,
      message: `Workflow action '${req.actionType}' executed successfully on ${targetInvoices.length} invoice(s).`,
      data: {
        actionType: req.actionType,
        triggeredAt: timestamp,
        affectedCount: targetInvoices.length,
        executionLogs: logs,
        updatedInvoices,
      },
    };
  }

  // -------------------------------------------------------------
  // Dashboard Aggregated Stats
  // -------------------------------------------------------------
  public getDashboardStats(): DashboardStatsResponse['data'] {
    let totalInvoiced = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;
    let totalPaidThisMonth = 0;
    let totalInDispute = 0;

    const invoicesCount = {
      total: this.invoices.length,
      overdue: 0,
      escalated: 0,
      inDispute: 0,
      partiallyPaid: 0,
      sent: 0,
      viewed: 0,
      paid: 0,
      draft: 0,
    };

    const agingBuckets = {
      current: 0,
      days1To15: 0,
      days16To30: 0,
      days31To60: 0,
      days60Plus: 0,
    };

    this.invoices.forEach((inv) => {
      totalInvoiced += inv.amount;
      totalOutstanding += inv.amountDue;

      if (inv.status === 'PAID') {
        totalPaidThisMonth += inv.amountPaid;
        invoicesCount.paid += 1;
      } else if (inv.status === 'OVERDUE') {
        totalOverdue += inv.amountDue;
        invoicesCount.overdue += 1;
      } else if (inv.status === 'ESCALATED') {
        totalOverdue += inv.amountDue;
        invoicesCount.escalated += 1;
      } else if (inv.status === 'IN_DISPUTE') {
        totalInDispute += inv.amountDue;
        invoicesCount.inDispute += 1;
      } else if (inv.status === 'PARTIALLY_PAID') {
        invoicesCount.partiallyPaid += 1;
        if (inv.daysOverdue && inv.daysOverdue > 0) {
          totalOverdue += inv.amountDue;
        }
      } else if (inv.status === 'VIEWED') {
        invoicesCount.viewed += 1;
      } else if (inv.status === 'DRAFT') {
        invoicesCount.draft += 1;
      } else {
        invoicesCount.sent += 1;
      }

      // Calculate aging distribution
      if (inv.status !== 'PAID' && inv.status !== 'DRAFT') {
        const days = inv.daysOverdue || 0;
        if (days === 0) {
          agingBuckets.current += inv.amountDue;
        } else if (days <= 15) {
          agingBuckets.days1To15 += inv.amountDue;
        } else if (days <= 30) {
          agingBuckets.days16To30 += inv.amountDue;
        } else if (days <= 60) {
          agingBuckets.days31To60 += inv.amountDue;
        } else {
          agingBuckets.days60Plus += inv.amountDue;
        }
      }
    });

    return {
      totalInvoiced,
      totalOutstanding,
      totalOverdue,
      totalPaidThisMonth,
      totalInDispute,
      averageDaysToPay: 21.4,
      collectionEfficiencyIndex: 88.4,
      invoicesCount,
      overdueTrendPercent: -14.8,
      paidTrendPercent: +22.4,
      agingBuckets,
      monthlyCashflow: [
        { month: 'Apr', collected: 52000, invoiced: 64000, projected: 58000 },
        { month: 'May', collected: 68000, invoiced: 72000, projected: 70000 },
        { month: 'Jun', collected: 79000, invoiced: 85000, projected: 82000 },
        { month: 'Jul', collected: 88000, invoiced: 98000, projected: 92000 },
        { month: 'Aug', collected: 96200, invoiced: 107500, projected: 104000 },
        { month: 'Sep (Forecast)', collected: 24500, invoiced: 125000, projected: 118000 },
      ],
    };
  }

  // -------------------------------------------------------------
  // Legacy Helper Methods & Workflows
  // -------------------------------------------------------------
  public getInvoices(filter?: { status?: string; search?: string }): Invoice[] {
    const res = this.getItems({
      status: filter?.status,
      search: filter?.search,
      limit: 100,
    });
    return res.data;
  }

  public createInvoice(data: any): Invoice {
    return this.createItem({
      customerId: data.customerId,
      invoiceNumber: data.invoiceNumber,
      amount: data.amount,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      notes: data.notes,
      items: data.items,
    });
  }

  public sendReminder(invoiceId: string, customNote?: string): { success: boolean; invoice: Invoice } {
    const res = this.triggerAction({
      actionType: 'SEND_REMINDER',
      invoiceId,
      customMessage: customNote,
    });
    return { success: true, invoice: res.data.updatedInvoices[0] };
  }

  public simulatePayment(invoiceId: string, paidAmount?: number): { success: boolean; invoice: Invoice } {
    const invoice = this.getInvoiceById(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const payment = paidAmount !== undefined ? paidAmount : invoice.amountDue;
    invoice.amountPaid += payment;
    invoice.amountDue = Math.max(0, invoice.amount - invoice.amountPaid);

    if (invoice.amountDue === 0) {
      invoice.status = 'PAID';
      invoice.paidDate = new Date().toISOString();
      invoice.daysOverdue = 0;
    } else {
      invoice.status = 'PARTIALLY_PAID';
    }

    const customer = invoice.customer || this.getCustomerById(invoice.customerId);
    if (customer) {
      customer.totalOutstanding = Math.max(0, customer.totalOutstanding - payment);
      customer.totalPaid += payment;
    }

    invoice.communications = invoice.communications || [];
    invoice.communications.unshift({
      id: `comm_${Date.now()}`,
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      type: 'EMAIL',
      subject: `Payment Receipt: $${payment.toLocaleString()} received for ${invoice.invoiceNumber}`,
      body: `Payment processed successfully via payment link. Outstanding balance: $${invoice.amountDue.toLocaleString()}.`,
      channel: 'email',
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
    });

    return { success: true, invoice };
  }

  public getWorkflow(): Workflow {
    return this.workflow;
  }

  public updateWorkflow(updated: Workflow): Workflow {
    this.workflow = updated;
    return this.workflow;
  }

  public getIntegrations(): Integration[] {
    return this.integrations;
  }

  public toggleIntegration(provider: string, connect: boolean): Integration {
    const intIndex = this.integrations.findIndex((i) => i.provider === provider);
    if (intIndex >= 0) {
      this.integrations[intIndex].status = connect ? 'CONNECTED' : 'DISCONNECTED';
      this.integrations[intIndex].lastSyncAt = connect ? new Date().toISOString() : undefined;
      this.integrations[intIndex].syncLog = connect
        ? `Connected to ${provider} API. Initial sync complete.`
        : 'Integration disabled by user.';
      return this.integrations[intIndex];
    }
    throw new Error('Integration provider not found');
  }

  public syncIntegration(provider: string): { success: boolean; log: string } {
    const integration = this.integrations.find((i) => i.provider === provider);
    if (!integration) throw new Error('Integration not found');

    integration.status = 'CONNECTED';
    integration.lastSyncAt = new Date().toISOString();
    const syncedCount = Math.floor(Math.random() * 8) + 12;
    integration.syncLog = `Synced ${syncedCount} invoices & payments successfully at ${new Date().toLocaleTimeString()}.`;

    return { success: true, log: integration.syncLog };
  }

  public getDashboardMetrics() {
    return this.getDashboardStats();
  }
}

declare global {
  var __collectFlowStore: CollectFlowStore | undefined;
}

export const store = globalThis.__collectFlowStore || new CollectFlowStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__collectFlowStore = store;
}
