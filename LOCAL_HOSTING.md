# Local Hosting Guide: Nginx & Tomcat Reverse Proxy

Host the entire CollectFlow B2B SaaS application locally on your machine with enterprise **Nginx** reverse proxying and **Apache Tomcat / Spring Boot** on port 80.

---

## 🏛 Local Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    Local Client (Web Browser)        │
                      │       http://localhost:80            │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │      Nginx Reverse Proxy (Port 80)   │
                      └──────────┬────────────────┬──────────┘
                                 │                │
          Route "/" (Frontend)   │                │   Route "/api/v1/*" (Payments)
                                 ▼                ▼
         ┌──────────────────────────────┐ ┌──────────────────────────────────────┐
         │     Next.js App Router       │ │    Java Spring Boot / Tomcat         │
         │         (Port 3000)          │ │            (Port 8080)               │
         └──────────────┬───────────────┘ └──────────────────┬───────────────────┘
                        │                                    │
                        └─────────────────┬──────────────────┘
                                          ▼
                         ┌──────────────────────────────────┐
                         │   PostgreSQL Database (Port 5432)│
                         └──────────────────────────────────┘
```

---

## 🚀 Option 1: 1-Click Launch via Docker Compose (Recommended)

Run all 4 services (PostgreSQL, Java Tomcat Backend, Next.js Frontend, Nginx Gateway) with a single command:

```bash
# In the project root directory:
docker-compose up --build
```

### Accessing Local Services:
* **Web Application**: `http://localhost`
* **Java Payments API**: `http://localhost/api/v1/payments/create-checkout-session`
* **Direct Next.js**: `http://localhost:3000`
* **Direct Tomcat**: `http://localhost:8080`
* **PostgreSQL Database**: `localhost:5432` (`collectflow_db`)

To stop all services:
```bash
docker-compose down
```

---

## 🛠 Option 2: Standalone Local Hosting on Windows (Without Docker)

If you prefer running services natively on Windows:

### Step 1: Start PostgreSQL
Ensure local PostgreSQL is running on port 5432:
```powershell
$env:DATABASE_URL="postgresql://postgres:password@localhost:5432/collectflow_db"
```

### Step 2: Start Java Tomcat Backend (Port 8080)
```powershell
cd backend-java
mvn clean spring-boot:run
```
*(Spring Boot starts the embedded Tomcat server on `http://localhost:8080/api/v1`)*.

### Step 3: Start Next.js Frontend (Port 3000)
In a new terminal window:
```powershell
cd C:\Users\Macbook\.gemini\antigravity\scratch\collectflow-saas
npm run dev
```
*(Next.js starts on `http://localhost:3000`)*.

### Step 4: Start Nginx for Windows (Port 80)
1. Download **Nginx for Windows** from [nginx.org/en/download.html](https://nginx.org/en/download.html) (or install via `winget install nginx`).
2. Copy the included configuration:
   ```powershell
   copy nginx\nginx.conf C:\nginx\conf\nginx.conf
   ```
3. Start Nginx:
   ```powershell
   cd C:\nginx
   start nginx
   ```

Now open **`http://localhost`** in your browser! Nginx will seamlessly route all UI requests to Next.js and all `/api/v1/` payment and invoice requests to Tomcat.

---

## 🛑 Useful Nginx Management Commands

```powershell
# Reload Nginx configuration without restarting
nginx -s reload

# Stop Nginx
nginx -s stop

# Test configuration syntax
nginx -t
```
