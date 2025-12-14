# Live Poll Studio - Development Setup Script (Windows)

Write-Host "🚀 Starting Live Poll Studio Development Environment" -ForegroundColor Green
Write-Host ""

# Check if server dependencies are installed
if (-Not (Test-Path "server\node_modules")) {
    Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Check if frontend dependencies are installed
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun install
    } else {
        npm install
    }
}

# Check for .env files
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: Frontend .env file not found" -ForegroundColor Yellow
    Write-Host "   Please copy .env.example to .env and configure it"
}

if (-Not (Test-Path "server\.env")) {
    Write-Host "⚠️  Warning: Backend .env file not found" -ForegroundColor Yellow
    Write-Host "   Please copy server\.env.example to server\.env and configure it"
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start development:" -ForegroundColor Cyan
Write-Host "  Terminal 1: cd server; npm run dev"
Write-Host "  Terminal 2: bun run dev (or npm run dev)"
Write-Host ""
Write-Host "Backend will run on: http://localhost:3001" -ForegroundColor Magenta
Write-Host "Frontend will run on: http://localhost:8080" -ForegroundColor Magenta
Write-Host ""
