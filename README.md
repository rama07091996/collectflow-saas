# CollectFlow AI — Autonomous Accounts Receivable & Cashflow Acceleration Engine

CollectFlow is a production-grade B2B SaaS web application designed for US SMBs and Digital Agencies to automate invoice follow-ups, cut Days Sales Outstanding (DSO) by 14 days, and recover overdue cash effortlessly with one-click payment links.

---

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, clsx / tailwind-merge
- **Backend / API**: Next.js Route Handlers (`src/app/api/*`)
- **Database & State**: PostgreSQL schema (`prisma/schema.prisma`) with zero-configuration reactive mock database store (`src/lib/db/memory-store.ts`) for instant local execution
- **Authentication**: Built-in mock auth session provider (`src/lib/mock-auth.tsx`) with instant role-switching between Agency Owner, Finance Manager, and Collections Specialist
- **State Management**: Reactive state with optimistic UI updates and live toast notifications

---

---

## REST API Endpoints & Mock Database Engine

### 1. `GET /api/dashboard/stats`
Returns aggregated financial metrics, cashflow velocity forecasts, collection efficiency index, and aging breakdown buckets.
- **Example Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalInvoiced": 269050,
      "totalOutstanding": 158550,
      "totalOverdue": 63850,
      "totalPaidThisMonth": 73300,
      "totalInDispute": 22000,
      "averageDaysToPay": 21.4,
      "collectionEfficiencyIndex": 88.4,
      "invoicesCount": {
        "total": 15,
        "overdue": 3,
        "escalated": 1,
        "inDispute": 1,
        "partiallyPaid": 2,
        "sent": 3,
        "viewed": 1,
        "paid": 3,
        "draft": 1
      },
      "agingBuckets": {
        "current": 60700,
        "days1To15": 38600,
        "days16To30": 11750,
        "days31To60": 18500,
        "days60Plus": 0
      }
    }
  }
  ```

### 2. `GET /api/items`
Returns a paginated, searchable, and filterable list of invoice records with pagination metadata.
- **Query Parameters**:
  - `page` (number, default `1`)
  - `limit` (number, default `10`)
  - `status` (`ALL` | `OVERDUE` | `PENDING` | `PAID` | `PARTIALLY_PAID` | `IN_DISPUTE` | `ESCALATED` | `DRAFT`)
  - `search` (string: matches invoice number, client company, debtor name, email, or notes)
  - `sortBy` (`dueDate` | `amount` | `amountDue` | `invoiceNumber` | `issueDate`)
  - `sortOrder` (`asc` | `desc`)
- **Example Request**: `GET /api/items?page=1&limit=5&status=OVERDUE&sortBy=amountDue&sortOrder=desc`

### 3. `POST /api/items`
Creates a new invoice record, attaches line items, generates 1-click payment portal URL, updates debtor outstanding ledger, and enrolls the invoice in the automated follow-up cadence.
- **Request Body**:
  ```json
  {
    "customerId": "cust_02",
    "invoiceNumber": "INV-2024-0199",
    "amount": 16500,
    "issueDate": "2024-09-01T00:00:00Z",
    "dueDate": "2024-09-25T00:00:00Z",
    "notes": "Q4 Strategic Advisory Sprint",
    "items": [
      { "description": "ABM Advisory Sprint", "quantity": 1, "unitPrice": 16500, "amount": 16500 }
    ]
  }
  ```

### 4. `POST /api/actions/trigger`
Simulates triggering automated workflow actions on one or more invoices (e.g. sending tone-calibrated reminder emails, batch nudges, legal escalation, applying late fees, or pausing cadences) and returns execution logs with timestamped audit entries.
- **Supported `actionType` values**:
  - `SEND_REMINDER`: Single invoice tone-calibrated follow-up.
  - `NUDGE_ALL_OVERDUE`: Batch trigger for all delinquent accounts.
  - `ESCALATE_DELINQUENT`: Formal legal escalation notice.
  - `APPLY_LATE_FEE`: Computes & appends a 1.5% late fee to balance.
  - `PAUSE_CADENCE`: Pauses automated sequences for disputed accounts.
- **Request Body**:
  ```json
  {
    "actionType": "NUDGE_ALL_OVERDUE",
    "channel": "EMAIL"
  }
  ```
- **Example Response**:
  ```json
  {
    "success": true,
    "message": "Workflow action 'NUDGE_ALL_OVERDUE' executed successfully on 4 invoice(s).",
    "data": {
      "actionType": "NUDGE_ALL_OVERDUE",
      "triggeredAt": "2024-09-01T17:05:00.000Z",
      "affectedCount": 4,
      "executionLogs": [
        {
          "id": "log_1",
          "timestamp": "2024-09-01T17:05:00.120Z",
          "level": "INFO",
          "targetInvoice": "INV-2024-0089",
          "customer": "Apex Logistics LLC",
          "channel": "Automated Email Engine",
          "status": "DISPATCHED",
          "message": "Dispatched tone-calibrated reminder (38d overdue, balance $18,500) to billing@apexlogistics.us."
        }
      ]
    }
  }
  ```

---

## 15 Varied Seed Records (Including Edge Cases)

| Invoice # | Debtor Company | Amount Due | Status | Edge Case Scenario |
|---|---|---|---|---|
| `INV-2024-0089` | Apex Logistics LLC | $18,500 | `ESCALATED` | 38 days overdue, 4 reminder logs, legal notice sent |
| `INV-2024-0104` | Horizon Media Group | $14,200 | `OVERDUE` | 14 days overdue, link clicked twice, high balance |
| `INV-2024-0112` | Summit Retail Partners | $9,400 | `OVERDUE` | 7 days overdue, Critical Risk debtor (Score: 92) |
| `INV-2024-0115` | Nexis BioHealth Inc | $22,000 | `IN_DISPUTE` | Deliverable scope disputed, cadence paused |
| `INV-2024-0118` | Krypton Cloud Solutions | $9,000 | `PARTIALLY_PAID` | $15k total ($6k paid, $9k balance due in 6d) |
| `INV-2024-0120` | Vanguard Financial | $15,000 | `PARTIALLY_PAID` | $30k total ($15k paid, $15k balance 10d overdue) |
| `INV-2024-0122` | CloudScale SaaS Inc | $8,900 | `VIEWED` | Due in 4 days, portal viewed by CFO twice |
| `INV-2024-0125` | Starlight Creative Labs | $6,500 | `SENT` | Due in 12 days, standard Net-30 monthly marketing |
| `INV-2024-0127` | Beacon Health Systems | $45,000 | `SENT` | Large Net-45 enterprise healthcare retainer |
| `INV-2024-0098` | Nova Labs BioTech | $0 | `PAID` | $24,500 settled in full via Stripe ACH |
| `INV-2024-0092` | Vantage Point Advisory | $0 | `PAID` | $32,000 settled in full via Wire Transfer |
| `INV-2024-0085` | AeroDynamics Corp | $0 | `PAID` | $16,800 settled on time |
| `INV-2024-0130` | Quantum AI Research | $12,000 | `DRAFT` | Unfinalized draft for upcoming Q4 sprint |
| `INV-2024-0132` | Pinnacle Real Estate | $11,750 | `OVERDUE` | 22 days overdue, high risk debtor (Score: 82) |
| `INV-2024-0135` | BlueWave E-Commerce | $7,800 | `SENT` | Due tomorrow, courtesy reminder queued |


```
collectflow-saas/
├── prisma/
│   ├── schema.prisma                      # Full PostgreSQL database schema with models & enums
│   └── seed.ts                            # Prisma seed script
├── src/
│   ├── app/
│   │   ├── (auth)/                        # Auth routes
│   │   ├── (dashboard)/                   # SaaS application pages
│   │   │   ├── layout.tsx                 # Dashboard shell with persistent sidebar & header
│   │   │   ├── dashboard/page.tsx         # Executive Overview, aging chart & cashflow forecast
│   │   │   ├── invoices/page.tsx          # Interactive Invoices table, search, filters & details
│   │   │   ├── workflows/page.tsx         # Visual AR cadence builder & email preview
│   │   │   ├── integrations/page.tsx      # Stripe & QuickBooks mock connectors & webhook logs
│   │   │   └── settings/page.tsx          # Organization settings & escalation rules
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx                 # Marketing header & footer
│   │   │   └── page.tsx                   # High-converting Landing Page with live ROI Calculator
│   │   ├── api/
│   │   │   ├── analytics/route.ts         # Summary metrics & AR aging calculation
│   │   │   ├── invoices/route.ts          # Invoices list, search, filter, and create
│   │   │   ├── invoices/[id]/route.ts     # Single invoice detail
│   │   │   ├── invoices/[id]/remind/route.ts # Trigger automated/custom reminder email
│   │   │   ├── invoices/[id]/pay/route.ts # Webhook simulator for invoice settlement
│   │   │   ├── workflows/route.ts         # Cadence configuration GET and PUT
│   │   │   ├── integrations/route.ts      # Connect/disconnect & live sync trigger
│   │   │   └── reset/route.ts             # One-click restore seed state
│   │   ├── globals.css                    # Tailwind CSS directives & custom variables
│   │   ├── layout.tsx                     # Root HTML layout with Inter font
│   │   └── providers.tsx                  # Global client providers (Auth + Toast)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AgingBreakdownChart.tsx    # Visual aging distribution buckets (0-15d, 16-30d, 31-60d, 60+d)
│   │   │   ├── CashflowChart.tsx          # Monthly cash collected vs projected velocity chart
│   │   │   ├── MetricsCards.tsx           # Total Invoiced, Overdue, Paid, and Average DSO cards
│   │   │   ├── QuickActions.tsx           # One-click Nudge All Overdue (3) and action queue
│   │   │   └── RecentActivityFeed.tsx     # Real-time event stream & audit log
│   │   ├── invoices/
│   │   │   ├── CreateInvoiceModal.tsx     # Modal to issue invoice & enroll in cadence
│   │   │   ├── InvoiceDetailModal.tsx     # Comprehensive invoice breakdown & timeline
│   │   │   ├── InvoiceFilters.tsx         # Tab filters (All, Overdue, Pending, Paid) & search
│   │   │   ├── InvoiceTable.tsx           # Interactive data table with sorting & batch actions
│   │   │   └── ManualReminderModal.tsx    # Tone-calibrated reminder composer
│   │   ├── integrations/
│   │   │   ├── IntegrationCard.tsx        # Provider connector tile with sync trigger
│   │   │   └── WebhookSimulator.tsx       # Live webhook simulation terminal
│   │   ├── landing/
│   │   │   ├── FeatureGrid.tsx            # 6 core feature value propositions
│   │   │   ├── Footer.tsx                 # Marketing footer
│   │   │   ├── Hero.tsx                   # Hero section with live product preview
│   │   │   ├── InteractiveCalculator.tsx  # Dynamic cash recovery ROI slider
│   │   │   ├── Navbar.tsx                 # Marketing navigation & CTA buttons
│   │   │   └── Testimonials.tsx           # Social proof from agency owners
│   │   ├── layout/
│   │   │   ├── Header.tsx                 # Header with persona switcher & reset button
│   │   │   └── Sidebar.tsx                # Dashboard navigation with status indicators
│   │   └── ui/
│   │       ├── Badge.tsx                  # Pill badges with status dots
│   │       ├── Button.tsx                 # Button with variants, sizes & loading spinner
│   │       ├── Card.tsx                   # Card wrapper & header/content primitives
│   │       ├── Input.tsx                  # Text input with labels, helper & icons
│   │       ├── Modal.tsx                  # Accessible backdrop modal dialog
│   │       └── Toast.tsx                  # Toast notification provider & hook
│   └── lib/
│       ├── db/
│       │   ├── memory-store.ts            # Persistent in-memory CRUD & reactive logic
│       │   └── seed-data.ts               # Realistic B2B seed data
│       ├── mock-auth.tsx                  # Multi-role persona switcher context
│       ├── types.ts                       # Core TypeScript interfaces & DTOs
│       └── utils.ts                       # Formatters, template interpolators, calculations
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 5 Required Prototype Pages & Capabilities

