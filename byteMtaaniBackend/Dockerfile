# Multi-stage Dockerfile with dev/prod mode and non-root user
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
 && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt

FROM deps AS builder
COPY . /app
RUN addgroup --system app && adduser --system --ingroup app appuser || true
RUN chown -R appuser:app /app || true

FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 curl && rm -rf /var/lib/apt/lists/*

# Copy installed packages from deps stage
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
# Copy console entrypoints (gunicorn, celery, etc.) installed by pip
COPY --from=deps /usr/local/bin /usr/local/bin
# Some images may install packages into dist-packages instead of site-packages
# (dist-packages fallback removed to avoid build-time errors on images
# where the directory does not exist)

# Copy application files
COPY --from=builder /app /app

# Create non-root user and set permissions
RUN addgroup --system app && adduser --system --ingroup app appuser || true
RUN chown -R appuser:app /app || true

# Entrypoint script will run migrations then start server based on DJANGO_ENV
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER appuser
ENV DJANGO_ENV=production
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
