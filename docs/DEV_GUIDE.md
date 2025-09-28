# Multiplayer Ludo - Development Guide

## Quick Start Commands

### 🐳 Docker Development (Recommended)
```bash
# One-command setup: Build + Run + Show logs
npm run docker:dev

# Individual commands if needed:
npm run docker:build   # Build containers
npm run docker:up      # Start services
npm run docker:logs    # View logs
npm run docker:down    # Stop everything
```

### ⚡ Local Development (Faster startup)
```bash
# Quick local development (requires local MongoDB)
npm run dev:quick

# Or run services separately:
npm run dev:backend    # Start backend on :8080
npm run dev:frontend   # Start frontend on :3000
```

## Application URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **MongoDB:** mongodb://localhost:27017

## Troubleshooting Socket.IO Issues

### Common Connection Errors:

1. **"error:roomNotFound"**
   - Room has expired or was deleted
   - Clear browser cookies and refresh
   - Create a new room

2. **WebSocket Connection Failed**
   - Ensure backend is running on port 8080
   - Check Docker logs: `npm run docker:logs`
   - Restart services: `npm run docker:down && npm run docker:dev`

3. **Session Issues**
   - Clear browser storage (F12 > Application > Storage)
   - Restart both frontend and backend

### Debug Tools:
- Browser console shows detailed Socket.IO logs
- Backend logs show connection attempts and room operations
- Enhanced error messages provide specific failure reasons

## Recent Fixes Applied:

✅ **Synchronization Issues:** Enhanced GameActivity component with better state management
✅ **Responsive Design:** Mobile-first CSS Grid layout with breakpoints
✅ **Player Indicators:** Added P1/P2/P3/P4 position labels
✅ **Development Workflow:** Simplified commands to avoid repeated docker-compose usage
✅ **Error Handling:** Better Socket.IO error messages and client-side handling
✅ **Debug Logging:** Comprehensive logging for troubleshooting connection issues

## Architecture Notes:
- **Frontend:** React 18 with Socket.IO client
- **Backend:** Node.js/Express with Socket.IO server  
- **Database:** MongoDB with 24-hour session storage
- **Real-time:** Socket.IO for game state synchronization
- **Containerization:** Docker Compose for consistent environments