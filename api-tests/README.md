# CollectFlow API Testing Suite

This directory contains complete API testing files, collections, and scripts to test all endpoints across the Next.js serverless API and the Java Tomcat backend.

---

## 📁 Included Test Files

| File | Purpose / Tool |
|---|---|
| **[`collectflow-api.http`](./collectflow-api.http)** | **VS Code REST Client** / **IntelliJ HTTP Client** (Send requests directly inside editor) |
| **[`collectflow_postman_collection.json`](./collectflow_postman_collection.json)** | **Postman Collection v2.1** (Import into Postman or Insomnia with pre-built assertions) |

---

## 🚀 How to Execute the API Tests

### 1. Using VS Code REST Client (Fastest)
1. Install the **REST Client** extension in VS Code (`humao.rest-client`).
2. Open [`collectflow-api.http`](./collectflow-api.http).
3. Click the **"Send Request"** button above any endpoint.

---

### 2. Using Postman / Insomnia
1. Open Postman &rarr; Click **Import**.
2. Select [`collectflow_postman_collection.json`](./collectflow_postman_collection.json).
3. Set your `baseUrl` variable (`http://localhost:3000` or your Vercel URL).
4. Click **Run Collection** to execute all automated tests.

---

### 3. Using cURL from Terminal

#### Test 1: Aggregated Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/dashboard/stats
```

#### Test 2: Paginated Invoices with Filter
```bash
curl -X GET "http://localhost:3000/api/items?status=OVERDUE&limit=5"
```

#### Test 3: Trigger Workflow Action (Nudge All Overdue)
```bash
curl -X POST http://localhost:3000/api/actions/trigger \
  -H "Content-Type: application/json" \
  -d '{"actionType": "NUDGE_ALL_OVERDUE"}'
```

#### Test 4: Ask AI Copilot
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Who owes us the most money right now?"}'
```

#### Test 5: Trigger Autonomous Auto-Pilot Dunning
```bash
curl -X POST http://localhost:3000/api/ai/autopilot
```

#### Test 6: Java Stripe Payment Checkout Session
```bash
curl -X POST http://localhost:8080/api/v1/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"invoiceId":"inv_01","amount":4200.00,"customerEmail":"accounts@novalabs.bio"}'
```
