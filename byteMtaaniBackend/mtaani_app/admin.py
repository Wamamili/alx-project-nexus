from django.contrib import admin
from .models import User, Category, Product, Order, OrderItem, Payment


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'email', 'is_staff', 'is_admin', 'date_joined')
	search_fields = ('username', 'email')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('Category_name', 'url_key', 'created_at')
	search_fields = ('Category_name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('product_name', 'url_key', 'price', 'stock', 'in_stock', 'category')
	search_fields = ('product_name', 'url_key')
	list_filter = ('in_stock', 'category')


class OrderItemInline(admin.TabularInline):
	model = OrderItem
	extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'status', 'total_amount', 'created_at')
	inlines = (OrderItemInline,)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
	list_display = ('transaction_id', 'user', 'order', 'amount', 'status')
	search_fields = ('transaction_id',)
