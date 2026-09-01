const fs = require('fs');
const path = require('path');

// Root paths
const ROOT_DIR = path.resolve(__dirname, '..');
const API_DIR = path.join(ROOT_DIR, 'src', 'app', 'api');
const OUTPUT_DIR = path.join(ROOT_DIR, 'api-tests');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('\n======================================================');
console.log('⚡ COLLECTFLOW AUTOMATED ENDPOINT TEST GENERATOR');
console.log('======================================================\n');

// Discovered endpoints registry
const discoveredEndpoints = [];

/**
 * Recursively scans directory for route.ts / route.js files
 */
function scanApiRoutes(dir, currentRoute = '/api') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanApiRoutes(fullPath, `${currentRoute}/${entry.name}`);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const methods = [];

      if (/export\s+(async\s+)?function\s+GET/i.test(fileContent)) methods.push('GET');
      if (/export\s+(async\s+)?function\s+POST/i.test(fileContent)) methods.push('POST');
      if (/export\s+(async\s+)?function\s+PUT/i.test(fileContent)) methods.push('PUT');
      if (/export\s+(async\s+)?function\s+DELETE/i.test(fileContent)) methods.push('DELETE');
      if (/export\s+(async\s+)?function\s+PATCH/i.test(fileContent)) methods.push('PATCH');

      discoveredEndpoints.push({
        routePath: currentRoute,
        filePath: fullPath,
        methods,
      });
    }
  }
}

// 1. Scan Next.js API Routes
if (fs.existsSync(API_DIR)) {
  scanApiRoutes(API_DIR);
}

// 2. Add Java Tomcat Endpoints
discoveredEndpoints.push({
  routePath: '/api/v1/payments/create-checkout-session',
  filePath: 'backend-java/src/main/java/com/collectflow/controller/PaymentController.java',
  methods: ['POST'],
  isJava: true,
});
discoveredEndpoints.push({
  routePath: '/api/v1/payments/webhook',
  filePath: 'backend-java/src/main/java/com/collectflow/controller/PaymentController.java',
  methods: ['POST'],
  isJava: true,
});

console.log(`Discovered ${discoveredEndpoints.length} route handlers:\n`);
discoveredEndpoints.forEach((ep) => {
  console.log(`  • ${ep.methods.join(', ')} -> ${ep.routePath} ${ep.isJava ? '(Java Tomcat)' : '(Next.js)'}`);
});

// -------------------------------------------------------------
// Generator 1: .HTTP Test File
// -------------------------------------------------------------
let httpContent = `### ==============================================================================
### AUTO-GENERATED API TEST FILE
### Generated: ${new Date().toISOString()}
### ==============================================================================

@baseUrl = http://localhost:3000
@javaUrl = http://localhost:8080

`;

discoveredEndpoints.forEach((ep) => {
  ep.methods.forEach((method) => {
    const url = ep.isJava ? `{{javaUrl}}${ep.routePath}` : `{{baseUrl}}${ep.routePath}`;
    httpContent += `### ${method} ${ep.routePath}\n`;
    httpContent += `${method} ${url}\n`;
    httpContent += `Content-Type: application/json\n`;

    if (method === 'POST' || method === 'PUT') {
      let sampleBody = '{\n  "test": true\n}';
      if (ep.routePath.includes('chat')) {
        sampleBody = '{\n  "prompt": "Who owes us the most money right now?"\n}';
      } else if (ep.routePath.includes('trigger')) {
        sampleBody = '{\n  "actionType": "NUDGE_ALL_OVERDUE"\n}';
      } else if (ep.routePath.includes('items')) {
        sampleBody = '{\n  "customerId": "cust_01",\n  "amount": 4500,\n  "dueDate": "2026-11-01T00:00:00.000Z"\n}';
      } else if (ep.routePath.includes('create-checkout-session')) {
        sampleBody = '{\n  "invoiceId": "inv_01",\n  "amount": 4200.00,\n  "customerEmail": "billing@novalabs.bio"\n}';
      }
      httpContent += `\n${sampleBody}\n`;
    }
    httpContent += `\n###\n\n`;
  });
});