### 1. Landing Page (`/`)
- Clean hero section with clear value proposition (*"Get Paid 14 Days Faster Without Awkward Client Emails"*).
- **Interactive Cash Flow Recovery Calculator**: Adjust monthly invoiced volume and overdue rate sliders to see instant estimated annual cash recovered and hours saved.
- Feature grid covering tone calibration, 1-click payment links, debtor risk scoring, and accounting sync.
- Testimonial reviews and "Start 14-Day Free Trial" / "Explore Live Demo" CTAs.

### 2. Dashboard Overview (`/dashboard`)
- **Metric Cards**: Total Invoiced ($184,500), Overdue Balance ($42,100), Collected This Month ($96,200), and Average Days to Pay (21.4 Days vs 38-day benchmark).
- **AR Aging Breakdown Chart**: Categorized overdue buckets (Current, 1-15d, 16-30d, 31-60d, 60+d).
- **Cash Collection Velocity**: Historical vs projected cash collections.
- **Action Queue**: One-click *"Nudge All Overdue (3)"* button that triggers smart reminders across all delinquent accounts.
- **Audit Feed**: Real-time event log of payments, opened emails, and reminder dispatches.

### 3. Core Invoices & Debtors Table (`/invoices`)
- **Interactive Data Table**: Search by invoice/client name, filter tabs (`All`, `Overdue & Escalated`, `Due Soon / Pending`, `Settled / Paid`), and sort by amount, due date, or invoice number.
- **Batch Actions**: Multi-select invoices to dispatch batch email reminders.
- **Invoice Detail Modal**: Full breakdown with debtor credit terms, risk tier, line items, 1-click payment link copy, and full communication audit trail.
- **Simulate Payment**: Click "Pay" or "Simulate Payment" on any invoice to immediately transition it to `PAID`, update customer ledger balances, and recalculate dashboard metrics.
- **New Invoice Drawer**: Issue custom invoices that immediately enroll in the automated follow-up sequence.

