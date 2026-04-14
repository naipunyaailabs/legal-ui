# Quick Start Script for LexRAG Counsel
# Run this from the root: .\start.ps1

Write-Host "Starting LexRAG Counsel..." -ForegroundColor Cyan

# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
Write-Host "Backend starting on http://localhost:8000" -ForegroundColor Green

# Small delay
Start-Sleep 3

# Start frontend in background  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
Write-Host "Frontend starting on http://localhost:3000" -ForegroundColor Green

Write-Host "`nOpen http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host "Run ingestion after startup: Invoke-RestMethod -Uri http://localhost:8000/api/ingestion/run -Method POST -ContentType 'application/json' -Body '{}'" -ForegroundColor Yellow
