#!/bin/bash
set -e

echo "📦 [Backend] Waiting for database to be ready..."

# Veritabanı hazır olana kadar bekle
until pg_isready -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}"; do
  sleep 1
done

echo "🔄 [Backend] Running Alembic migrations..."
alembic upgrade head

echo "🚀 [Backend] Starting API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
