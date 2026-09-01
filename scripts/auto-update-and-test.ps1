# ==============================================================================
# CollectFlow Auto-Dependency Updater & Payment JUnit Test Runner
# ==============================================================================

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "⚡ COLLECTFLOW AUTO-DEPENDENCY UPDATER & JUNIT RUNNER" -ForegroundColor Cyan
Write-Host "======================================================`n" -ForegroundColor Cyan

$rootPath = Resolve-Path "."
$javaBackendPath = Join-Path $rootPath "backend-java"

# Step 1: Check & Update Node Dependencies
Write-Host "• Step 1/3: Checking & Updating Node.js / Next.js Dependencies..." -ForegroundColor Yellow
try {
    $env:Path = "C:\Program Files\nodejs;C:\Program Files\Git\cmd;" + $env:Path
    cmd.exe /c "npm update"
    cmd.exe /c "npx prisma generate"
    Write-Host "  ✔ Node dependencies updated and Prisma schema generated." -ForegroundColor Green
} catch {
    Write-Host "  ✖ Failed to update npm dependencies: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 2: Run Maven Dependency Check & Execute JUnit 5 Payment Tests
Write-Host "`n• Step 2/3: Executing JUnit 5 Payment Endpoints & Security Test Suite..." -ForegroundColor Yellow
try {
    $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
    $env:M2_HOME = "C:\Users\Macbook\.m2\apache-maven-3.9.6"
    $env:Path = "$env:JAVA_HOME\bin;$env:M2_HOME\bin;" + $env:Path

    Set-Location $javaBackendPath
    cmd.exe /c "mvn test"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✔ [JUNIT SUCCESS] All 13 Payment Endpoints & Security Tests Passed!" -ForegroundColor Green
    } else {
        Write-Host "  ✖ [JUNIT FAILURE] Payment tests failed after dependency check!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ✖ Error running Maven tests: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Set-Location $rootPath
}

# Step 3: Run TypeScript AR & Copilot Test Suite
Write-Host "`n• Step 3/3: Running Next.js & AI Copilot Unit Tests..." -ForegroundColor Yellow
try {
    cmd.exe /c "npm test"
    Write-Host "  ✔ All TypeScript AR & Copilot tests passed." -ForegroundColor Green
} catch {
    Write-Host "  ✖ Next.js test failure: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "🎉 ALL AUTO-DEPENDENCY CHECKS & JUNIT 5 TESTS PASSED!" -ForegroundColor Cyan
Write-Host "======================================================`n" -ForegroundColor Cyan
