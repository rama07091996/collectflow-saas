@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Windows
@REM ----------------------------------------------------------------------------
@IF "%DEBUG%" == "" @ECHO OFF

@REM Execute Maven Wrapper using PowerShell to download and run Maven automatically
powershell -Command "
$wrapperProperties = Get-Content .mvn\wrapper\maven-wrapper.properties | ConvertFrom-StringData
$distUrl = $wrapperProperties.distributionUrl
$mavenHome = Join-Path $env:USERPROFILE '.m2\wrapper\dists\apache-maven-3.9.6'

if (-not (Test-Path $mavenHome)) {
    Write-Host 'Downloading Apache Maven wrapper...' -ForegroundColor Cyan
    $zipPath = Join-Path $env:TEMP 'apache-maven.zip'
    Invoke-WebRequest -Uri $distUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath (Split-Path $mavenHome) -Force
    Remove-Item $zipPath
}

$mvnCmd = Get-ChildItem -Path (Split-Path $mavenHome) -Filter 'mvn.cmd' -Recurse | Select-Object -ExpandProperty FullName -First 1
if ($mvnCmd) {
    & $mvnCmd $args
} else {
    Write-Host 'Maven not found. Please install Maven or run npm run build instead.' -ForegroundColor Red
}
" %*
