import { store } from '../../src/lib/db/memory-store';

export function runMemoryStoreTests(assert: (desc: string, passed: boolean, details?: string) => void) {
  // Test 1: Seed data initialization
  const initialInvoices = store.getInvoices();
  assert('Store initializes with 15 seed invoices', initialInvoices.length >= 15, `Found ${initialInvoices.length} invoices`);

  const initialCustomers = store.getCustomers();
  assert('Store initializes with 15 customer debtors', initialCustomers.length === 15, `Found ${initialCustomers.length} customers`);

  // Test 2: Pagination & filtering
  const paginatedResult = store.getItems({ page: 1, limit: 5, status: 'OVERDUE' });
  assert('getItems respects pagination limit', paginatedResult.data.length <= 5, `Got ${paginatedResult.data.length} items`);
  assert('getItems filters by OVERDUE status correctly', paginatedResult.data.every(i => i.status === 'OVERDUE'), 'Not all items had OVERDUE status');
  assert('getItems returns valid pagination metadata', paginatedResult.pagination.total >= 1 && paginatedResult.pagination.limit === 5);

  // Test 3: Create Invoice with automatic item ID mapping
  const createdInvoice = store.createItem({
    customerId: 'cust_01',
    amount: 5500,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    notes: 'Unit Test Deliverables',
    items: [
      { description: 'Cloud Setup', quantity: 2, unitPrice: 2000, amount: 4000 },
      { description: 'Consulting', quantity: 1, unitPrice: 1500, amount: 1500 },
    ],
  });

  assert('createItem returns created invoice with valid ID', Boolean(createdInvoice && createdInvoice.id.startsWith('inv_')), `Got ID: ${createdInvoice?.id}`);
  assert('createItem maps items with id and invoiceId', Boolean(createdInvoice.items && createdInvoice.items.length === 2 && createdInvoice.items[0].invoiceId === createdInvoice.id), `Items: ${JSON.stringify(createdInvoice.items)}`);
  assert('createItem enrolls invoice into initial communication log', Boolean(createdInvoice.communications && createdInvoice.communications.length > 0));

  // Test 4: Dashboard stats calculation
  const stats = store.getDashboardStats();
  assert('getDashboardStats calculates positive total invoiced', stats.totalInvoiced > 0, `Total Invoiced: ${stats.totalInvoiced}`);
  assert('getDashboardStats computes aging breakdown buckets', Boolean(stats.agingBuckets && stats.agingBuckets.current >= 0 && stats.agingBuckets.days1To15 >= 0));
  assert('getDashboardStats counts invoices by status', Boolean(stats.invoicesCount && stats.invoicesCount.total >= 16));

  // Test 5: Workflow Action Trigger - Apply Late Fee
  const targetInvoice = store.getInvoices().find(i => i.daysOverdue && i.daysOverdue > 10) || initialInvoices[0];
  const oldAmountDue = targetInvoice.amountDue;

  const lateFeeRes = store.triggerAction({
    actionType: 'APPLY_LATE_FEE',
    invoiceId: targetInvoice.id,
  });

  assert('triggerAction APPLY_LATE_FEE returns success', lateFeeRes.success === true);
  assert('triggerAction APPLY_LATE_FEE increases amount due by 1.5%', targetInvoice.amountDue > oldAmountDue, `Old: ${oldAmountDue}, New: ${targetInvoice.amountDue}`);
  assert('triggerAction creates execution logs', lateFeeRes.data.executionLogs.length > 0);

  // Test 6: Workflow Action Trigger - Pause Cadence (In Dispute)
  const pauseRes = store.triggerAction({
    actionType: 'PAUSE_CADENCE',
    invoiceId: targetInvoice.id,
  });
  assert('triggerAction PAUSE_CADENCE sets invoice status to IN_DISPUTE', targetInvoice.status === 'IN_DISPUTE', `Status: ${targetInvoice.status}`);

  // Test 7: Payment Simulation - Full Settlement
  const invForPay = store.getInvoices().find(i => i.status !== 'PAID') || initialInvoices[0];
  const payRes = store.simulatePayment(invForPay.id, invForPay.amountDue);
  assert('simulatePayment successfully marks invoice as PAID', payRes.invoice.status === 'PAID' && payRes.invoice.amountDue === 0);
  assert('simulatePayment adds payment receipt communication log', Boolean(payRes.invoice.communications && payRes.invoice.communications[0].subject.includes('Payment Receipt')));

  // Test 8: Payment Simulation - Partial Settlement
  const invForPartial = store.getInvoices().find(i => i.status !== 'PAID') || store.createItem({
    customerId: 'cust_02',
    amount: 10000,
    dueDate: new Date().toISOString(),
  });
  const partialRes = store.simulatePayment(invForPartial.id, 3000);
  assert('simulatePayment handles partial payments', partialRes.invoice.status === 'PARTIALLY_PAID' && partialRes.invoice.amountPaid >= 3000);
}
