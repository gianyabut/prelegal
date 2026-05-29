$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "Starting Prelegal..."
docker compose up -d --build

Write-Host ""
Write-Host "Prelegal is running:"
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  Backend:  http://localhost:8000"
