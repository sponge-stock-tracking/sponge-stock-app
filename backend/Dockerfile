# syntax=docker/dockerfile:1

FROM python:3.11-slim

WORKDIR /app

# Sistem paketleri (psycopg2 için gerekli)
RUN apt-get update && apt-get install -y \
    libpq-dev gcc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Python bağımlılıkları
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kod
COPY . .

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PYTHONPATH=/app

ENTRYPOINT ["/entrypoint.sh"]