const httpOutputPath = path.join(OUTPUT_DIR, 'generated-endpoints.http');
fs.writeFileSync(httpOutputPath, httpContent, 'utf8');
console.log(`\n✔ Generated REST Client Test File: ${httpOutputPath}`);

// -------------------------------------------------------------
// Generator 2: OpenAPI 3.0 / Swagger JSON Spec
// -------------------------------------------------------------
const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CollectFlow B2B SaaS Auto-Generated API Specification',
    version: '1.0.0',
    description: 'Auto-generated API schema definition for CollectFlow AR and Payment Gateway services.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Next.js Frontend & Serverless' },
    { url: 'http://localhost:8080/api/v1', description: 'Java Spring Boot Tomcat Backend' },
  ],
  paths: {},
};

discoveredEndpoints.forEach((ep) => {
  openApiSpec.paths[ep.routePath] = {};
  ep.methods.forEach((method) => {
    openApiSpec.paths[ep.routePath][method.toLowerCase()] = {
      summary: `${method} ${ep.routePath}`,
      responses: {
        '200': { description: 'Successful response' },
        '400': { description: 'Bad request or missing required parameters' },
        '500': { description: 'Internal server error' },
      },
    };
  });
});

const openApiOutputPath = path.join(OUTPUT_DIR, 'generated-openapi-spec.json');
fs.writeFileSync(openApiOutputPath, JSON.stringify(openApiSpec, null, 2), 'utf8');
console.log(`✔ Generated OpenAPI 3.0 Spec: ${openApiOutputPath}`);

// -------------------------------------------------------------
// Generator 3: Automated Node.js HTTP Test Runner
// -------------------------------------------------------------
const testRunnerContent = `const http = require('http');

console.log('\\n======================================================');
console.log('🚀 RUNNING AUTO-DISCOVERED LIVE ENDPOINT HEALTH CHECKS');
console.log('======================================================\\n');

const testCases = ${JSON.stringify(
  discoveredEndpoints
    .filter((e) => !e.isJava)
    .map((e) => ({
      path: e.routePath,
      method: e.methods[0] || 'GET',
    })),
  null,
  2
)};

let passed = 0;
let failed = 0;

function runCheck(index = 0) {
  if (index >= testCases.length) {
    console.log('\\n======================================================');
    console.log(\`📊 COMPLETE: \${passed} Endpoints Responded / \${failed} Failed\`);
    console.log('======================================================\\n');
    return;
  }

  const test = testCases[index];
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: test.path,
    method: test.method,
    headers: { 'Content-Type': 'application/json' },
    timeout: 3000,
  };

  const req = http.request(options, (res) => {
    if (res.statusCode < 500) {
      passed++;
      console.log(\`  \\x1b[32m✔ [HTTP \${res.statusCode}]\\x1b[0m \${test.method} \${test.path}\`);
    } else {
      failed++;
      console.log(\`  \\x1b[31m✖ [HTTP \${res.statusCode}]\\x1b[0m \${test.method} \${test.path}\`);
    }
    runCheck(index + 1);
  });

  req.on('error', (err) => {
    failed++;
    console.log(\`  \\x1b[33m⚡ [CONNECT REFUSED]\\x1b[0m \${test.method} \${test.path} (Start Next.js dev server on port 3000 to test live)\`);
    runCheck(index + 1);
  });

  if (test.method === 'POST') {
    req.write(JSON.stringify({ prompt: 'test query', actionType: 'NUDGE_ALL_OVERDUE' }));
  }
  req.end();
}

runCheck();
`;

const runnerOutputPath = path.join(OUTPUT_DIR, 'run-endpoint-tests.js');
fs.writeFileSync(runnerOutputPath, testRunnerContent, 'utf8');
console.log(`✔ Generated Live Test Runner Script: ${runnerOutputPath}`);

console.log('\n======================================================');
console.log('🎉 ALL ENDPOINT TEST FILES GENERATED SUCCESSFULLY!');
console.log('======================================================\n');
