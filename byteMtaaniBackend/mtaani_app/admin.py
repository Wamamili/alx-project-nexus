from django.contrib import admin
from .models import User, Category, Product, Order, OrderItem, Payment


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'email', 'is_staff', 'is_admin', 'date_joined')
	search_fields = ('username', 'email')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('name', 'slug', 'created_at')
	search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('name', 'slug', 'price', 'in_stock', 'category')
	search_fields = ('name', 'slug')
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
