# Copilot Instructions for Sponge Stock App

## Project Overview

- **Monorepo**: Contains `backend/` (FastAPI, PostgreSQL) and `frontend/` (Next.js, React) for a sponge stock tracking system.
- **Purpose**: Real-time tracking of sponge inventory, batch operations, critical stock alerts, and weekly reporting.
- **Deployment**: Designed for free-tier cloud (Vercel for frontend, Render for backend, Supabase for DB). See `DEPLOYMENT_TR.md` and related guides.

## Architecture & Key Patterns

- **Backend**
  - FastAPI app in `backend/app/` with modular structure: `models/`, `schemas/`, `repositories/`, `services/`, `routers/`.
  - Auth: JWT (python-jose), refresh tokens, role-based access (admin/operator/viewer).
  - DB migrations: Alembic (`backend/migrations/`).
  - Email notifications for critical stock via `notification_service.py`.
  - All API endpoints are versioned and grouped by resource (see `routers/`).
- **Frontend**
  - Next.js app in `frontend/` using React 19, TypeScript, and Radix UI.
  - Auth context in `context/auth-context.tsx` manages login state and tokens.
  - API calls via `api/axios.ts` with auto token refresh and error handling.
  - UI state and notifications handled via context/hooks (`use-toast`, `Toaster`).
  - Uses `@/*` path alias (see `tsconfig.json`).

## Developer Workflows

- **Backend**
  - Start with Docker: `docker compose up -d` (from repo root).
  - Local dev: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` in `backend/`.
  - Migrations: `alembic upgrade head` (after DB/model changes).
  - Tests: `pytest` in `backend/tests/`.
  - Env setup: Copy `env.example` to `.env` and edit as needed.
- **Frontend**
  - Dev server: `pnpm dev` (port 3003 by default).
  - Build: `pnpm build`.
  - Lint: `pnpm lint`.
  - Uses environment variable `NEXT_PUBLIC_API_URL` for backend API base URL.

## Conventions & Integration

- **API**: All requests require JWT in `Authorization` header. Refresh handled transparently in frontend.
- **DB**: PostgreSQL schema managed via Alembic. See `backend/models/` and `migrations/`.
- **Component Structure**: Frontend UI is modular, with domain-specific folders under `components/`.
- **Testing**: Backend uses Pytest with fixtures in `conftest.py`.
- **Deployment**: See `render.yaml`, `vercel.json`, and deployment guides for cloud setup.

## References

- [README.md](../README.md) (project overview)
- [backend/README.md](../backend/README.md) (backend details)
- [DEPLOYMENT_TR.md](../DEPLOYMENT_TR.md) (deployment)
- [SUPABASE_KURULUM.md](../SUPABASE_KURULUM.md) (DB setup)
- [frontend/api/axios.ts](../frontend/api/axios.ts) (API integration)
- [frontend/context/auth-context.tsx](../frontend/context/auth-context.tsx) (auth logic)

---

**For AI agents:**

- Follow the modular structure and existing patterns for new features.
- Reference the above files for examples of API, auth, and data flow.
- Use Docker and provided scripts for consistent local/dev environments.
- When in doubt, prefer explicit, documented conventions over assumptions.
