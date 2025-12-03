# Render Deployment Guide for Byte Mtaani Backend

This guide walks you through deploying the byteMtaani backend to Render with Celery support.

## Prerequisites

- A Render account (https://render.com)
- A PostgreSQL database (Render provides this)
- A Redis instance (Render provides this)
- GitHub repository with the code

## Services to Deploy

The `render.yaml` file defines:

1. **byteMtaani-backend** (Web): Django application with Gunicorn
2. **byteMtaani-celery-worker** (Background): Celery worker for async tasks
3. **byteMtaani-celery-beat** (Background): Celery Beat scheduler for periodic tasks

## Deployment Steps

### 1. Push to GitHub

Ensure your code is committed and pushed to the main/master branch:

```bash
git add .
git commit -m "Configure Render deployment with Celery"
git push origin master
```

### 2. Create Services in Render Dashboard

#### Step 2a: Create PostgreSQL Database

1. Go to **Render Dashboard** → **New** → **PostgreSQL**
2. Set name: `bytemtaani-db`
3. Region: `Oregon` (or your preference)
4. Select plan: `Standard` (recommended for production)
5. Click **Create Database**
6. Copy the internal database URL (you'll need this)

#### Step 2b: Create Redis Cache

1. Go to **Render Dashboard** → **New** → **Redis**
2. Set name: `bytemtaani-redis`
3. Region: `Oregon` (match database region)
4. Select plan: `Standard`
5. Click **Create Redis**
6. Copy the Redis URL (format: `redis://:password@host:port`)

#### Step 2c: Deploy Backend Service

1. Go to **Render Dashboard** → **New** → **Web Service**
2. Connect your GitHub repository
3. Set name: `byteMtaani-backend`
4. Select runtime: `Docker`
5. Set branch: `master`
6. Set Dockerfile path: `byteMtaaniBackend/Dockerfile`
7. Select plan: `Standard`
8. Under **Environment**, add these variables:

```
SECRET_KEY=<generate-a-secure-random-key>
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,byteMtaani-backend.onrender.com,<frontend-url>
DATABASE_URL=<PostgreSQL internal URL from step 2a>
REDIS_URL=<Redis URL from step 2b>
CORS_ALLOWED_ORIGINS=https://<your-frontend-service>.onrender.com
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

9. Click **Create Web Service**
10. Monitor the build logs; migrations will run automatically via `entrypoint.sh`

#### Step 2d: Deploy Celery Worker

1. Go to **Render Dashboard** → **New** → **Background Job**
2. Connect your GitHub repository (same repo)
3. Set name: `byteMtaani-celery-worker`
4. Set branch: `master`
5. Set Dockerfile path: `byteMtaaniBackend/Dockerfile`
6. Select plan: `Standard`
7. Under **Environment**, add the same variables as the web service:

```
SECRET_KEY=<same as backend>
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=<PostgreSQL internal URL>
REDIS_URL=<Redis URL>
DJANGO_ENV=production
```

8. Click **Create Background Job**

#### Step 2e: Deploy Celery Beat

1. Go to **Render Dashboard** → **New** → **Background Job**
2. Set name: `byteMtaani-celery-beat`
3. Set branch: `master`
4. Set Dockerfile path: `byteMtaaniBackend/Dockerfile`
5. Select plan: `Standard`
6. Under **Environment**, add the same variables as above
7. Click **Create Background Job**

### 3. Verify Deployment

Once all services are running:

1. **Check Backend Health**:
   - Visit `https://byteMtaani-backend.onrender.com/api/`
   - Should return JSON with API endpoints

2. **Check Swagger UI**:
   - Visit `https://byteMtaani-backend.onrender.com/api/schema/`
   - Should display interactive API documentation

3. **Check ReDoc**:
   - Visit `https://byteMtaani-backend.onrender.com/api/docs/`
   - Should display ReDoc documentation

4. **Check Django Admin**:
   - Visit `https://byteMtaani-backend.onrender.com/admin/`
   - Create a superuser (see below)

### 4. Create Django Superuser

Run the following in your Render backend service logs terminal:

```bash
python manage.py createsuperuser
```

Or use Render's shell feature:

1. Go to **byteMtaani-backend** service
2. Click **Shell** (top right)
3. Run:
   ```bash
   python manage.py createsuperuser
   ```

### 5. Update Frontend Configuration

In your frontend `.env` (or Render environment):

```
NEXT_PUBLIC_API_BASE=https://byteMtaani-backend.onrender.com
```

## Monitoring & Troubleshooting

### View Logs

1. Go to **Render Dashboard** → Service name
2. Click **Logs** tab
3. Filter by service name or scroll

### Common Issues

#### Database Connection Errors

**Error**: `psycopg2.OperationalError: could not connect to server`

**Solution**:
- Ensure `DATABASE_URL` is set correctly
- Check PostgreSQL is running (Render dashboard)
- Verify firewall/network settings

#### Redis Connection Errors

**Error**: `ConnectionError: Error 111 connecting to 127.0.0.1:6379`

**Solution**:
- Ensure `REDIS_URL` is set correctly
- Check Redis is running (Render dashboard)
- Celery worker logs should show connection status

#### Migrations Not Running

**Check**: Render service logs during deployment
- If migrations fail, the entrypoint script will fail
- Verify migrations exist and are in Git
- Run manually: `python manage.py migrate`

#### Static Files Not Serving

**Issue**: 404 on `/static/` files

**Solution**:
- Whitenoise is configured and enabled in middleware
- Ensure `STATIC_ROOT` directory exists
- Run: `python manage.py collectstatic --noinput`

### Environment Variables Reference

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `SECRET_KEY` | Yes | — | Generate: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `REDIS_URL` | Yes | — | Redis connection string for Celery |
| `DEBUG` | No | False | Never set to True in production |
| `ALLOWED_HOSTS` | Yes | — | Comma-separated list of allowed domains |
| `CORS_ALLOWED_ORIGINS` | Yes | — | Comma-separated list of frontend URLs |
| `EMAIL_BACKEND` | No | console | Set to `sendgrid_backend.SendgridBackend` for SendGrid |
| `SENDGRID_API_KEY` | No | — | Only if using SendGrid email |

## Scaling & Optimization

### Increase Celery Workers

If tasks are backing up:

1. Go to **byteMtaani-celery-worker** service
2. Click **Settings** → **Plan**
3. Upgrade to a higher tier or create multiple worker instances

### Database Connection Pooling

For production, add to `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

### Redis Memory Management

Monitor Redis usage:

1. Render dashboard → Redis service
2. Check memory usage under **Metrics**
3. If near limit, upgrade Redis plan

## Backup & Restore

### Database Backup

Render provides automated backups. To restore:

1. Render dashboard → PostgreSQL service
2. Click **Backups**
3. Select backup and click **Restore**

### Manual Dump

```bash
# Dump database
pg_dump DATABASE_URL > backup.sql

# Restore
psql DATABASE_URL < backup.sql
```

## Rollback

To rollback to a previous deployment:

1. Go to service → **Deploys**
2. Find the previous deployment
3. Click **Redeploy**

## Next Steps

- Set up CI/CD with GitHub Actions (already in `.github/workflows/ci-cd.yml`)
- Configure custom domain (Render dashboard → Custom Domain)
- Set up monitoring alerts (Render dashboard → Alerts)
- Add analytics and error tracking (e.g., Sentry)

For more help, visit [Render Docs](https://render.com/docs).
