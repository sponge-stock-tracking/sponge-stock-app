# Render.com Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites

- GitHub repository: `sponge-stock-tracking/sponge-stock-app`
- Supabase account with PostgreSQL database (See [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
- Render.com account (sign up with GitHub)
- Vercel account for frontend (See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md))

---

## 📊 Architecture Overview

```
Frontend (Vercel) → Backend (Render) → Database (Supabase)
   Next.js            FastAPI           PostgreSQL
    FREE               FREE                FREE
```

---

### 2. Setup Supabase Database FIRST

⚠️ **Important:** Create Supabase database before deploying to Render!

1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. Get connection string from: Project Settings → Database → Connection string (URI)
4. Use **Connection Pooler** URL (port 6543) for Render

**Detailed guide:** See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

---

### 3. Deploy Backend to Render

#### Option A: Using render.yaml (Automated) ⭐ RECOMMENDED

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository: `sponge-stock-tracking/sponge-stock-app`
4. Render will automatically detect `render.yaml`
5. **Add Environment Variables:**
   - `DATABASE_URL` - Your Supabase connection string
   - Other variables will be auto-configured
6. Click **Apply** to create backend service

#### Option B: Manual Setup

1. **Create Backend Service**

   - Dashboard → New → Web Service
   - Connect repository: `sponge-stock-tracking/sponge-stock-app`
   - Name: `sponge-stock-backend`
   - Region: Frankfurt (closest to Turkey/Europe)
   - Branch: `main` (or `feature/backend`)
   - Root Directory: `backend`
   - Runtime: Docker
   - Plan: Free

   **Environment Variables:**

   ```bash
   # Supabase Database (REQUIRED)
   DATABASE_URL=postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

   # JWT Authentication
   SECRET_KEY=<use generated key from deploy-prepare.sh>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7

   # Application
   APP_NAME=Sponge Stock API
   APP_ENV=production
   LOG_LEVEL=INFO
   PYTHONUNBUFFERED=1

   # CORS - Update with your Vercel URL
   CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
   ```

   - Click **Create Web Service**

2. **Run Database Migrations**
   - After deployment completes
   - Go to backend service → **Shell** tab
   - Run:
   ```bash
   alembic upgrade head
   ```

---

### 4. Deploy Frontend to Vercel

⚠️ **Frontend is deployed on Vercel, NOT Render!** (Free tier optimization)

See detailed guide: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

**Quick steps:**

1. Go to [vercel.com](https://vercel.com)
2. New Project → Import GitHub repo
3. Root Directory: `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
   ```
5. Deploy!

---

### 5. Update Backend CORS

After deploying frontend to Vercel:

1. Get your Vercel URL (e.g., `https://sponge-stock-app.vercel.app`)
2. Update `CORS_ORIGINS` in Render backend:
   ```
   CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
   ```
3. Redeploy backend if needed

---

### 6. Custom Domain (Optional)

- Go to Settings → Custom Domain
- Add your domain
- Update DNS records

---

## 🔧 Configuration Files Already Prepared

### ✅ Backend Dockerfile

- Located: `backend/Dockerfile`
- Already configured for production

### ✅ Frontend Dockerfile

- Located: `frontend/Dockerfile`
- pnpm support added

### ✅ Environment Variables

- Backend `.env.example` provided
- Update values in Render dashboard

---

## 📊 Deployment Costs

### ✅ 100% FREE Setup:

| Service  | Platform   | Cost   | What's Included                 |
| -------- | ---------- | ------ | ------------------------------- |
| Backend  | Render.com | **$0** | 750 hours/month, Auto SSL       |
| Frontend | Vercel.com | **$0** | Unlimited bandwidth, Global CDN |
| Database | Supabase   | **$0** | 500MB storage, 2GB bandwidth    |

**Total Monthly Cost: $0** 🎉

### Limitations:

#### Render.com (Backend):

- ⚠️ Services sleep after 15 min inactivity
- ⚠️ Cold start: ~30 seconds
- ⚠️ 512 MB RAM

#### Supabase (Database):

- ⚠️ 500 MB database storage
- ⚠️ 2 GB bandwidth/month
- ⚠️ 7 days log retention

#### Vercel (Frontend):

- ✅ No significant limitations for this project size!

---

## 🔐 Generate SECRET_KEY

Run this to generate a secure secret key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Or use the helper script:

```bash
./deploy-prepare.sh
```

Or use this pre-generated one (change in production):

```
your-secret-key-here-change-this-in-production-32chars
```

---

## 🧪 Test Deployment

After deployment, test these endpoints:

1. **Backend Health Check:**

   ```
   https://sponge-stock-backend.onrender.com/
   ```

2. **API Documentation:**

   ```
   https://sponge-stock-backend.onrender.com/docs
   ```

3. **Frontend Application:**

   ```
   https://sponge-stock-app.vercel.app
   ```

4. **Supabase Database:**
   - Login to Supabase dashboard
   - Check tables were created by migrations
   - View data in Table Editor

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** Backend can't connect to Supabase

**Solutions:**

- ✅ Verify DATABASE_URL format is correct
- ✅ Use **Connection Pooler** URL (port 6543), not direct connection
- ✅ Check password has no special characters that need escaping
- ✅ Ensure Supabase project is not paused
- ✅ Try adding `?sslmode=require` to connection string

**Example correct format:**

```
postgresql://postgres.abcdef:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Migration Failures

**Problem:** `alembic upgrade head` fails

**Solutions:**

- ✅ Use **direct connection** (port 5432) for migrations
- ✅ Check if tables already exist in Supabase
- ✅ Verify alembic_version table exists
- ✅ Run migrations from local machine first

### Build Failures

- Check logs in Render dashboard
- Verify Dockerfile paths
- Ensure dependencies in requirements.txt

### Frontend Can't Connect to Backend

**Problem:** CORS errors or API requests fail

**Solutions:**

- ✅ Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- ✅ Verify backend CORS_ORIGINS includes Vercel URL
- ✅ Ensure backend is running (not sleeping)
- ✅ Check browser console for exact error
- ✅ Test backend API directly first (visit /docs)

### Cold Start Issues

**Problem:** Backend takes 30+ seconds to respond

**Solutions:**

- ✅ This is normal for Render free tier after 15 min inactivity
- ✅ Use UptimeRobot to ping backend every 14 minutes
- ✅ Or upgrade to paid tier ($7/month)

---

## 📝 Post-Deployment Checklist

- [ ] Supabase project created
- [ ] Supabase connection string obtained
- [ ] Backend deployed on Render
- [ ] Environment variables configured
- [ ] Database migrations run successfully
- [ ] Frontend deployed on Vercel
- [ ] CORS origins updated
- [ ] Test user can login
- [ ] Create initial sponge types
- [ ] Test stock movements

---

## 🔄 Auto-Deploy Setup

Render automatically deploys when you push to GitHub:

1. Push to `main` branch triggers production deploy
2. Push to `feature/backend` triggers staging (if configured)

To disable auto-deploy:

- Service Settings → Build & Deploy → Auto-Deploy: OFF

---

## 💡 Pro Tips

1. **Keep services warm**: Use UptimeRobot or similar to ping every 14 minutes
2. **Monitor logs**: Check Render logs for errors
3. **Use staging**: Test on feature branch before merging to main
4. **Database backups**: Enable in database settings

---

## 🆘 Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check project issues on GitHub

---

## 🎯 Next Steps

1. Merge `feature/backend` to `main` branch
2. Follow deployment steps above
3. Test thoroughly
4. Share the URL with your team!

Good luck! 🚀
