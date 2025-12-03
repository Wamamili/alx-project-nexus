from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from mtaani_app.app_router import MyRouter
from rest_framework.authtoken.views import obtain_auth_token

from mtaani_app.views import (
    ProductViewSet, CategoryViewSet, OrderViewSet,
    CustomerViewSet, PaymentViewSet,
    production_list, cache_metrics, mpesa_callback
)

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator
from rest_framework import permissions as drf_permissions


# Routers
router = MyRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'payments', PaymentViewSet, basename='payment')


# Swagger / OpenAPI schema
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
    patterns=router.urls,
)


# Final merged URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),

    # API Routes
    path('api/', include(router.urls)),
    path('api-token-auth/', obtain_auth_token),
    path('productions/', production_list),
    path('cache-metrics/', cache_metrics),
    path('mpesa/callback/', mpesa_callback),

    # Documentation
    re_path(r'^api/schema\.(?P<format>json|yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/schema/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
