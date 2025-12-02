# ByteMtaani Backend - Entity Relationship Diagram (ERD) Guide

## 📊 Visual ERD (Draw.io Format)

**File**: `ByteMtaani_ERD.drawio`
- Open in [Draw.io](https://draw.io) or [Lucidchart](https://lucidchart.com)
- Edit, export to PNG/PDF, or embed in Google Docs

---

## 🗂️ Data Model Summary

### Six Core Entities

```
USER (1) ────────────────────┐
         │                   ├──► PAYMENT (1)
         │ 1-to-M            │
         ├──────────────────► ORDER (M) ──┐
         │                                 │
         │                                 ├──► ORDERITEM (N) ◄─────┐
         │                                 │                        │
         │                                 ▼                        │
         └─────────────────────────────────┘                        │
                                                                    │
                                            CATEGORY (1)            │
                                                 │                  │
                                                 │ 1-to-M           │
                                                 │                  │
                                                 ▼                  │
                                              PRODUCT (M) ◄─────────┘
```

### Relationship Matrix

| From | To | Type | Notes |
|------|-----|------|-------|
| User | Order | 1-to-M | User can have many orders (related_name: `orders`) |
| User | Payment | 1-to-M | User can have many payments (related_name: `payments`) |
| Category | Product | 1-to-M | Category has many products (related_name: `products`) |
| Order | OrderItem | 1-to-M | Order contains many items (related_name: `items`) |
| Order | Payment | 1-to-1 | Order has one payment (OneToOneField, related_name: `payment`) |
| Product | OrderItem | 1-to-M | Product appears in many order items (related_name: `order_items`) |

---

## 📋 Entity Definitions

### 1. **User**
**Purpose**: Represents system users (customers and admins)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Globally unique identifier |
| username | String | Unique, max 150 | Display name |
| email | String | Unique, required | Login field (USERNAME_FIELD) |
| is_admin | Boolean | Default: False | Admin access flag |
| is_staff | Boolean | Default: False | Staff access flag |
| date_joined | DateTime | Auto-set | Record creation timestamp |

**Indexes**: 
- Primary Key on `id`
- Unique index on `username`
- Unique index on `email`

**Authentication**:
- Inherits from Django's `AbstractBaseUser` & `PermissionsMixin`
- Login uses `email` instead of `username`
- Passwords hashed with PBKDF2

---

### 2. **Category**
**Purpose**: Organizes products into logical groups

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Globally unique identifier |
| category_name | String | Unique, max 200 | Display name (e.g., "Electronics") |
| url_key | String | Unique, max 220 | URL-friendly (e.g., "electronics") |
| created_at | DateTime | Auto-set | Record creation timestamp |

**Indexes**:
- Primary Key on `id`
- Unique index on `category_name`
- Unique index on `url_key`

**Cascade Rules**:
- If category deleted, all products in it are also deleted (CASCADE)

---

### 3. **Product**
**Purpose**: Represents items for sale

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Globally unique identifier |
| product_name | String | Indexed, max 255 | Display name |
| url_key | String | Unique, max 255 | URL-friendly identifier |
| description | Text | Optional | Detailed product info |
| price | Decimal | Indexed, 12,2 | Price with 2 decimal places (indexed for range queries) |
| category (FK) | UUID | Not-null, indexed | Links to Category (CASCADE delete) |
| stock | Integer | Indexed, default 0 | Quantity available |
| in_stock | Boolean | Default True | Derived from `stock > 0` (auto-synced) |
| image_url | String | Optional | URL to product image |
| created_at | DateTime | Auto-set | Record creation timestamp |
| updated_at | DateTime | Auto-update | Record last modification timestamp |

**Indexes**:
- Primary Key on `id`
- Unique index on `url_key`
- Composite indexes on `(product_name)`, `(category)`, `(price)`, `(stock)` for filtering & sorting

**Auto-Logic**:
```python
def save(self, *args, **kwargs):
    # Keep in_stock synchronized with numeric stock
    self.in_stock = bool(self.stock and int(self.stock) > 0)
    super().save(*args, **kwargs)
```

---

### 4. **Order**
**Purpose**: Represents a customer purchase transaction

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Globally unique identifier |
| user (FK) | UUID | Not-null, indexed | Links to User (CASCADE delete) |
| status | Enum | Indexed, default "pending" | State machine: pending → paid → shipped → delivered; can jump to cancelled |
| total_amount | Decimal | 12,2 | Sum of all order items (order quantity × item price) |
| created_at | DateTime | Auto-set, indexed | Order creation timestamp |
| updated_at | DateTime | Auto-update | Last modification timestamp |

**Indexes**:
- Primary Key on `id`
- Index on `user` (foreign key)
- Index on `status` (for filtering by state)
- Index on `created_at` (for sorting/date range queries)

**Status Workflow**:
```
pending ──► paid ──► shipped ──► delivered
  ▲                    ▲            ▲
  │                    │            │
  └────────── cancelled ◄───────────┘
           (can cancel at any point)
```

**Cascade Rules**:
- If user deleted, all their orders are also deleted (CASCADE)

---

### 5. **OrderItem**
**Purpose**: Line items within an order (many-to-many between Order and Product)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Globally unique identifier |
| order (FK) | UUID | Not-null | Links to Order (CASCADE delete) |
| product (FK) | UUID | Not-null | Links to Product (PROTECT delete—prevent deleting product if referenced) |
| quantity | PositiveInteger | Not-null, default 1 | Number of items ordered |
| price | Decimal | 12,2 | Snapshot of product price at order time (allows price history if product price changes) |

**Indexes**:
- Primary Key on `id`
- Index on `order` (foreign key)
- Index on `product` (foreign key)

**String Representation**:
```python
def __str__(self):
    return f"{self.quantity} x {self.product.product_name}"
    # Example: "2 x iPhone 15"
```

**Cascade Rules**:
- If order deleted, all its items are deleted (CASCADE)
- If product deleted, error is raised (PROTECT) to maintain referential integrity

**Business Logic**:
- Quantity must be > 0
- Price is recorded at purchase time (snapshot)
- Multiple OrderItems per Order allowed

---

### 6. **Payment**
**Purpose**: Tracks payment transactions for orders

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | Globally unique identifier |
| user (FK) | UUID | Not-null | Links to User (CASCADE delete) |
| order (FK: 1-to-1) | UUID | Not-null, unique | Links to Order (CASCADE delete, one payment per order) |
| amount | Decimal | 12,2 | Payment amount (should match order.total_amount) |
| method | Enum | Not-null | Payment method: `mpesa`, `card`, or `paypal` |
| status | Enum | Indexed, default "pending" | Transaction state: `pending`, `successful`, `failed` |
| transaction_id | String | Unique, indexed, max 255 | External transaction reference (from M-Pesa, Stripe, etc.) |
| paid_at | DateTime | Optional | Timestamp when payment was marked successful (null if pending/failed) |

**Indexes**:
- Primary Key on `id`
- Unique index on `order` (ensures one payment per order)
- Index on `transaction_id` (for payment lookup/reconciliation)
- Index on `status` (for filtering pending/failed payments)

**Payment Methods**:
- **mpesa**: M-Pesa (Safaricom Kenya) — integrated via STK push
- **card**: Credit/debit card (Stripe integration ready)
- **paypal**: PayPal (placeholder for future)

**Status Transitions**:
```
pending ──► successful
  │           ▲
  └──► failed ◄─┘
```

**Cascade Rules**:
- If user deleted, all their payments are deleted (CASCADE)
- If order deleted, its payment is deleted (CASCADE)

**M-Pesa Callback**:
- External webhook updates `status`, `paid_at`, `transaction_id` from M-Pesa API

---

## 🔗 Relationship Details

### User → Order (1-to-Many)
- **Foreign Key**: `order.user` references `user.id`
- **Cascade**: If user deleted, all their orders deleted
- **Related Name**: `user.orders` gives access to all orders by user
- **Query Example**: `User.objects.filter(username="john").orders.all()`

### User → Payment (1-to-Many)
- **Foreign Key**: `payment.user` references `user.id`
- **Cascade**: If user deleted, all their payments deleted
- **Related Name**: `user.payments`
- **Query Example**: `user.payments.filter(status="successful")`

### Category → Product (1-to-Many)
- **Foreign Key**: `product.category` references `category.id`
- **Cascade**: If category deleted, all products in it deleted
- **Related Name**: `category.products`
- **Query Example**: `Category.objects.get(url_key="electronics").products.all()`

### Order → OrderItem (1-to-Many)
- **Foreign Key**: `orderitem.order` references `order.id`
- **Cascade**: If order deleted, all its items deleted
- **Related Name**: `order.items`
- **Query Example**: `order.items.all()` returns all products in order

### Order → Payment (1-to-1)
- **OneToOneField**: `payment.order` references `order.id` (unique)
- **Cascade**: If order deleted, its payment deleted
- **Related Name**: `order.payment`
- **Query Example**: `order.payment` returns the associated payment
- **Constraint**: Only one payment per order

### Product → OrderItem (1-to-Many)
- **Foreign Key**: `orderitem.product` references `product.id`
- **Protect**: If product deleted, error raised (cannot delete if referenced in any order)
- **Related Name**: `product.order_items`
- **Query Example**: `product.order_items.all()` returns all orders containing this product

---

## 📊 Data Flow Example

### Order Creation Flow

```
1. User creates Order
   POST /api/orders/
   {
     "items": [
       { "product_id": "abc-123", "quantity": 2 },
       { "product_id": "xyz-789", "quantity": 1 }
     ]
   }

2. Backend creates Order record
   Order {
     id: "order-001",
     user: user-001,
     status: "pending",
     total_amount: 0 (calculated)
   }

3. Backend creates OrderItems
   OrderItem {
     id: "item-001",
     order: order-001,
     product: product-abc-123,
     quantity: 2,
     price: 99.99 (snapshot from Product)
   }
   OrderItem {
     id: "item-002",
     order: order-001,
     product: product-xyz-789,
     quantity: 1,
     price: 49.99
   }

4. Calculate total_amount = (2 × 99.99) + (1 × 49.99) = 249.97

5. Response includes Order with nested OrderItems
   Order {
     id: "order-001",
     user: { ... },
     status: "pending",
     total_amount: "249.97",
     items: [
       { product: { ... }, quantity: 2, price: "99.99" },
       { product: { ... }, quantity: 1, price: "49.99" }
     ],
     created_at: "2025-12-01T10:30:00Z"
   }
```

### Payment Flow

```
1. User initiates Payment
   POST /api/payments/
   {
     "order_id": "order-001",
     "method": "mpesa",
     "phone_number": "+254712345678"
   }

2. Backend creates Payment record
   Payment {
     id: "payment-001",
     user: user-001,
     order: order-001,
     amount: "249.97",
     method: "mpesa",
     status: "pending",
     transaction_id: null
   }

3. Backend triggers M-Pesa STK push
   M-Pesa sends USSD prompt to customer's phone

4. Customer enters M-Pesa PIN
   M-Pesa processes payment

5. M-Pesa sends callback webhook
   Callback handler updates Payment:
   {
     status: "successful",
     transaction_id: "LHU20D5K60",
     paid_at: "2025-12-01T10:35:00Z"
   }

6. Order status automatically updated to "paid"
```

---

## 🔍 Indexing Strategy

### Why Indexes Matter

Fast queries on frequently filtered/searched fields.

**Indexed Fields**:

| Table | Field(s) | Reason |
|-------|----------|--------|
| Product | product_name | Text search |
| Product | category | Filter by category |
| Product | price | Price range queries |
| Product | stock | Filter by availability |
| Order | user | List user's orders |
| Order | status | Filter by order state |
| Order | created_at | Sort/filter by date |
| Payment | status | Find pending/failed payments |
| Payment | transaction_id | Reconciliation & lookup |
| OrderItem | order, product | Foreign key lookups |

**Performance Impact**:
- Without indexes: O(n) full table scan
- With indexes: O(log n) B-tree lookup

---

## 🛡️ Referential Integrity

### Foreign Key Constraints

| Constraint | Behavior | When Applied |
|-----------|----------|--------------|
| CASCADE | Delete child if parent deleted | User → Order, Category → Product, Order → OrderItem |
| PROTECT | Prevent parent deletion if children exist | Product → OrderItem |
| SET_NULL | Set FK to NULL if parent deleted | (Not used in this schema) |

**Example CASCADE**:
```
User "john" deleted
  → All orders by john deleted
    → All order items in those orders deleted
```

**Example PROTECT**:
```
Product "iPhone" deleted
  → ERROR: Cannot delete product referenced in order items
  → Must remove from all orders first or keep for history
```

---

## 📈 Scalability Considerations

### Current Optimizations

1. **Indexing**: Frequently queried fields indexed
2. **Denormalization**: `in_stock` flag kept on Product for quick checks
3. **Pagination**: API returns paginated results (default 20 per page)
4. **Connection Pooling**: Database connections reused (via psycopg2)
5. **Caching**: Redis caching layer available (django-redis)

### Future Improvements

1. **Partitioning**: Split Order table by date ranges
2. **Read Replicas**: PostgreSQL replicas for read-heavy queries
3. **Materialized Views**: Pre-computed aggregations (e.g., monthly revenue)
4. **Full-Text Search**: Elasticsearch for product search
5. **Archive**: Move old orders to cold storage

---

## 🧪 Sample Queries

### Django ORM Examples

```python
# Get all products in "Electronics" category
electronics = Category.objects.get(url_key="electronics")
products = electronics.products.all()

# Get all orders by user with "pending" status
pending_orders = user.orders.filter(status="pending")

# Get all items in an order with product details
order_items = order.items.select_related("product").all()

# Find failed payments
failed_payments = Payment.objects.filter(status="failed")

# Get high-value orders (total > 10,000)
big_orders = Order.objects.filter(total_amount__gt=10000)

# Product search by name
results = Product.objects.filter(
    product_name__icontains="iphone"
).select_related("category")

# Orders created in last 30 days
from django.utils import timezone
from datetime import timedelta
recent_orders = Order.objects.filter(
    created_at__gte=timezone.now() - timedelta(days=30)
)
```

---

## 📄 Database Schema (SQL)

```sql
-- User table
CREATE TABLE mtaani_app_user (
    id UUID PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_staff BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP AUTO_SET
);

-- Category table
CREATE TABLE mtaani_app_category (
    id UUID PRIMARY KEY,
    category_name VARCHAR(200) UNIQUE NOT NULL,
    url_key VARCHAR(220) UNIQUE NOT NULL,
    created_at TIMESTAMP AUTO_SET,
    INDEX (category_name),
    INDEX (url_key)
);

-- Product table
CREATE TABLE mtaani_app_product (
    id UUID PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    url_key VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    category_id UUID NOT NULL,
    stock INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP AUTO_SET,
    updated_at TIMESTAMP AUTO_SET,
    FOREIGN KEY (category_id) REFERENCES mtaani_app_category(id) ON DELETE CASCADE,
    INDEX (product_name),
    INDEX (category_id),
    INDEX (price),
    INDEX (stock)
);

-- Order table
CREATE TABLE mtaani_app_order (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP AUTO_SET,
    updated_at TIMESTAMP AUTO_SET,
    FOREIGN KEY (user_id) REFERENCES mtaani_app_user(id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (status),
    INDEX (created_at)
);

-- OrderItem table
CREATE TABLE mtaani_app_orderitem (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES mtaani_app_order(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mtaani_app_product(id) ON DELETE PROTECT,
    INDEX (order_id),
    INDEX (product_id)
);

-- Payment table
CREATE TABLE mtaani_app_payment (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    order_id UUID NOT NULL UNIQUE,
    amount DECIMAL(12, 2) NOT NULL,
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES mtaani_app_user(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES mtaani_app_order(id) ON DELETE CASCADE,
    INDEX (transaction_id),
    INDEX (status)
);
```

---

## 🎓 Learning Resources

- [Django ORM Documentation](https://docs.djangoproject.com/en/5.2/topics/db/models/)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)
- [Relational Model Design](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
- [PostgreSQL Indexing](https://www.postgresql.org/docs/current/indexes.html)

---

**Created**: December 1, 2025  
**Version**: 1.0  
**Backend**: Django 5.2.4 + DRF
