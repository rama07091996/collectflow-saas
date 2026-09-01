import { runUtilsTests } from './unit/utils.test';
import { runMemoryStoreTests } from './unit/memory-store.test';
import { runAIAssistantTests } from './unit/ai-assistant.test';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures: { desc: string; details?: string }[] = [];

function assert(description: string, passed: boolean, details?: string) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${description}`);
  } else {
    failedTests++;
    failures.push({ desc: description, details });
    console.log(`  \x1b[31m✖ FAIL\x1b[0m ${description} ${details ? `(${details})` : ''}`);
  }
}

console.log('\n======================================================');
console.log('🧪 COLLECTFLOW B2B SAAS MASTER UNIT TEST SUITE');
console.log('======================================================\n');

console.log('\x1b[36m[SUITE 1] Utility & Currency Formatting Tests\x1b[0m');
runUtilsTests(assert);

console.log('\n\x1b[36m[SUITE 2] In-Memory Ledger, AR Aging & Action Triggers\x1b[0m');
runMemoryStoreTests(assert);

console.log('\n\x1b[36m[SUITE 3] AI AR Copilot & Autonomous Auto-Pilot Engine\x1b[0m');
runAIAssistantTests(assert);

console.log('\n======================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('======================================================\n');

if (failedTests > 0) {
  console.error('\x1b[31mFailed Tests:\x1b[0m');
  failures.forEach((f) => console.error(` - ${f.desc} ${f.details ? `-> ${f.details}` : ''}`));
  process.exit(1);
} else {
  console.log('\x1b[32m🎉 ALL UNIT TESTS PASSED WITH 100% SUCCESS!\x1b[0m\n');
}
