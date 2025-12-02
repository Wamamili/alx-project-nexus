from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Product, Order, OrderItem, Payment

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class CategorySerializer(serializers.ModelSerializer):
    # expose `Category_name` as `name` in the API for compatibility
    name = serializers.CharField(source='Category_name')
    # expose DB field `url_key` as `url_key` in API
    url_key = serializers.CharField(source='url_key')

    class Meta:
        model = Category
        # expose `url_key` as `url_key` to clients while preserving DB field name
        fields = ('id', 'name', 'url_key', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductSerializer(serializers.ModelSerializer):
    # expose `product_name` as `name` for API clients
    name = serializers.CharField(source='product_name')
    # expose DB field `url_key` as `url_key` in API payloads
    url_key = serializers.CharField(source='url_key')

    class Meta:
        model = Product
        # keep DB field `url_key` but present it as `url_key` to clients
        fields = (
            'id', 'name', 'url_key', 'description', 'price', 'stock', 'in_stock', 'category', 'image_url', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'in_stock', 'created_at', 'updated_at')


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True, required=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'order', 'product', 'product_id', 'quantity', 'price')
        read_only_fields = ('id', 'order', 'price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    user = UserSerializer(read_only=True)
    # user_id is optional: when authenticated, request.user will be used
    user_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = ('id', 'user', 'user_id', 'items', 'status', 'total_amount', 'created_at')
        read_only_fields = ('id', 'status', 'total_amount', 'created_at')


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'user', 'order', 'amount', 'method', 'status', 'transaction_id', 'paid_at')
        read_only_fields = ('id',)
