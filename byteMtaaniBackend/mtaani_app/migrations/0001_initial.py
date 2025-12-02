from __future__ import annotations
import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
        ),

        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('Category_name', models.CharField(max_length=200, unique=True)),
                ('slug', models.SlugField(max_length=220, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
        ),

        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('product_name', models.CharField(max_length=255, db_index=True)),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True)),
                ('price', models.DecimalField(max_digits=12, decimal_places=2, db_index=True)),
                ('stock', models.IntegerField(default=0, db_index=True)),
                ('in_stock', models.BooleanField(default=True)),
                ('image_url', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='mtaani_app.category', db_index=True)),
            ],
            options={
                'indexes': [
                    models.Index(fields=['product_name'], name='product_name_idx'),
                    models.Index(fields=['category'], name='product_category_idx'),
                    models.Index(fields=['price'], name='product_price_idx'),
                    models.Index(fields=['stock'], name='product_stock_idx'),
                ],
            },
        ),

        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('status', models.CharField(max_length=20, default='pending')),
                ('total_amount', models.DecimalField(max_digits=12, decimal_places=2)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='mtaani_app.user', db_index=True)),
            ],
            options={
            },
        ),

        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('quantity', models.PositiveIntegerField()),
                ('price', models.DecimalField(max_digits=12, decimal_places=2)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='mtaani_app.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='order_items', to='mtaani_app.product')),
            ],
            options={
            },
        ),

        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('amount', models.DecimalField(max_digits=12, decimal_places=2)),
                ('method', models.CharField(max_length=20)),
                ('status', models.CharField(max_length=20, db_index=True)),
                ('transaction_id', models.CharField(max_length=255, unique=True, db_index=True)),
                ('paid_at', models.DateTimeField(null=True, blank=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='mtaani_app.order')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='mtaani_app.user')),
            ],
            options={
               'indexes': [
                models.Index(fields=['transaction_id'], name='payment_txn_id_idx'),
                models.Index(fields=['status'], name='payment_status_idx'),
            ],
            },
        ),
    ]
