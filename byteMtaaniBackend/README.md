# Byte Mtaani Backend — Docker Usage

This README explains how to run the Django backend using Docker (dev and production modes).

Prerequisites
- Docker & Docker Compose installed
- Copy `.env.example` to `.env` and update values:

```bash
cd byteMtaaniBackend
cp .env.example .env
# edit .env to set SECRET_KEY and other values
```

Development (recommended for local work)
- `docker compose` uses `DJANGO_ENV=development` so the container runs `manage.py runserver` and mounts the source.

```bash
# build and run
docker compose up --build
```

The app will be available at `http://localhost:8000`.

Production (build image that runs Gunicorn)
- Ensure `.env` sets `DJANGO_ENV=production`

```bash
# build image
docker compose build web
# run
docker compose up -d
```

Running management commands
- Run `makemigrations`, `migrate`, `createsuperuser` either from host (if you have Python deps installed) or using docker exec:

```bash
# run inside running container
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate
docker compose exec web python manage.py createsuperuser
```

Notes
- `entrypoint.sh` runs migrations automatically on container start. In development mode it starts Django dev server; in production it starts Gunicorn.
- The container runs as a non-root `appuser`.
- To use the local Postgres/Redis services in `docker-compose.yml`, keep the default `.env` values or update to your production credentials.

Troubleshooting
- If migrations fail due to DB not ready, wait a few seconds and retry the migrate command.
- To view logs:

```bash
docker compose logs -f web
```

Security and production notes
- Use `.env.production` (based on `.env.production.example`) for production environment variables. Do NOT commit secrets to the repository.
- The container will refuse to start in production (`DEBUG=False`) if `SECRET_KEY` is not set to a secure value.

Want me to add a `Makefile` with convenient commands (build, up, down, logs)? I can add that next.
