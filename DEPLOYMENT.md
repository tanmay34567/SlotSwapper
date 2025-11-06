# 🚀 Deployment Guide

This guide will help you deploy SlotSwapper to Heroku (backend) and Netlify (frontend).

---

## 📦 Part 1: Deploy Backend to Heroku

### Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- Heroku account created
- MongoDB Atlas account (free tier)

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs: `0.0.0.0/0` (for Heroku)
5. Get your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Heroku

```bash
# Navigate to backend folder
cd backend

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create slotswapper-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set MONGO_URI="your-mongodb-atlas-connection-string"
heroku config:set CLIENT_URL="https://your-netlify-app.netlify.app"

# Deploy
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a slotswapper-api
git push heroku main

# Check logs
heroku logs --tail
```

### Step 3: Verify Backend

Visit: `https://slotswapper-api.herokuapp.com/api/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

---

## 🌐 Part 2: Deploy Frontend to Netlify

### Step 1: Update Frontend Environment

Create `frontend/.env.production`:

```env
VITE_API_URL=https://slotswapper-api.herokuapp.com/api
```

### Step 2: Deploy to Netlify (Option A - CLI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend folder
cd frontend

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Build command: npm run build
# - Publish directory: dist
```

### Step 3: Deploy to Netlify (Option B - GitHub)

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://slotswapper-api.herokuapp.com/api`
7. Click "Deploy site"

### Step 4: Update Heroku with Netlify URL

```bash
# Update CLIENT_URL on Heroku
heroku config:set CLIENT_URL="https://your-actual-netlify-url.netlify.app" -a slotswapper-api

# Restart Heroku app
heroku restart -a slotswapper-api
```

---

## ✅ Verification Checklist

### Backend (Heroku)
- [ ] Health endpoint works: `/api/health`
- [ ] MongoDB connection successful
- [ ] Environment variables set correctly
- [ ] CORS allows your Netlify URL
- [ ] Socket.IO configured with CLIENT_URL

### Frontend (Netlify)
- [ ] Site loads without errors
- [ ] Can signup/login
- [ ] API calls work (check Network tab)
- [ ] WebSocket connects (check Console)
- [ ] Real-time notifications work

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MONGO_URI is set correctly
heroku config -a slotswapper-api

# View logs
heroku logs --tail -a slotswapper-api
```

**CORS Error:**
```bash
# Make sure CLIENT_URL matches your Netlify URL exactly
heroku config:set CLIENT_URL="https://your-app.netlify.app" -a slotswapper-api
```

### Frontend Issues

**API Connection Failed:**
1. Check `VITE_API_URL` in Netlify environment variables
2. Make sure it ends with `/api`
3. Redeploy after changing environment variables

**WebSocket Not Connecting:**
1. Check browser console for errors
2. Verify Heroku backend is running
3. Check if CLIENT_URL is set on Heroku

---

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable MongoDB IP whitelist (or use 0.0.0.0/0 for Heroku)
- [ ] Set NODE_ENV=production on Heroku
- [ ] Review CORS settings
- [ ] Enable HTTPS (automatic on Netlify/Heroku)
- [ ] Never commit `.env` files to Git

---

## 📊 Monitoring

### Heroku Logs
```bash
heroku logs --tail -a slotswapper-api
```

### Netlify Logs
- Go to Netlify Dashboard → Your Site → Deploys → Deploy log

---

## 💰 Cost Estimate

- **MongoDB Atlas**: Free (512 MB storage)
- **Heroku**: Free tier (sleeps after 30 min inactivity) or $7/month for Hobby tier
- **Netlify**: Free (100 GB bandwidth/month)

**Total**: $0-7/month

---

## 🔄 Updating Your App

### Backend Updates
```bash
cd backend
git add .
git commit -m "Update backend"
git push heroku main
```

### Frontend Updates
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main  # If using GitHub integration with Netlify
# OR
netlify deploy --prod  # If using Netlify CLI
```

---

## 📞 Support

If you encounter issues:
1. Check Heroku logs: `heroku logs --tail`
2. Check Netlify deploy logs in dashboard
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

## 🎉 Success!

Your SlotSwapper app is now live! Share your Netlify URL with users.

Example URLs:
- Frontend: `https://slotswapper.netlify.app`
- Backend: `https://slotswapper-api.herokuapp.com`
