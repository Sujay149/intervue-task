#!/bin/bash

# Live Poll Studio - Development Setup Script

echo "🚀 Starting Live Poll Studio Development Environment"
echo ""

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    if command -v bun &> /dev/null; then
        bun install
    else
        npm install
    fi
fi

# Check for .env files
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: Frontend .env file not found"
    echo "   Please copy .env.example to .env and configure it"
fi

if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: Backend .env file not found"
    echo "   Please copy server/.env.example to server/.env and configure it"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  Terminal 1: cd server && npm run dev"
echo "  Terminal 2: bun run dev (or npm run dev)"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:8080"
echo ""
