@echo off
REM Docker Management Script for Multiplayer Ludo

echo 🐳 Multiplayer Ludo - Docker Management
echo =====================================

if "%1"=="up" goto start
if "%1"=="down" goto stop
if "%1"=="build" goto build
if "%1"=="rebuild" goto rebuild
if "%1"=="logs" goto logs
if "%1"=="status" goto status
goto help

:start
echo 🚀 Starting Multiplayer Ludo with Docker...
docker-compose --env-file .env.docker up -d
echo ✅ Services started!
echo 🎮 Frontend: http://localhost:3000
echo 🔌 Backend: http://localhost:5000
echo 🗄️ MongoDB: localhost:27017
goto end

:stop
echo 🛑 Stopping Multiplayer Ludo services...
docker-compose down
echo ✅ Services stopped!
goto end

:build
echo 🔨 Building Docker images...
docker-compose build
echo ✅ Images built!
goto end

:rebuild
echo 🔨 Rebuilding and starting services...
docker-compose down
docker-compose build --no-cache
docker-compose --env-file .env.docker up -d
echo ✅ Services rebuilt and started!
goto end

:logs
echo 📋 Showing service logs...
docker-compose logs -f
goto end

:status
echo 📊 Service Status:
docker-compose ps
echo.
echo 📈 Container Stats:
docker stats --no-stream
goto end

:help
echo.
echo Usage: docker-ludo.bat [command]
echo.
echo Commands:
echo   up       - Start all services
echo   down     - Stop all services  
echo   build    - Build Docker images
echo   rebuild  - Rebuild and restart services
echo   logs     - Show service logs
echo   status   - Show service status
echo.
echo Quick Start:
echo   docker-ludo.bat build
echo   docker-ludo.bat up
echo.

:end
pause