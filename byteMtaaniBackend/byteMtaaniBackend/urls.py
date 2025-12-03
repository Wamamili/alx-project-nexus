from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator
from rest_framework import permissions as drf_permissions
from django.http import JsonResponse

# App imports
from mtaani_app.views import (
    ProductViewSet, CategoryViewSet, OrderViewSet,
    CustomerViewSet, PaymentViewSet,
    production_list, cache_metrics, mpesa_callback
)

# ------------------------
# Root health check
# ------------------------
def root(request):
    return JsonResponse({"message": "Backend is running!"})

# ------------------------
# Router
# ------------------------
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'payments', PaymentViewSet, basename='payment')

# ------------------------
# Swagger / OpenAPI schema
# ------------------------
schema_view = get_schema_view(
    openapi.Info(
        title="Byte Mtaani API",
        default_version="v1",
        description="API documentation for Byte Mtaani eCommerce platform",
        contact=openapi.Contact(email="support@bytemtaani.com"),
    ),
    public=True,
    permission_classes=(drf_permissions.AllowAny,),
    generator_class=OpenAPISchemaGenerator,
)

# ------------------------
# URL Patterns
# ------------------------

# ------------------------
# Root API Index
# ------------------------
from django.urls import reverse

def root(request):
    return JsonResponse({
        "status": "OK",
        "message": "Backend is live",
        "api_index": {
            "products": reverse("product-list"),
            "categories": reverse("category-list"),
            "orders": reverse("order-list"),
            "customers": reverse("customer-list"),
            "payments": reverse("payment-list"),
            "productions": "/productions/",
            "cache_metrics": "/cache-metrics/",
            "mpesa_callback": "/mpesa/callback/",
            "schema_json": "/api/schema.json",
            "schema_yaml": "/api/schema.yaml",
            "swagger_ui": "/api/schema/",
            "redoc_docs": "/api/docs/",
        }
    })

urlpatterns = [
    path('', root, name='root'),
    path('admin/', admin.site.urls),

    # API routes
    path('api/', include(router.urls)),
    path('api-token-auth/', obtain_auth_token),
    path('productions/', production_list),
    path('cache-metrics/', cache_metrics),
    path('mpesa/callback/', mpesa_callback),

    # Swagger / OpenAPI
    re_path(r'^api/schema\.(?P<format>json|yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/schema/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
