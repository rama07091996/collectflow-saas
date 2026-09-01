# CollectFlow Enterprise Java (Spring Boot 3) Payment & AR Backend

High-security, PCI-DSS compliant, enterprise-grade Java backend for B2B payment gateway processing, automated invoice reconciliation, and cryptographic webhook verification.

---

## 🏗 Tech Stack & Architecture

- **Language & Runtime**: Java 17 / 21 LTS
- **Framework**: Spring Boot 3.3.x (Spring Web, Spring Security, Spring Data JPA)
- **Payment Gateway**: Official Stripe Java SDK (`com.stripe:stripe-java:26.0.0`)
- **Database**: PostgreSQL with HikariCP Connection Pooling
- **Security & Integrity**: 
  - Cryptographic HMAC-SHA256 Stripe Webhook Signature Verification (`Webhook.constructEvent`)
  - PCI-DSS Scope Reduction via Hosted Stripe Checkout Sessions & Client Secrets
  - Stateless Spring Security with CORS configuration for Next.js

---

## 🚀 Running the Java Backend Locally

### 1. Prerequisites
- **JDK 17 or 21** installed (`java -version`)
- **Maven 3.8+** installed (`mvn -v`)
- PostgreSQL instance running (or Neon / Supabase cloud Postgres)

### 2. Environment Variables

Set the following in your environment or in `src/main/resources/application.yml`:

```bash
export STRIPE_SECRET_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
export DATABASE_URL="jdbc:postgresql://ep-cloud.us-east-1.neon.tech/neondb?sslmode=require"
export DB_USERNAME="your_user"
export DB_PASSWORD="your_password"
```

### 3. Build & Run
```bash
cd backend-java
mvn clean package -DskipTests
mvn spring-boot:run
```

The server will start at `http://localhost:8080/api/v1`.

---

## 🔒 Payment Gateway Endpoints

### 1. Generate Secure 1-Click Checkout Session
`POST /api/v1/payments/create-checkout-session`

**Request Body:**
```json
{
  "invoiceId": "inv_01",
  "invoiceNumber": "INV-2024-001",
  "amount": 4200.00,
  "currency": "USD",
  "customerEmail": "accounts@novalabs.bio",
  "customerName": "Nova Labs BioTech",
  "description": "Full settlement for Invoice INV-2024-001"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3...",
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "clientSecret": "cs_test_..._secret_...",
  "message": "Secure payment session created successfully."
}
```

### 2. Cryptographic Webhook Listener
`POST /api/v1/payments/webhook`
- Headers: `Stripe-Signature: t=1614552...,v1=5257a869e7...`
- Automatically validates SHA-256 signature to prevent replay and forgery attacks.
- Automatically marks invoices as `PAID` upon `checkout.session.completed`.

---

## 🧪 Testing with Stripe CLI

Forward Stripe test events directly to your local Java Spring Boot server:

```bash
stripe listen --forward-to localhost:8080/api/v1/payments/webhook
```
