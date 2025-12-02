import logging
from django.core.cache import cache
from django_redis import get_redis_connection
from redis.exceptions import ConnectionError as RedisConnectionError
from .models import Product

logger = logging.getLogger(__name__)


def get_all_properties():
    """Return a queryset for all Product instances, using Redis low-level cache.

    Implementation stores list of primary keys in Redis under 'all_properties'
    for 1 hour (3600s) and reconstructs a queryset from those IDs. This
    avoids pickling whole model instances while keeping the "queryset"
    semantics expected by callers.
    """
    key = 'all_properties'
    try:
        ids = cache.get(key)
    except RedisConnectionError:
        # Redis is unavailable — log and fall back to DB
        logger.exception('Redis unavailable when attempting cache.get(%s); falling back to DB', key)
        ids = None
    except Exception:
        # Any other cache backend error — don't let this break the view
        logger.exception('Unexpected cache error when reading %s; falling back to DB', key)
        ids = None

    if ids is not None:
        # return a queryset reconstructed from cached ids
        qs = Product.objects.filter(pk__in=ids)
        return qs

    # cache miss or cache unavailable: fetch ids and attempt to cache them
    ids = list(Product.objects.values_list('pk', flat=True))
    try:
        cache.set(key, ids, 3600)
    except RedisConnectionError:
        logger.exception('Redis unavailable when attempting cache.set(%s); continuing without cache', key)
    except Exception:
        logger.exception('Unexpected cache error when setting %s; continuing without cache', key)

    return Product.objects.filter(pk__in=ids)


def get_redis_cache_metrics():
    """Retrieve Redis keyspace hits/misses and compute a hit ratio.

    Returns dict: {'hits': int, 'misses': int, 'hit_ratio': float}
    """
    try:
        conn = get_redis_connection('default')
        info = conn.info()
        hits = int(info.get('keyspace_hits', 0))
        misses = int(info.get('keyspace_misses', 0))
        total = hits + misses
        ratio = (hits / total) if total > 0 else None
        metrics = {'hits': hits, 'misses': misses, 'hit_ratio': ratio}
        logger.info('Redis cache metrics: %s', metrics)
        return metrics
    except Exception as exc:
        logger.exception('Failed to retrieve Redis metrics: %s', exc)
        return {'hits': None, 'misses': None, 'hit_ratio': None}
