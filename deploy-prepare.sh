#!/bin/bash

# Render.com Deployment Helper Script
# This script helps prepare your project for Render deployment

set -e

echo "🚀 Render.com Deployment Preparation"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is clean
echo "📋 Checking git status..."
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        git push origin $(git branch --show-current)
        echo -e "${GREEN}✅ Changes committed and pushed${NC}"
    fi
fi

# Generate SECRET_KEY
echo ""
echo "🔐 Generating SECRET_KEY..."
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
echo -e "${GREEN}Your SECRET_KEY: ${SECRET_KEY}${NC}"
echo ""
echo "💾 Save this key! You'll need it in Render dashboard."
echo ""

# Check Docker files
echo "🐳 Checking Docker configuration..."
if [ -f "backend/Dockerfile" ]; then
    echo -e "${GREEN}✅ Backend Dockerfile found${NC}"
else
    echo -e "${RED}❌ Backend Dockerfile missing${NC}"
    exit 1
fi

if [ -f "frontend/Dockerfile" ]; then
    echo -e "${GREEN}✅ Frontend Dockerfile found${NC}"
else
    echo -e "${RED}❌ Frontend Dockerfile missing${NC}"
    exit 1
fi

# Check render.yaml
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ render.yaml found${NC}"
else
    echo -e "${YELLOW}⚠️  render.yaml not found (optional)${NC}"
fi

# Environment variables template
echo ""
echo "📝 Backend Environment Variables for Render:"
echo "=============================================="
echo "DATABASE_URL=<Get from Supabase: Project Settings → Database → Connection string (URI)>"
echo "           Example: postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
echo "SECRET_KEY=$SECRET_KEY"
echo "ALGORITHM=HS256"
echo "ACCESS_TOKEN_EXPIRE_MINUTES=30"
echo "REFRESH_TOKEN_EXPIRE_DAYS=7"
echo "APP_NAME=Sponge Stock API"
echo "APP_ENV=production"
echo "LOG_LEVEL=INFO"
echo "PYTHONUNBUFFERED=1"
echo "CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000"
echo ""

echo "📝 Frontend Environment Variables for Render:"
echo "=============================================="
echo "NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com"
echo ""

# Final checklist
echo "✅ Pre-Deployment Checklist:"
echo "======================================"
echo "[ ] Code pushed to GitHub"
echo "[ ] Supabase project created (free tier)"
echo "[ ] Supabase DATABASE_URL obtained"
echo "[ ] Render account created"
echo "[ ] Backend web service created on Render"
echo "[ ] Environment variables set on Render"
echo "[ ] Database migrations run (alembic upgrade head)"
echo "[ ] Vercel account created"
echo "[ ] Frontend deployed on Vercel"
echo "[ ] CORS_ORIGINS updated with Vercel URL"
echo ""

echo -e "${GREEN}🎉 You're ready to deploy!${NC}"
echo ""
echo "📖 Deployment Order:"
echo "1. Create Supabase project → See SUPABASE_SETUP.md"
echo "2. Deploy Backend to Render → See DEPLOYMENT.md"
echo "3. Run database migrations"
echo "4. Deploy Frontend to Vercel → See VERCEL_DEPLOYMENT.md"
echo ""
echo "🔑 Use the SECRET_KEY generated above in Render"
echo "📚 Full guides available in project root"
echo ""
