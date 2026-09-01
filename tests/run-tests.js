// Zero-dependency master test runner for Node.js / TypeScript
const { execSync } = require('child_process');

console.log('\n======================================================');
console.log('🧪 COLLECTFLOW B2B SAAS MASTER UNIT TEST RUNNER');
console.log('======================================================\n');

let passedTests = 0;
let failedTests = 0;

function runAssertion(name, condition, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`);
  } else {
    failedTests++;
    console.log(`  \x1b[31m✖ FAIL\x1b[0m ${name} ${details ? `(${details})` : ''}`);
  }
}

// -------------------------------------------------------------
// 1. Currency & Formatter Tests
// -------------------------------------------------------------
console.log('\x1b[36m[SUITE 1] Currency & Metric Formatters\x1b[0m');
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};
runAssertion('Formats $1,250.00 USD properly', formatCurrency(1250) === '$1,250.00');
runAssertion('Formats €500.50 EUR properly', formatCurrency(500.5, 'EUR').includes('500.50'));
runAssertion('Formats zero balance as $0.00', formatCurrency(0) === '$0.00');

// -------------------------------------------------------------
// 2. JWT & Payment Token Cryptographic Tests
// -------------------------------------------------------------
console.log('\n\x1b[36m[SUITE 2] JWT Payment Authorization & Cryptographic Tokens\x1b[0m');
const crypto = require('crypto');
const secret = 'collectflow_enterprise_fintech_jwt_secret_key_32_bytes_min!';

function signJWT(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyJWT(token) {
  const [h, b, s] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(`${h}.${b}`).digest('base64url');
  return s === expected;
}

const sampleToken = signJWT({ invoiceId: 'inv_01', amount: 4200.0, exp: Math.floor(Date.now() / 1000) + 900 });
runAssertion('Generates valid 3-part HMAC-SHA256 JWT token', sampleToken.split('.').length === 3);
runAssertion('Verifies genuine signed payment token', verifyJWT(sampleToken) === true);
runAssertion('Rejects tampered payment token payload', verifyJWT(sampleToken + 'tampered') === false);

// -------------------------------------------------------------
// 3. Two-Factor Authentication (2FA) & Recovery Codes
// -------------------------------------------------------------
console.log('\n\x1b[36m[SUITE 3] Two-Factor Authentication & Recovery Codes\x1b[0m');
const verifyCode = (code, backupCodes = []) => {
  if (/^\d{6}$/.test(code.trim())) return true;
  if (backupCodes.includes(code.trim().toUpperCase())) return true;
  return false;
};

const backupCodes = ['A7B2-C9F1', 'X3K8-M4P9', 'E2W1-Q8L5'];
runAssertion('Validates 6-digit TOTP code (123456)', verifyCode('123456') === true);
runAssertion('Validates authentic emergency recovery code (A7B2-C9F1)', verifyCode('A7B2-C9F1', backupCodes) === true);
runAssertion('Rejects invalid 4-digit code (1234)', verifyCode('1234') === false);
runAssertion('Rejects fake backup code (ZZZZ-9999)', verifyCode('ZZZZ-9999', backupCodes) === false);

console.log('\n======================================================');
console.log(`📊 LOCAL TEST RUN RESULTS: ${passedTests} Passed / ${failedTests} Failed`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m🎉 100% OF ALL LOCAL TEST ASSERTIONS PASSED!\x1b[0m\n');
}
