import { AIAssistantService } from '../../src/lib/ai-assistant';

export function runAIAssistantTests(assert: (desc: string, passed: boolean, details?: string) => void) {
  // Test 1: Query for top overdue accounts
  const overdueQueryRes = AIAssistantService.processQuery('Who owes us the most money right now?');
  assert('AI processQuery returns assistant role', overdueQueryRes.role === 'assistant');
  assert('AI processQuery identifies overdue balances', overdueQueryRes.content.includes('outstanding accounts') || overdueQueryRes.content.includes('Overdue Balance'));
  assert('AI processQuery provides suggested action buttons', Boolean(overdueQueryRes.suggestedActions && overdueQueryRes.suggestedActions.length > 0));

  // Test 2: Query for drafting email reminder
  const draftQueryRes = AIAssistantService.processQuery('Draft an urgent reminder email for our client');
  assert('AI processQuery drafts email template with subject and body', draftQueryRes.content.includes('Subject') && draftQueryRes.content.includes('payment link'));
  assert('AI processQuery includes Send Email action', Boolean(draftQueryRes.suggestedActions?.some(a => a.actionType === 'SEND_REMINDER')));

  // Test 3: Query for cashflow & forecasting
  const forecastQueryRes = AIAssistantService.processQuery('What is our projected cashflow and DSO this month?');
  assert('AI processQuery answers cashflow and CEI metrics', forecastQueryRes.content.includes('Cashflow') || forecastQueryRes.content.includes('Collected'));

  // Test 4: Autonomous Auto-Pilot Engine Execution
  const autoPilotResult = AIAssistantService.runAutoPilotEngine();
  assert('runAutoPilotEngine scans and returns processedCount', autoPilotResult.processedCount >= 1, `Processed: ${autoPilotResult.processedCount}`);
  assert('runAutoPilotEngine generates tone-calibrated email list', autoPilotResult.dispatchedEmails.length === autoPilotResult.processedCount);
  assert('runAutoPilotEngine embeds payment links in every email', autoPilotResult.dispatchedEmails.every(e => e.paymentLink && e.paymentLink.includes('https://pay.collectflow.io/')));
  assert('runAutoPilotEngine calculates total recoverable amount', autoPilotResult.totalRecoverableAmount > 0, `Amount: ${autoPilotResult.totalRecoverableAmount}`);
}
