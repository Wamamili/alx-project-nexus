import re
import graphene
from graphene_django import DjangoObjectType
from django.db import transaction
from django.contrib.auth import get_user_model
from graphene import Field, List
from mtaani_app.models import Product, Order, OrderItem
from .filters import CustomerFilter, ProductFilter, OrderFilter
from graphene_django.filter import DjangoFilterConnectionField

User = get_user_model()

PHONE_RE = re.compile(r'^(\+\d{7,15}|\d{3}-\d{3}-\d{4})$')

class CustomerType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined')
        interfaces = (graphene.relay.Node,)

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'in_stock')
        interfaces = (graphene.relay.Node,)

class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = ('id', 'user', 'items', 'total_amount', 'created_at')
        interfaces = (graphene.relay.Node,)

# --- Mutations ---
class CreateCustomer(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        phone = graphene.String(required=False)

    customer = Field(CustomerType)
    message = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, name, email, phone=None):
        email = email.lower().strip()
        if User.objects.filter(email=email).exists():
            return CreateCustomer(customer=None, message='Email already exists', ok=False)
        if phone and not PHONE_RE.match(phone):
            return CreateCustomer(customer=None, message='Invalid phone format', ok=False)
        user = User.objects.create(username=name, email=email)
        if phone:
            # store phone in username suffix if no profile exists (lightweight)
            user.username = name
            user.save()
        return CreateCustomer(customer=user, message='Customer created', ok=True)


class CustomerInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String()

class BulkCreateCustomers(graphene.Mutation):
    class Arguments:
        input = graphene.List(CustomerInput, required=True)

    customers = graphene.List(CustomerType)
    errors = graphene.List(graphene.String)

    def mutate(self, info, input):
        created = []
        errors = []
        with transaction.atomic():
            for idx, item in enumerate(input):
                name = item.get('name')
                email = (item.get('email') or '').lower().strip()
                phone = item.get('phone')
                if not name or not email:
                    errors.append(f'Row {idx}: name and email required')
                    continue
                if User.objects.filter(email=email).exists():
                    errors.append(f'Row {idx}: Email {email} already exists')
                    continue
                if phone and not PHONE_RE.match(phone):
                    errors.append(f'Row {idx}: Invalid phone {phone}')
                    continue
                user = User.objects.create(username=name, email=email)
                created.append(user)
        return BulkCreateCustomers(customers=created, errors=errors)


class CreateProduct(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        price = graphene.Float(required=True)
        stock = graphene.Int(required=False)

    product = Field(ProductType)
    message = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, name, price, stock=0):
        if price <= 0:
            return CreateProduct(product=None, message='Price must be positive', ok=False)
        if stock is None:
            stock = 0
        if stock < 0:
            return CreateProduct(product=None, message='Stock cannot be negative', ok=False)
        product = Product.objects.create(name=name, price=price, in_stock=stock)
        return CreateProduct(product=product, message='Product created', ok=True)


class CreateOrder(graphene.Mutation):
    class Arguments:
        customer_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID, required=True)
        order_date = graphene.DateTime(required=False)

    order = Field(OrderType)
    message = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, customer_id, product_ids, order_date=None):
        # Validate customer
        try:
            user = User.objects.get(pk=customer_id)
        except User.DoesNotExist:
            return CreateOrder(order=None, message='Invalid customer ID', ok=False)
        if not product_ids:
            return CreateOrder(order=None, message='At least one product is required', ok=False)
        products = []
        total = 0
        for pid in product_ids:
            try:
                p = Product.objects.get(pk=pid)
            except Product.DoesNotExist:
                return CreateOrder(order=None, message=f'Invalid product ID {pid}', ok=False)
            products.append(p)
            total += float(p.price)
        # Create order and order items
        order = Order.objects.create(user=user, total_amount=total)
        for p in products:
            OrderItem.objects.create(order=order, product=p, quantity=1, price=p.price)
        return CreateOrder(order=order, message='Order created', ok=True)


# --- Query with filters ---
class Query(graphene.ObjectType):
    all_customers = DjangoFilterConnectionField(CustomerType, filterset_class=CustomerFilter)
    all_products = DjangoFilterConnectionField(ProductType, filterset_class=ProductFilter)
    all_orders = DjangoFilterConnectionField(OrderType, filterset_class=OrderFilter)


class Mutation(graphene.ObjectType):
    create_customer = CreateCustomer.Field()
    bulk_create_customers = BulkCreateCustomers.Field()
    create_product = CreateProduct.Field()
    create_order = CreateOrder.Field()
