#!/bin/bash
set -e

echo "⏳ [Backend] Starting with Supabase DB..."

# pg_isready kaldırıldı (Supabase için gereksiz)

echo "🔄 [Backend] Running Alembic migrations..."
alembic upgrade head || echo "⚠ Alembic migration failed (maybe already applied)"

echo "🚀 [Backend] Starting API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
