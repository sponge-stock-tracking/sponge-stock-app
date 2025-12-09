# 🚀 Development Guide

## Quick Start (Recommended)

### Backend (Docker)

```bash
# Start only backend in Docker
docker compose up -d

# View logs
docker compose logs -f backend
```

### Frontend (Local)

```bash
cd frontend
npm run dev
# or
pnpm dev
```

**Why?**

- ✅ Better hot-reload performance
- ✅ Easier debugging with browser DevTools
- ✅ No CORS issues (both on localhost)
- ✅ Faster builds and restarts

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Alternative: Full Docker Setup

If you want to run everything in Docker:

```bash
docker compose --profile full up -d
```

**Note**: Browser requests still go to `localhost:8000` for API, so this works fine.

## Common Tasks

### Backend

```bash
# Restart backend only
docker compose restart backend

# View backend logs
docker compose logs -f backend

# Access backend container
docker compose exec backend bash

# Run migrations
docker compose exec backend alembic upgrade head

# Create new migration
docker compose exec backend alembic revision --autogenerate -m "description"

# Run tests
docker compose exec backend pytest
```

### Frontend

```bash
# Local dev server
cd frontend
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Clear cache
rm -rf .next node_modules/.cache
```

## Environment Variables

### Backend (.env in backend/)

```bash
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend

```bash
# In browser, API is always on localhost
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

### "Network Error" in Frontend

- ✅ Make sure backend is running: `docker compose ps`
- ✅ Check backend logs: `docker compose logs backend`
- ✅ Verify API is accessible: `curl http://localhost:8000/docs`
- ✅ Run frontend locally (not in Docker) for development

### Port Already in Use

```bash
# Kill processes on ports 3000 or 8000
lsof -ti:3000,8000 | xargs kill -9

# Or use different ports in docker-compose.yml
```

### Database Connection Error

```bash
# Check .env file exists and has correct DATABASE_URL
cat backend/.env

# Restart backend
docker compose restart backend
```

### Frontend Build Fails

```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Code Changes & Hot Reload

### Backend

- ✅ Automatic with `--reload` flag in docker-compose.yml
- Changes to `app/` directory are detected instantly
- No need to restart container

### Frontend (Local)

- ✅ Automatic with Next.js dev server
- Changes are reflected immediately
- Fast Refresh for React components

## Testing

### Backend Tests

```bash
docker compose exec backend pytest -v

# With coverage
docker compose exec backend pytest --cov=app
```

### Manual API Testing

```bash
# List all sponges
curl http://localhost:8000/sponges/

# Health check
curl http://localhost:8000/

# With auth token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/stocks/summary
```

## Production Deployment

For production, build optimized images:

```bash
# Build production images (separate Dockerfiles recommended)
docker compose -f docker-compose.prod.yml build

# Run in production mode
docker compose -f docker-compose.prod.yml up -d
```

## Tips

1. **Use local frontend for development** - Much faster and easier to debug
2. **Keep backend in Docker** - Consistent environment with proper PostgreSQL setup
3. **Watch the logs** - `docker compose logs -f` helps catch issues early
4. **Clear caches** when things get weird - Both Next.js and Docker
5. **Use the API docs** - http://localhost:8000/docs is your friend

## VS Code Settings

Recommended extensions:

- Python
- Pylance
- ESLint
- Prettier
- Docker
- GitLens

Recommended settings.json:

```json
{
  "python.defaultInterpreterPath": "backend/.venv/bin/python",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```
