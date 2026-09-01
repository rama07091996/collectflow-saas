# ==============================================================================
# CollectFlow Automated PowerShell API Test Runner
# ==============================================================================

$baseUrl = "http://localhost:3000"
$javaUrl = "http://localhost:8080/api/v1"

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "⚡ COLLECTFLOW LIVE ENDPOINT HEALTH CHECKS" -ForegroundColor Cyan
Write-Host "======================================================`n" -ForegroundColor Cyan

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )

    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -ContentType "application/json" -TimeoutSec 5
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -TimeoutSec 5
        }
        Write-Host "  ✔ [SUCCESS] $Method $Url" -ForegroundColor Green
    } catch {
        Write-Host "  ✖ [ERROR] $Method $Url - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 1. Test Dashboard & Invoices
Test-Endpoint -Method "GET" -Url "$baseUrl/api/dashboard/stats"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/items?status=OVERDUE&limit=5"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/invoices"

# 2. Test Workflow Actions
Test-Endpoint -Method "POST" -Url "$baseUrl/api/actions/trigger" -Body '{"actionType": "NUDGE_ALL_OVERDUE"}'

# 3. Test AI Copilot & Autonomous Dunning
Test-Endpoint -Method "POST" -Url "$baseUrl/api/ai/chat" -Body '{"prompt": "Who owes us the most money right now?"}'
Test-Endpoint -Method "POST" -Url "$baseUrl/api/ai/autopilot"

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "🎉 ENDPOINT CHECKS COMPLETED" -ForegroundColor Cyan
Write-Host "======================================================`n" -ForegroundColor Cyan
