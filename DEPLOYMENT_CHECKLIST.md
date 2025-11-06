# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment to Heroku and Netlify.

---

## ✅ Pre-Deployment Checklist

### Backend Preparation
- [ ] `Procfile` created in backend folder
- [ ] `engines` field added to `backend/package.json`
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist set to `0.0.0.0/0` on MongoDB Atlas
- [ ] Strong JWT_SECRET generated
- [ ] All environment variables documented

### Frontend Preparation
- [ ] `netlify.toml` created in frontend folder
- [ ] Production API URL ready
- [ ] Build command tested locally (`npm run build`)
- [ ] All API endpoints use environment variable

---

## 🔧 Heroku Deployment Steps

### 1. Install Heroku CLI
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
# Or use npm:
npm install -g heroku
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
cd backend
heroku create your-app-name-api
```

### 4. Set Environment Variables
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Set variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-generated-secret"
heroku config:set MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/slotswapper"
heroku config:set CLIENT_URL="https://your-app.netlify.app"
```

### 5. Deploy Backend
```bash
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a your-app-name-api
git push heroku main
```

### 6. Verify Deployment
```bash
# Check logs
heroku logs --tail

# Test health endpoint
curl https://your-app-name-api.herokuapp.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

---

## 🌐 Netlify Deployment Steps

### 1. Create Production Environment File
Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-app-name-api.herokuapp.com/api
```

### 2. Option A: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from frontend folder
cd frontend
netlify deploy --prod

# Follow prompts:
# Build command: npm run build
# Publish directory: dist
```

### 3. Option B: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   
3. **Configure Build:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   
4. **Add Environment Variable:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-app-name-api.herokuapp.com/api`

5. **Deploy!**

### 4. Update Heroku with Netlify URL
```bash
heroku config:set CLIENT_URL="https://your-actual-site.netlify.app"
heroku restart
```

---

## ✅ Post-Deployment Verification

### Backend Tests
- [ ] Health endpoint responds: `/api/health`
- [ ] Can create user: `POST /api/auth/signup`
- [ ] Can login: `POST /api/auth/login`
- [ ] MongoDB connection working (check logs)
- [ ] Socket.IO initialized (check logs)
- [ ] CORS allows frontend URL

### Frontend Tests
- [ ] Site loads without errors
- [ ] Can signup new user
- [ ] Can login
- [ ] Can create events
- [ ] Can view marketplace
- [ ] Can send swap requests
- [ ] Real-time notifications work
- [ ] WebSocket connects (check browser console)

### Integration Tests
- [ ] Login from frontend works
- [ ] Create event from frontend works
- [ ] Swap request creates notification
- [ ] Accept/reject swap works
- [ ] Real-time updates appear

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'socket.io'"
**Solution:** Run `npm install` in backend folder before deploying

### Issue: CORS Error
**Solution:** 
```bash
heroku config:set CLIENT_URL="https://exact-netlify-url.netlify.app"
heroku restart
```

### Issue: MongoDB Connection Failed
**Solution:** 
- Check MONGO_URI is correct
- Verify IP whitelist includes `0.0.0.0/0`
- Check database user credentials

### Issue: WebSocket Not Connecting
**Solution:**
- Verify CLIENT_URL is set on Heroku
- Check browser console for errors
- Ensure frontend has correct VITE_API_URL

### Issue: Build Failed on Netlify
**Solution:**
- Check build logs in Netlify dashboard
- Verify `npm run build` works locally
- Check all dependencies are in `package.json`

---

## 📊 Monitoring

### View Heroku Logs
```bash
heroku logs --tail -a your-app-name-api
```

### View Netlify Logs
- Dashboard → Your Site → Deploys → Deploy log

### Check App Status
```bash
heroku ps -a your-app-name-api
```

---

## 🔄 Updating Your Deployed App

### Update Backend
```bash
cd backend
git add .
git commit -m "Update: description"
git push heroku main
```

### Update Frontend (GitHub Method)
```bash
cd frontend
git add .
git commit -m "Update: description"
git push origin main
# Netlify auto-deploys
```

### Update Frontend (CLI Method)
```bash
cd frontend
netlify deploy --prod
```

---

## 💰 Cost Summary

| Service | Free Tier | Paid Option |
|---------|-----------|-------------|
| MongoDB Atlas | 512 MB | $9/month (2GB) |
| Heroku | Sleeps after 30min | $7/month (always on) |
| Netlify | 100 GB bandwidth | $19/month (pro) |
| **Total** | **$0** | **$35/month** |

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at Netlify URL
- ✅ Can signup and login
- ✅ Can create and manage events
- ✅ Can browse marketplace
- ✅ Can send swap requests
- ✅ Real-time notifications appear
- ✅ No console errors
- ✅ All features work as in local development

---

## 📞 Need Help?

1. Check Heroku logs: `heroku logs --tail`
2. Check Netlify deploy logs in dashboard
3. Check browser console (F12)
4. Verify all environment variables
5. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide

---

**Good luck with your deployment! 🚀**
