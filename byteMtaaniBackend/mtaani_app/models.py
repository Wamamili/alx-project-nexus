import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


# ============================
# Custom User Model
# ============================
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"   # Login using email
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return self.username


# ============================
# Categories
# ============================
class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Category_name = models.CharField(max_length=200, unique=True)
    url_key = models.SlugField(max_length=220, unique=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Category_name


# ============================
# Products
# ============================
class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_name = models.CharField(max_length=255, db_index=True)
    url_key = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products", db_index=True)
    # Track numeric stock and keep boolean `in_stock` in sync for compatibility
    stock = models.IntegerField(default=0, db_index=True)
    in_stock = models.BooleanField(default=True)
    image_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["product_name"]),
            models.Index(fields=["category"]),
            models.Index(fields=["price"]),
            models.Index(fields=["stock"]),
        ]

    def __str__(self):
        return self.product_name

    def save(self, *args, **kwargs):
        # keep in_stock flag consistent with numeric stock
        try:
            self.in_stock = bool(self.stock and int(self.stock) > 0)
        except Exception:
            self.in_stock = False
        super().save(*args, **kwargs)


# ============================
# Orders
# ============================
class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders", db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id}"


# ============================
# Order Items
# ============================
class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_items")
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        # product_name exists on Product model
        return f"{self.quantity} x {self.product.product_name}"


# ============================
# Payments
# ============================
class Payment(models.Model):
    METHOD_CHOICES = [
        ("mpesa", "Mpesa"),
        ("card", "Card"),
        ("paypal", "PayPal"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("successful", "Successful"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True)
    transaction_id = models.CharField(max_length=255, db_index=True, unique=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["transaction_id"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Payment {self.transaction_id}"