### 4. Automated Workflow Builder (`/workflows`)
- Visual 5-step cadence timeline:
  1. *3 Days Before Due* &rarr; Friendly courtesy reminder & PDF link
  2. *Due Date* &rarr; Settlement alert with 1-click ACH/Card link
  3. *7 Days Overdue* &rarr; Firm follow-up & late fee warning
  4. *14 Days Overdue* &rarr; Urgent escalation notice
  5. *30 Days Overdue* &rarr; Executive suspension warning
- Interactive step editor with dynamic merge variables (`{{customer_name}}`, `{{invoice_number}}`, `{{amount}}`, `{{payment_link}}`, `{{due_date}}`).
- Real-time desktop & mobile email client render preview.

### 5. Mock Integrations & Sandbox (`/integrations`)
- Connect and disconnect mock Stripe Invoicing, QuickBooks Online, Xero, and FreshBooks.
- Trigger "Sync Now" to simulate API reconciliation runs with realistic ledger log outputs.
- **Webhook Simulator**: Test live inbound Stripe `invoice.paid` and QuickBooks `invoice.created` webhook payloads.
- **Reset Demo Data**: Header button restores seed dataset at any time.

---

## Quickstart Instructions

```bash
# 1. Navigate to the project directory
cd collectflow-saas

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```
