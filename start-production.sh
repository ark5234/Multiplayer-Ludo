#!/bin/bash

# Production Start Script for Multiplayer Ludo
echo "🚀 Starting Multiplayer Ludo Production Server..."

# Set production environment
export NODE_ENV=production

# Start backend server
echo "📡 Starting backend server on port 5000..."
cd backend
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Serve frontend build
echo "🌐 Starting frontend server on port 3000..."
cd ../
npx serve -s build -l 3000 &
FRONTEND_PID=$!

echo "✅ Production servers started successfully!"
echo "🎮 Game available at: http://localhost:3000"
echo "🔌 API available at: http://localhost:5000"
echo ""
echo "To stop servers:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Wait for user input to stop
echo "Press any key to stop servers..."
read -n 1 -s

# Stop servers
kill $BACKEND_PID $FRONTEND_PID
echo "🛑 Servers stopped."