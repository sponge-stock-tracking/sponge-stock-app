# 🚀 Deployment Guide - Quick Reference

## 📊 Recommended Architecture (100% FREE)

```
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT STACK                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (Next.js)  →  Backend (FastAPI)  →  Database  │
│     VERCEL.COM           RENDER.COM          SUPABASE    │
│       FREE                  FREE               FREE       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Deployment Order

Follow these steps in order:

### 1️⃣ Database Setup (Supabase)

📖 **Guide:** [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

```bash
✅ Create Supabase project
✅ Get connection string (use pooler URL)
✅ Save password securely
```

**Time:** 5 minutes

---

### 2️⃣ Backend Deployment (Render)

📖 **Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

```bash
✅ Connect GitHub to Render
✅ Create Web Service (Docker)
✅ Add environment variables (especially DATABASE_URL)
✅ Deploy backend
✅ Run migrations: alembic upgrade head
```

**Time:** 10 minutes

---

### 3️⃣ Frontend Deployment (Vercel)

📖 **Guide:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

```bash
✅ Connect GitHub to Vercel
✅ Set root directory: frontend
✅ Add NEXT_PUBLIC_API_URL environment variable
✅ Deploy frontend
```

**Time:** 5 minutes

---

### 4️⃣ Final Configuration

```bash
✅ Update backend CORS with Vercel URL
✅ Test all endpoints
✅ Create first user
✅ Done! 🎉
```

---

## 🔑 Required Environment Variables

### Backend (Render.com)

```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Sponge Stock API
APP_ENV=production
LOG_LEVEL=INFO
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

### Frontend (Vercel.com)

```bash
NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
```

---

## 🛠️ Helper Scripts

### Generate Environment Variables

```bash
./deploy-prepare.sh
```

This will:

- Generate SECRET_KEY
- Check Docker files
- Show all required environment variables
- Display deployment checklist

---

## 📚 Detailed Guides

| Component | Platform | Guide                                        | Status   |
| --------- | -------- | -------------------------------------------- | -------- |
| Database  | Supabase | [SUPABASE_SETUP.md](SUPABASE_SETUP.md)       | ✅ Ready |
| Backend   | Render   | [DEPLOYMENT.md](DEPLOYMENT.md)               | ✅ Ready |
| Frontend  | Vercel   | [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | ✅ Ready |

---

## 💰 Cost Breakdown

| Service      | Free Tier          | Limits                        |
| ------------ | ------------------ | ----------------------------- |
| **Supabase** | ✅ Free Forever    | 500MB DB, 2GB bandwidth       |
| **Render**   | ✅ Free 750h/month | 512MB RAM, sleeps after 15min |
| **Vercel**   | ✅ Free Forever    | Unlimited for hobby projects  |

**Total Monthly Cost: $0** 🎉

---

## 🧪 Testing Deployment

After deploying all components:

1. **Backend Health Check:**

   ```
   https://sponge-stock-backend.onrender.com/
   Expected: {"message": "Welcome to the Sponge Stock Management API!"}
   ```

2. **API Documentation:**

   ```
   https://sponge-stock-backend.onrender.com/docs
   Expected: Interactive Swagger UI
   ```

3. **Frontend:**

   ```
   https://sponge-stock-app.vercel.app
   Expected: Login page loads
   ```

4. **Database (via Supabase Dashboard):**
   - Login to Supabase
   - Check tables exist (users, sponges, stocks, etc.)
   - Table Editor should show schema

---

## 🐛 Common Issues & Solutions

### 1. Backend can't connect to database

```
❌ Error: could not connect to server
✅ Solution: Check DATABASE_URL uses pooler port (6543)
✅ Verify Supabase project is active
```

### 2. Frontend shows blank page

```
❌ Error: Network error or CORS issue
✅ Solution: Check NEXT_PUBLIC_API_URL in Vercel
✅ Update CORS_ORIGINS in Render to include Vercel URL
```

### 3. Backend takes forever to respond

```
❌ Error: Timeout or very slow response
✅ Solution: Render free tier sleeps after 15min inactivity
✅ First request after sleep takes ~30 seconds (cold start)
✅ Use UptimeRobot to keep it warm
```

### 4. Migrations fail

```
❌ Error: alembic upgrade head fails
✅ Solution: Use direct connection (port 5432) for migrations
✅ Check if tables already exist
```

---

## 📞 Getting Help

1. **Check logs:**

   - Render: Service → Logs tab
   - Vercel: Deployment → Function Logs
   - Supabase: Dashboard → Database → Logs

2. **Documentation:**

   - Each platform has detailed docs linked in guides
   - Check project README.md

3. **GitHub Issues:**
   - Report bugs: [github.com/sponge-stock-tracking/sponge-stock-app/issues](https://github.com/sponge-stock-tracking/sponge-stock-app/issues)

---

## ✅ Deployment Checklist

Copy this checklist and check off as you go:

```
PREPARATION:
[ ] Code pushed to GitHub
[ ] Run ./deploy-prepare.sh
[ ] Save generated SECRET_KEY

DATABASE (Supabase):
[ ] Account created
[ ] Project created
[ ] Connection string saved
[ ] Using pooler URL (port 6543)

BACKEND (Render):
[ ] Account created
[ ] Web service created
[ ] All environment variables added
[ ] Deployment successful
[ ] Migrations run (alembic upgrade head)
[ ] /docs endpoint works

FRONTEND (Vercel):
[ ] Account created
[ ] Project imported
[ ] Root directory set to 'frontend'
[ ] NEXT_PUBLIC_API_URL configured
[ ] Deployment successful
[ ] Site loads in browser

FINAL:
[ ] Login works end-to-end
[ ] Can create sponge types
[ ] Can add stock movements
[ ] Backend CORS includes Vercel URL
[ ] All features tested
[ ] 🎉 DONE!
```

---

## 🎯 What's Next?

After successful deployment:

1. **Create Admin User** (via API or Supabase dashboard)
2. **Add Initial Data** (sponge types, etc.)
3. **Share URL** with your team
4. **Monitor** logs and performance
5. **Set up Custom Domain** (optional)
6. **Enable Backups** in Supabase

---

## 📖 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Good luck with your deployment! 🚀**

_Last updated: December 2025_
