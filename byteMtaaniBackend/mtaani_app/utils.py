import logging
from django.core.cache import cache
from django_redis import get_redis_connection
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
    ids = cache.get(key)
    if ids is not None:
        # return a queryset reconstructed from cached ids
        qs = Product.objects.filter(pk__in=ids)
        return qs

    # cache miss: fetch ids and cache them
    ids = list(Product.objects.values_list('pk', flat=True))
    cache.set(key, ids, 3600)
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
