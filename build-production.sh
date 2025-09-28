#!/bin/bash

# 🚀 Production Build Script for Multiplayer Ludo
echo "🎯 Building Multiplayer Ludo for Production..."

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Build frontend for production
echo "🏗️ Building React frontend..."
npm run build

# Test production build locally
echo "🧪 Testing production build locally..."
echo "Backend will run on: http://localhost:8080"
echo "Frontend will serve from: backend/build/"

echo "✅ Production build complete!"
echo ""
echo "🌍 Ready for deployment to Render!"
echo "📖 See DEPLOYMENT_GUIDE.md for deployment instructions"
echo ""
echo "To test locally with production build:"
echo "1. Start backend: cd backend && NODE_ENV=production npm start"
echo "2. Open: http://localhost:8080"