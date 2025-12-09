# Vercel Frontend Deployment Guide

## 🚀 Deploy Frontend to Vercel (Free)

### Why Vercel for Frontend?

- ✅ **100% Free** for personal projects
- ✅ **Perfect for Next.js** (made by Vercel)
- ✅ **Auto-deploy** from GitHub
- ✅ **Global CDN** - super fast
- ✅ **No cold starts**
- ✅ **Unlimited bandwidth**

---

## 📋 Deployment Steps

### 1. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### 2. Import Project

1. Click **"Add New Project"**
2. Select repository: `sponge-stock-tracking/sponge-stock-app`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

### 3. Environment Variables

Add in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
```

**Important:** This should match your Render backend URL!

### 4. Deploy

1. Click **"Deploy"**
2. Wait ~2-3 minutes
3. Your app will be live at: `https://your-project.vercel.app`

---

## 🔧 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 🔄 Auto-Deploy

Vercel automatically deploys:

- **Production:** When you push to `main` branch
- **Preview:** When you push to feature branches

---

## 📊 Recommended Setup

### Backend (Render.com - Free)

- FastAPI API
- PostgreSQL Database
- URL: `https://sponge-stock-backend.onrender.com`

### Frontend (Vercel - Free)

- Next.js App
- URL: `https://sponge-stock-app.vercel.app`

**Total Cost: $0** 🎉

---

## ⚙️ Post-Deployment

### Update Backend CORS

After deploying to Vercel, update backend `.env` on Render:

```
CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
```

### Test

1. Visit: `https://sponge-stock-app.vercel.app`
2. Login with test credentials
3. Verify API connection works

---

## 🐛 Troubleshooting

### Build Errors

- Check build logs in Vercel dashboard
- Verify `pnpm-lock.yaml` is committed
- Ensure all dependencies in `package.json`

### API Connection Fails

- Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Check backend CORS settings
- Ensure backend is running on Render

### Environment Variables Not Working

- Environment variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after adding new env vars

---

## 💡 Pro Tips

1. **Use Production Branch:**

   - `main` → Production deployment
   - `feature/*` → Preview deployments

2. **Preview Deployments:**

   - Every PR gets a unique preview URL
   - Perfect for testing before merge

3. **Analytics:**

   - Enable Vercel Analytics in dashboard
   - Free for hobby projects

4. **Performance:**
   - Vercel automatically optimizes images
   - CDN caching globally

---

## 📝 Checklist

- [ ] Vercel account created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Environment variable added
- [ ] Deployed successfully
- [ ] Backend CORS updated
- [ ] Test login works
- [ ] Custom domain added (optional)

---

## 🎯 Next Steps After Deployment

1. Share URL with team
2. Test all features
3. Monitor logs in Vercel dashboard
4. Set up custom domain (optional)
5. Enable analytics (optional)

Good luck! 🚀
