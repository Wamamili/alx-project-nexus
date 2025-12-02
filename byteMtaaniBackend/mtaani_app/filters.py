import django_filters
from django.contrib.auth import get_user_model
from mtaani_app.models import Product, Order

User = get_user_model()

class CustomerFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='username', lookup_expr='icontains')
    email = django_filters.CharFilter(field_name='email', lookup_expr='icontains')
    created_at__gte = django_filters.IsoDateTimeFilter(field_name='date_joined', lookup_expr='gte')
    created_at__lte = django_filters.IsoDateTimeFilter(field_name='date_joined', lookup_expr='lte')
    phone_pattern = django_filters.CharFilter(method='filter_phone_pattern')

    class Meta:
        model = User
        fields = ['name', 'email', 'created_at__gte', 'created_at__lte', 'phone_pattern']

    def filter_phone_pattern(self, queryset, name, value):
        # Assumes phone stored in profile model or as part of username/email; best-effort
        return queryset.filter(username__icontains=value)


class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    price__gte = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    stock__gte = django_filters.NumberFilter(field_name='stock', lookup_expr='gte')
    stock__lte = django_filters.NumberFilter(field_name='stock', lookup_expr='lte')

    class Meta:
        model = Product
        fields = ['name', 'price__gte', 'price__lte', 'stock__gte', 'stock__lte']


class OrderFilter(django_filters.FilterSet):
    total_amount__gte = django_filters.NumberFilter(field_name='total_amount', lookup_expr='gte')
    total_amount__lte = django_filters.NumberFilter(field_name='total_amount', lookup_expr='lte')
    order_date__gte = django_filters.IsoDateTimeFilter(field_name='created_at', lookup_expr='gte')
    order_date__lte = django_filters.IsoDateTimeFilter(field_name='created_at', lookup_expr='lte')
    customer_name = django_filters.CharFilter(method='filter_customer_name')
    product_name = django_filters.CharFilter(method='filter_product_name')

    class Meta:
        model = Order
        fields = ['total_amount__gte', 'total_amount__lte', 'order_date__gte', 'order_date__lte', 'customer_name', 'product_name']

    def filter_customer_name(self, queryset, name, value):
        return queryset.filter(user__username__icontains=value)

    def filter_product_name(self, queryset, name, value):
        return queryset.filter(items__product__name__icontains=value).distinct()
