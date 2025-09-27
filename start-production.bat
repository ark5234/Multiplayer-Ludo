@echo off
REM Production Start Script for Multiplayer Ludo (Windows)
echo 🚀 Starting Multiplayer Ludo Production Server...

REM Set production environment
set NODE_ENV=production

REM Start backend server
echo 📡 Starting backend server on port 5000...
cd backend
start "Backend Server" node server.js

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Serve frontend build
echo 🌐 Starting frontend server on port 3000...
cd ..
start "Frontend Server" npx serve -s build -l 3000

echo ✅ Production servers started successfully!
echo 🎮 Game available at: http://localhost:3000
echo 🔌 API available at: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul