import { formatCurrency, getRiskBadge, getStatusBadge, calculateAgingBucket } from '../../src/lib/utils';

export function runUtilsTests(assert: (desc: string, passed: boolean, details?: string) => void) {
  // Test 1: formatCurrency
  const formatted1 = formatCurrency(4500);
  assert('formatCurrency formats integer dollars correctly', formatted1 === '$4,500', `Got ${formatted1}`);

  const formatted2 = formatCurrency(0);
  assert('formatCurrency handles zero value', formatted2 === '$0', `Got ${formatted2}`);

  const formatted3 = formatCurrency(12450.5);
  assert('formatCurrency rounds/formats decimal numbers', formatted3 === '$12,451', `Got ${formatted3}`);

  // Test 2: getRiskBadge
  const lowRisk = getRiskBadge('LOW', 10);
  assert('getRiskBadge returns LOW badge styling', lowRisk.label === 'Low Risk (10/100)' && lowRisk.className.includes('emerald'), `Got ${JSON.stringify(lowRisk)}`);

  const criticalRisk = getRiskBadge('CRITICAL', 95);
  assert('getRiskBadge returns CRITICAL badge styling', criticalRisk.label === 'Critical Risk (95/100)' && criticalRisk.className.includes('rose'), `Got ${JSON.stringify(criticalRisk)}`);

  // Test 3: getStatusBadge
  const overdueStatus = getStatusBadge('OVERDUE');
  assert('getStatusBadge returns Overdue label', overdueStatus.label === 'Overdue', `Got ${JSON.stringify(overdueStatus)}`);

  const paidStatus = getStatusBadge('PAID');
  assert('getStatusBadge returns Paid label', paidStatus.label === 'Paid in Full', `Got ${JSON.stringify(paidStatus)}`);

  // Test 4: calculateAgingBucket
  const currentBucket = calculateAgingBucket(0);
  assert('calculateAgingBucket handles 0 days overdue as current', currentBucket === 'current', `Got ${currentBucket}`);

  const days12Bucket = calculateAgingBucket(12);
  assert('calculateAgingBucket categorizes 12 days as days1To15', days12Bucket === 'days1To15', `Got ${days12Bucket}`);

  const days45Bucket = calculateAgingBucket(45);
  assert('calculateAgingBucket categorizes 45 days as days31To60', days45Bucket === 'days31To60', `Got ${days45Bucket}`);

  const days70Bucket = calculateAgingBucket(70);
  assert('calculateAgingBucket categorizes 70 days as days60Plus', days70Bucket === 'days60Plus', `Got ${days70Bucket}`);
}
