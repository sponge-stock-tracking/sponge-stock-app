# Render.com Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites

- GitHub repository: `sponge-stock-tracking/sponge-stock-app`
- Render.com account (sign up with GitHub)

### 2. Deploy Backend

#### Option A: Using render.yaml (Automated)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **Apply** to create all services

#### Option B: Manual Setup

1. **Create PostgreSQL Database**

   - Dashboard → New → PostgreSQL
   - Name: `sponge-stock-db`
   - Database: `sponge_stock`
   - User: `sponge_user`
   - Plan: Free
   - Region: Frankfurt (closest to Turkey)
   - Click **Create Database**

2. **Create Backend Service**

   - Dashboard → New → Web Service
   - Connect repository: `sponge-stock-tracking/sponge-stock-app`
   - Name: `sponge-stock-backend`
   - Region: Frankfurt
   - Branch: `main` (or `feature/backend`)
   - Root Directory: `backend`
   - Runtime: Docker
   - Plan: Free

   **Environment Variables:**

   ```
   DATABASE_URL=<copy from database internal connection string>
   SECRET_KEY=<generate random 32-char string>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   PYTHONUNBUFFERED=1
   ```

   - Click **Create Web Service**

3. **Run Database Migrations**
   - After deployment, go to backend service
   - Shell tab → Run:
   ```bash
   alembic upgrade head
   ```

### 3. Deploy Frontend

1. **Create Frontend Service**

   - Dashboard → New → Web Service
   - Connect same repository
   - Name: `sponge-stock-frontend`
   - Region: Frankfurt
   - Branch: `main`
   - Root Directory: `frontend`
   - Runtime: Docker
   - Plan: Free

   **Environment Variables:**

   ```
   NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
   ```

   - Click **Create Web Service**

### 4. Custom Domain (Optional)

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

## 📊 Expected Costs

### Free Tier Includes:

- ✅ 750 hours/month web service
- ✅ 90 days PostgreSQL data retention
- ✅ Automatic SSL certificates
- ✅ GitHub auto-deploy

### Limitations:

- ⚠️ Services sleep after 15 min inactivity
- ⚠️ Cold start: ~30 seconds
- ⚠️ 512 MB RAM per service

---

## 🔐 Generate SECRET_KEY

Run this to generate a secure secret key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Or use this pre-generated one (change in production):

```
your-secret-key-here-change-this-in-production-32chars
```

---

## 🧪 Test Deployment

After deployment, test these endpoints:

1. **Health Check:**

   ```
   https://sponge-stock-backend.onrender.com/
   ```

2. **API Docs:**

   ```
   https://sponge-stock-backend.onrender.com/docs
   ```

3. **Frontend:**
   ```
   https://sponge-stock-frontend.onrender.com
   ```

---

## 🐛 Troubleshooting

### Database Connection Issues

- Check `DATABASE_URL` format: `postgresql://user:password@host:5432/dbname`
- Use **Internal Database URL** from Render dashboard

### Build Failures

- Check logs in Render dashboard
- Verify Dockerfile paths
- Ensure dependencies in requirements.txt

### Frontend Can't Connect to Backend

- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend CORS settings in `backend/app/main.py`
- Backend should allow frontend origin

---

## 📝 Post-Deployment Checklist

- [ ] Database created and connected
- [ ] Backend deployed and healthy
- [ ] Database migrations run
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] CORS configured
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
