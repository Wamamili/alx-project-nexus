#!/bin/bash
set -e

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run Celery if first argument is "celery"
if [ "$1" = "celery" ]; then
    shift
    echo "Starting Celery: $@"
    exec celery "$@"
else
    echo "Starting Gunicorn..."
    exec gunicorn byteMtaaniBackend.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 2
fi
