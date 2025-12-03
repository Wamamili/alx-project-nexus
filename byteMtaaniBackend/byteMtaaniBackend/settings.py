from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
import os
from dotenv import load_dotenv
import dj_database_url
import environ
import pymysql

TIME_ZONE = "Africa/Nairobi"
USE_TZ = True
pymysql.install_as_MySQLdb()


env = environ.Env()

# ----------------------------------------------
# BASE DIR
# ----------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------------------------------
# LOAD .env file
# ----------------------------------------------
load_dotenv(BASE_DIR / ".env")   # <--- IMPORTANT

# ----------------------------------------------
# SECURITY SETTINGS
# ----------------------------------------------

# Read SECRET_KEY from environment, with fallback for local dev
SECRET_KEY = os.getenv("SECRET_KEY", "change-me")

# DEBUG mode (default False)
DEBUG = os.getenv("DEBUG", "False").lower() in ("1", "true", "yes")

# Allowed Hosts
_allowed = os.getenv("ALLOWED_HOSTS", "")
if _allowed.strip() in ("", "*"):
    ALLOWED_HOSTS = [] if _allowed.strip() == "" else ["*"]
else:
    ALLOWED_HOSTS = [h.strip() for h in _allowed.split(",") if h.strip()]


# ----------------------------------------------
# APPLICATIONS
# ----------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",



    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "django_filters",
    "django_celery_results",
    "django_celery_beat",

    # Local apps
    "mtaani_app",
    "drf_yasg",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = "byteMtaaniBackend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  
        "APP_DIRS": True,  
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "byteMtaaniBackend.wsgi.application"


# ----------------------------------------------
# DATABASE CONFIGURATION
# ----------------------------------------------

# Use DATABASE_URL when provided

import dj_database_url
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=True  
        )
    }
else:
    # MySQL or SQLite fallback
    try:
        db_name = env('DB_NAME')
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.mysql',
                'NAME': db_name,
                'USER': env('DB_USER'),
                'PASSWORD': env('DB_PASSWORD'),
                'HOST': env('DB_HOST', default='127.0.0.1'),
                'PORT': env('DB_PORT', default='3306'),
            }
        }
    except Exception:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }


# ----------------------------------------------
# CACHE (Redis optional)
# ----------------------------------------------

REDIS_URL = (
    os.getenv("REDIS_URL")
    or os.getenv("REDIS_HOST")
    or os.getenv("REDIS")
)

if not REDIS_URL and os.getenv("DOCKER_COMPOSE") == "1":
    REDIS_URL = "redis://redis:6379/1"

if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            },
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }


# ----------------------------------------------
# REST FRAMEWORK
# ----------------------------------------------

REST_FRAMEWORK = {
   
   # Default permission classes
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,

    # Filter backends
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],

    # Renderer classes — keep JSON and the browsable API by default. TemplateHTMLRenderer
    # can be enabled per-view where an HTML template is provided. Including
    # TemplateHTMLRenderer globally causes the API root to attempt HTML rendering
    # (and it requires a `template_name`), which breaks when a view doesn't set one.
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}

# ============================================================================
# API DOCUMENTATION (drf-yasg)
# ============================================================================
SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,
    'SECURITY_DEFINITIONS': {
        'api_key': {'type': 'apiKey', 'in': 'header', 'name': 'Authorization'}
    },
}


# ----------------------------------------------
# Celery / Task queue
# ----------------------------------------------
# Broker and result backend: prefer explicit env vars, fall back to REDIS_URL or localhost
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL") or REDIS_URL or os.getenv("REDIS_URL") or "redis://127.0.0.1:6379/0"

# If running in docker-compose and no explicit broker provided, prefer RabbitMQ
if os.getenv("DOCKER_COMPOSE") == "1" and not os.getenv("CELERY_BROKER_URL"):
    CELERY_BROKER_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672//")

# Use django-celery-results as the result backend — stores task results in database
CELERY_RESULT_BACKEND = "django-db"

# Use JSON content by default
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE

# Use django-celery-beat scheduler when installed (stores periodic tasks in database)
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

# Task time limits (prevent hung workers on Render)
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 minutes hard time limit
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60  # 25 minutes soft time limit


# ----------------------------------------------
# AUTH MODEL
# ----------------------------------------------

AUTH_USER_MODEL = "mtaani_app.User"


# ----------------------------------------------
# PASSWORD / AUTH SETTINGS
# ----------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# ----------------------------------------------
# INTERNATIONALIZATION
# ----------------------------------------------

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ============================================================================
# STATIC & MEDIA FILES
# ============================================================================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [ BASE_DIR /  "static", ]
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# ----------------------------------------------
# DEFAULT PRIMARY KEY FIELD TYPE
# ----------------------------------------------

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ----------------------------------------------
# Email settings
# ----------------------------------------------
# Use console email backend by default for development. Override via .env
# ============================================================================
# EMAIL CONFIGURATION
# ============================================================================
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='no-reply@bytemtaani.com')


# ----------------------------------------------
# CORS CONFIGURATION
# ----------------------------------------------
# Allow frontend (Next.js dev on port 4028) to call this API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:4028",
    "http://localhost:4000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4028",
    "http://127.0.0.1:4000",
]

# For development, allow all origins if CORS_ALLOW_ALL_ORIGINS is set
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "false").lower() in ("1", "true", "yes")

CORS_ALLOW_CREDENTIALS = True


# ----------------------------------------------
# FAIL-FAST VALIDATION (only in production)
# ----------------------------------------------

if not DEBUG:
    if not SECRET_KEY or SECRET_KEY in ("", "change-me", "your-secret-key"):
        raise ImproperlyConfigured(
            "SECRET_KEY is not set or is insecure. Set the SECRET_KEY environment variable for production."
        )
if not DEBUG:
    ALLOWED_HOSTS = ["*"]
    

    