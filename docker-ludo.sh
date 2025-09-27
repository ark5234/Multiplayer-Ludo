#!/bin/bash

# Docker Management Script for Multiplayer Ludo

echo "🐳 Multiplayer Ludo - Docker Management"
echo "====================================="

case "$1" in
    "up")
        echo "🚀 Starting Multiplayer Ludo with Docker..."
        docker-compose --env-file .env.docker up -d
        echo "✅ Services started!"
        echo "🎮 Frontend: http://localhost:3000"
        echo "🔌 Backend: http://localhost:5000"
        echo "🗄️ MongoDB: localhost:27017"
        ;;
    "down")
        echo "🛑 Stopping Multiplayer Ludo services..."
        docker-compose down
        echo "✅ Services stopped!"
        ;;
    "build")
        echo "🔨 Building Docker images..."
        docker-compose build
        echo "✅ Images built!"
        ;;
    "rebuild")
        echo "🔨 Rebuilding and starting services..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose --env-file .env.docker up -d
        echo "✅ Services rebuilt and started!"
        ;;
    "logs")
        echo "📋 Showing service logs..."
        docker-compose logs -f
        ;;
    "status")
        echo "📊 Service Status:"
        docker-compose ps
        echo ""
        echo "📈 Container Stats:"
        docker stats --no-stream
        ;;
    *)
        echo ""
        echo "Usage: ./docker-ludo.sh [command]"
        echo ""
        echo "Commands:"
        echo "  up       - Start all services"
        echo "  down     - Stop all services"
        echo "  build    - Build Docker images"
        echo "  rebuild  - Rebuild and restart services"
        echo "  logs     - Show service logs"
        echo "  status   - Show service status"
        echo ""
        echo "Quick Start:"
        echo "  ./docker-ludo.sh build"
        echo "  ./docker-ludo.sh up"
        echo ""
        ;;
esac