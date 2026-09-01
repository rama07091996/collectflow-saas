#!/usr/bin/env bash
# ==============================================================================
# CollectFlow Bash cURL API Test Runner
# ==============================================================================

BASE_URL="http://localhost:3000"
JAVA_URL="http://localhost:8080/api/v1"

echo -e "\n\033[36m======================================================\033[0m"
echo -e "\033[36m⚡ COLLECTFLOW LIVE ENDPOINT HEALTH CHECKS (cURL)\033[0m"
echo -e "\033[36m======================================================\033[0m\n"

# 1. Test Dashboard Stats
echo -n "• Testing GET /api/dashboard/stats ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/dashboard/stats")
if [ "$STATUS" -eq 200 ]; then echo -e "\033[32m✔ [HTTP 200 OK]\033[0m"; else echo -e "\033[31m✖ [HTTP $STATUS]\033[0m"; fi

# 2. Test Paginated Invoices
echo -n "• Testing GET /api/items?status=OVERDUE ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/items?status=OVERDUE")
if [ "$STATUS" -eq 200 ]; then echo -e "\033[32m✔ [HTTP 200 OK]\033[0m"; else echo -e "\033[31m✖ [HTTP $STATUS]\033[0m"; fi

# 3. Test Action Trigger
echo -n "• Testing POST /api/actions/trigger ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/actions/trigger" -H "Content-Type: application/json" -d '{"actionType": "NUDGE_ALL_OVERDUE"}')
if [ "$STATUS" -eq 200 ]; then echo -e "\033[32m✔ [HTTP 200 OK]\033[0m"; else echo -e "\033[31m✖ [HTTP $STATUS]\033[0m"; fi

# 4. Test AI Copilot Chat
echo -n "• Testing POST /api/ai/chat ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/ai/chat" -H "Content-Type: application/json" -d '{"prompt": "Who owes us the most money right now?"}')
if [ "$STATUS" -eq 200 ]; then echo -e "\033[32m✔ [HTTP 200 OK]\033[0m"; else echo -e "\033[31m✖ [HTTP $STATUS]\033[0m"; fi

# 5. Test Autonomous Auto-Pilot
echo -n "• Testing POST /api/ai/autopilot ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/ai/autopilot")
if [ "$STATUS" -eq 200 ]; then echo -e "\033[32m✔ [HTTP 200 OK]\033[0m"; else echo -e "\033[31m✖ [HTTP $STATUS]\033[0m"; fi

echo -e "\n\033[36m======================================================\033[0m"
echo -e "\033[32m🎉 ALL cURL ENDPOINT CHECKS FINISHED!\033[0m\n"
