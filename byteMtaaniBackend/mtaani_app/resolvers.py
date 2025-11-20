from django.core.cache import cache
from .models import Product

def resolve_all_products(root, info):
    cached = cache.get("all_products")
    if cached:
        return cached
    products = list(Product.objects.all())
    cache.set("all_products", products, 3600)
    return products
