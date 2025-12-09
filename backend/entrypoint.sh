#!/bin/bash
set -e

echo "⏳ [Backend] Starting Sponge Stock API with Supabase DB..."

# Wait a moment for network to be ready
sleep 2

echo "🔄 [Backend] Running Alembic migrations..."
if alembic upgrade head; then
    echo "✅ [Backend] Migrations completed successfully"
else
    echo "⚠️  [Backend] Migration failed or already applied"
fi

echo "🚀 [Backend] Starting FastAPI with uvicorn..."
# Note: Command is overridden in docker-compose for dev mode with --reload
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

