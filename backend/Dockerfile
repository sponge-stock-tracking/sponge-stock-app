# syntax=docker/dockerfile:1

FROM python:3.11-slim

WORKDIR /app

# Sistem paketleri (psycopg2 için gerekli)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıkları
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Kod kopyala
COPY . .

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

