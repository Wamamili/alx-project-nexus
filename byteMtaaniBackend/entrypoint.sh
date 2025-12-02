#!/bin/sh

echo "Waiting for database..."
sleep 5

python manage.py migrate --noinput

if [ "$DJANGO_ENV" = "production" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

echo "Starting Gunicorn..."
# If a command is provided (e.g. celery worker/beat) run it, otherwise start gunicorn
if [ "$#" -gt 0 ]; then
    echo "Executing passed command: $@"
    exec "$@"
else
    exec gunicorn byteMtaaniBackend.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
