#!/bin/bash
# Quick multiplayer setup script

echo "🎮 Multiplayer Ludo - Friend Connection Setup"
echo "=============================================="

# Get local IP
$IP = (Get-NetIPAddress | Where-Object {$_.AddressFamily -eq 'IPv4' -and $_.InterfaceAlias -notlike '*Loopback*' -and $_.InterfaceAlias -notlike '*VMware*'}).IPAddress | Select-Object -First 1

echo ""
echo "🏠 LOCAL PLAY:"
echo "You: http://localhost:3000"
echo "Friends (same Wi-Fi): http://$IP:3000"
echo ""
echo "🌍 INTERNET PLAY OPTIONS:"
echo "1. Install ngrok: winget install ngrok"
echo "   Then run: ngrok http 3000"
echo ""
echo "2. Install cloudflared: winget install Cloudflare.cloudflared"
echo "   Then run: cloudflared tunnel --url http://localhost:3000"
echo ""
echo "🚀 App Status:"
echo "✅ Frontend: http://localhost:3000"
echo "✅ Backend: http://localhost:8080"
echo ""
echo "📱 Mobile friendly - works on phones/tablets too!"