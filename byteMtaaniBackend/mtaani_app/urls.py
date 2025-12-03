from django.urls import path
from rest_framework.routers import DefaultRouter
from byteMtaaniBackend.mtaani_app.app_router import MyRouter
from .views import ProductViewSet, CategoryViewSet, OrderViewSet, CustomerViewSet, PaymentViewSet

router = MyRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = router.urls
