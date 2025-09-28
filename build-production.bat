@echo off
REM 🚀 Production Build Script for Multiplayer Ludo (Windows)
echo 🎯 Building Multiplayer Ludo for Production...

REM Install dependencies  
echo 📦 Installing frontend dependencies...
call npm install

echo 📦 Installing backend dependencies...
cd backend 
call npm install
cd ..

REM Build frontend for production
echo 🏗️ Building React frontend...
call npm run build

REM Copy build to backend for serving
echo 📁 Copying build files...
if exist backend\build rmdir /s /q backend\build
xcopy build backend\build\ /e /i /q

echo ✅ Production build complete!
echo.
echo 🌍 Ready for deployment to Render!
echo 📖 See DEPLOYMENT_GUIDE.md for deployment instructions  
echo.
echo To test locally with production build:
echo 1. Start backend: cd backend ^&^& set NODE_ENV=production ^&^& npm start
echo 2. Open: http://localhost:8080

pause