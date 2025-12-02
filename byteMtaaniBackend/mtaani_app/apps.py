from django.apps import AppConfig


class MtaaniAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mtaani_app'

    def ready(self):
        # import signal handlers to ensure they are registered
        try:
            from . import signals  # noqa: F401
        except Exception:
            pass
