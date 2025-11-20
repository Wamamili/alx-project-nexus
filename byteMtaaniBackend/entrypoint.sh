#!/bin/sh
set -e

# simple entrypoint: run migrations then start server according to DJANGO_ENV
if [ "$DJANGO_ENV" = "development" ]; then
  echo "Running in development mode"
  python manage.py migrate --noinput || true
  exec python manage.py runserver 0.0.0.0:8000
else
  echo "Running in production mode"
  python manage.py migrate --noinput || true
  exec gunicorn byteMtaaniBackend.wsgi:application --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-3}
fi
