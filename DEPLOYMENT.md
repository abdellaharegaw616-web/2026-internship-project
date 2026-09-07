# Quick Deployment Guide

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created
- [ ] Vercel account created
- [ ] Render account created

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Network Access → Allow Access from Anywhere (0.0.0.0/0)
4. Database Access → Create user (save credentials!)
5. Get connection string from Connect → Connect your application

## Step 2: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get Cloud Name, API Key, API Secret from Dashboard

## Step 3: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: taskflow-api
   - **Root Directory**: ./server
   - **Build Command**: npm install
   - **Start Command**: node src/server.js
   - **Environment**: Node
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow
   JWT_SECRET=<your-secret-key>
   CLIENT_URL=https://your-project.vercel.app
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   EMAIL_USER=<your-gmail>
   EMAIL_PASS=<your-app-password>
   ```
6. Deploy → Wait for completion
7. Copy backend URL (e.g., https://taskflow-api.onrender.com)

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Add New Project
3. Import GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./client
   - **Build Command**: npm run build
   - **Output Directory**: dist
5. Add Environment Variable:
   ```
   VITE_API_URL=https://taskflow-api.onrender.com
   ```
6. Deploy → Wait for completion
7. Copy frontend URL (e.g., https://your-project.vercel.app)

## Step 5: Update Backend Client URL

1. Go to Render Dashboard → taskflow-api
2. Environment Variables
3. Update CLIENT_URL to your Vercel URL
4. Redeploy backend

## Step 6: Test Deployment

1. Visit your Vercel URL
2. Test registration
3. Test login
4. Test file uploads
5. Test email (if configured)

## Environment Variables Reference

### Backend (Render)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-project.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_FROM=noreply@taskflow.com
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Troubleshooting

**Backend not starting?**
- Check Render logs
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist

**Frontend can't connect?**
- Verify VITE_API_URL in Vercel
- Check backend is running
- Verify CORS settings

**File uploads failing?**
- Check Cloudinary credentials
- Verify Cloudinary account status

## Cost Summary

All services used are on free tiers:
- Vercel: Free
- Render: Free
- MongoDB Atlas: Free (512MB)
- Cloudinary: Free (25GB storage)

**Total: $0/month**
