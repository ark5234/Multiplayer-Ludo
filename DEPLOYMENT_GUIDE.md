# 🚀 Multiplayer Ludo - Render Deployment Guide

This guide will help you deploy your Multiplayer Ludo game to Render for free hosting.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com) (free)

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

Make sure all files are committed and pushed to GitHub:
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Deploy Using Render Blueprint

1. **Go to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)

2. **Create New Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository: `Multiplayer-Ludo`
   - Render will automatically detect the `render.yaml` file

3. **Configure Services**:
   The blueprint will create:
   - **Backend API** (Node.js web service)
   - **Database** (Free MongoDB)
   - **Frontend** (Static site)

### Step 3: Environment Variables

The backend will automatically get these environment variables:
- `NODE_ENV=production`
- `PORT=10000`
- `CONNECTION_URI` (from MongoDB database)

### Step 4: Manual Deployment (Alternative)

If Blueprint doesn't work, deploy manually:

#### Deploy Backend:
1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect GitHub → Select repository
3. Configure:
   - **Name**: `multiplayer-ludo-backend`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

#### Deploy Frontend:
1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect GitHub → Select repository  
3. Configure:
   - **Name**: `multiplayer-ludo-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

#### Add Database:
1. Go to Render Dashboard → "New +" → "PostgreSQL" (or use MongoDB Atlas)
2. Plan: Free
3. Copy connection string to backend environment variables

## 🌐 URLs After Deployment

Your deployed application will be available at:
- **Frontend**: `https://multiplayer-ludo-frontend.onrender.com`
- **Backend API**: `https://multiplayer-ludo-backend.onrender.com`

## ⚙️ Configuration Details

### Environment Variables Configured:
- **Production CORS**: Allows frontend to communicate with backend
- **Dynamic Socket.IO**: Works with deployed URLs
- **MongoDB Connection**: Uses Render's managed database
- **Health Checks**: `/` and `/api/health` endpoints

### Key Features:
- ✅ **Free Hosting**: Both frontend and backend on free tier
- ✅ **Automatic HTTPS**: Render provides SSL certificates
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Auto Deployment**: Updates when you push to GitHub
- ✅ **MongoDB Database**: Persistent game data storage
- ✅ **WebSocket Support**: Real-time multiplayer gaming

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**: Check build logs in Render dashboard
2. **Backend Not Connecting**: Verify MongoDB connection string
3. **CORS Errors**: Check ALLOWED_ORIGINS environment variable
4. **Socket.IO Issues**: Verify SOCKET_IO_CORS_ORIGIN setting

### Debug Steps:
1. Check Render service logs
2. Test API health endpoint: `https://your-backend.onrender.com/api/health`
3. Verify environment variables are set correctly

## 🎮 Testing Your Deployed Game

1. **Open Frontend URL** in multiple browser tabs/devices
2. **Create Room** on one device
3. **Join Room** from other devices
4. **Start Playing** - test real-time features:
   - Dice rolling
   - Pawn movement
   - Live scoring
   - Player turns
   - Win conditions

## 💰 Cost

- **Free Tier Limits**:
  - Backend: 750 hours/month (enough for hobby projects)
  - Frontend: Unlimited bandwidth
  - Database: 1GB storage
  - Auto-sleep after 15 minutes of inactivity

## 🔄 Updates

To update your deployed app:
1. Make changes locally
2. `git push origin main`
3. Render automatically rebuilds and deploys

---

Your **Multiplayer Ludo game** is now ready for global deployment! 🌍🎯

Share the frontend URL with friends to start playing online multiplayer Ludo! 🎲✨