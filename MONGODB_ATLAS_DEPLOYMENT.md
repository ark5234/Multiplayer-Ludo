# 🔧 Alternative: MongoDB Atlas + Render Deployment

If you prefer to keep using MongoDB instead of PostgreSQL, here's how to deploy with MongoDB Atlas (free tier) + Render:

## 🍃 Step 1: Setup MongoDB Atlas (Free)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create free account** and new cluster
3. **Configure Database**:
   - Choose M0 Sandbox (Free tier)
   - Select closest region
   - Create cluster (takes 1-3 minutes)
4. **Setup Database Access**:
   - Create database user (username/password)
   - Add IP address: `0.0.0.0/0` (allow all - for Render)
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy MongoDB URI: `mongodb+srv://username:password@cluster.mongodb.net/multiplayer-ludo`

## 🚀 Step 2: Deploy to Render with MongoDB Atlas

### Backend Deployment:
1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect GitHub → Select your repository
3. Configure:
   - **Name**: `multiplayer-ludo-backend`
   - **Environment**: Node  
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `CONNECTION_URI` = `mongodb+srv://username:password@cluster.mongodb.net/multiplayer-ludo`
   - `ALLOWED_ORIGINS` = `https://your-frontend-url.onrender.com`
   - `SOCKET_IO_CORS_ORIGIN` = `https://your-frontend-url.onrender.com`

### Frontend Deployment:
1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect GitHub → Select your repository
3. Configure:
   - **Name**: `multiplayer-ludo-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. **Environment Variables**:
   - `REACT_APP_BACKEND_URL` = `https://your-backend-url.onrender.com`

## ✅ Benefits of MongoDB Atlas + Render:

- ✅ **Keep existing MongoDB code** (no database changes needed)
- ✅ **Free MongoDB** 512MB storage
- ✅ **Better performance** than PostgreSQL conversion
- ✅ **Familiar database** structure
- ✅ **Global clusters** available

## 🔄 Update Backend URLs:

After deployment, update the environment variables with actual URLs:

**Backend Environment Variables:**
```
ALLOWED_ORIGINS=https://multiplayer-ludo-frontend.onrender.com
SOCKET_IO_CORS_ORIGIN=https://multiplayer-ludo-frontend.onrender.com
```

**Frontend Environment Variables:**
```
REACT_APP_BACKEND_URL=https://multiplayer-ludo-backend.onrender.com
```

This approach keeps your MongoDB setup intact and is often more reliable than Blueprint deployment! 🎯