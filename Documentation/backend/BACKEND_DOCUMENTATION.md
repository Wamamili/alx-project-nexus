# ByteMtaani Backend - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Data Model & ERD](#data-model--erd)
3. [API Endpoints](#api-endpoints)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [Tools & Frameworks](#tools--frameworks)
6. [Features](#features)
7. [Deployment](#deployment)
8. [Testing & Quality](#testing--quality)

---

## 1. Project Overview

**ByteMtaani** is a full-stack e-commerce platform backend built with **Django REST Framework**. It handles:
- User authentication and management
- Product catalog with categories
- Shopping cart & order management
- Payment processing (M-Pesa integration)
- RESTful API for frontend consumption

### Key Stats
- **Framework**: Django 5.2.4 + Django REST Framework
- **Database**: PostgreSQL (production) / MySQL / SQLite (local dev)
- **Authentication**: Token & Session-based
- **Payment**: M-Pesa (Safaricom API)
- **Async Tasks**: Celery + Redis
- **API Documentation**: Swagger/ReDoc via drf-yasg

---

## 2. Data Model & ERD

### Entity Relationship Diagram

The backend uses 6 core models:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────┐      ┌──────────┐       ┌───────────┐       │
│  │   User   │◄─────┤  Order   ├──────►│ OrderItem │       │
│  │(UUID PK) │      │(UUID PK) │       │(UUID PK) │       │
│  └──────────┘      └──────────┘       └───────────┘       │
│        │                  │                    │           │
│        │                  │ 1-to-1             │           │
│        │ 1-to-M           │                    ▼ M-to-1    │
│        │                  │             ┌──────────────┐   │
│        └──────────────────┼─────┬──────►│  Product     │   │
│                           │     │       │  (UUID PK)   │   │
│                           │     │       └──────────────┘   │
│        ┌──────────────────┴─────┴─┬─────────┬──────────┐   │
│        │                          │         │          │   │
│        ▼                          │         ▼          ▼   │
│  ┌──────────┐              ┌────────────┐ ┌────────────┐  │
│  │ Payment  │              │ Category   │ │  Indices  │  │
│  │(UUID PK) │              │(UUID PK)   │ │& Metadata │  │
│  └──────────┘              └────────────┘ └────────────┘  │
│        │                          ▲                        │
│        └──────────────────────────┴────────────────────┐   │
│                                                        │   │
│                    (1-to-Many relationship)            │   │
└─────────────────────────────────────────────────────────┘  
```

### Models Detail

#### **User** (Custom User Model)
- **id**: UUID (Primary Key)
- **username**: String (Unique, max 150 chars)
- **email**: String (Unique, login field)
- **is_admin**: Boolean (default: False)
- **is_staff**: Boolean (default: False)
- **date_joined**: DateTime (auto)

**Relations**:
- `orders` (1-to-M): Orders created by this user
- `payments` (1-to-M): Payments made by this user

---

#### **Category**
- **id**: UUID (Primary Key)
- **category_name**: String (Unique, max 200 chars)
- **url_key**: String (Unique, max 220 chars, for URLs)
- **created_at**: DateTime (auto)

**Relations**:
- `products` (1-to-M): Products in this category

---

#### **Product**
- **id**: UUID (Primary Key)
- **product_name**: String (max 255 chars, indexed)
- **url_key**: String (Unique, max 255 chars)
- **description**: Text (optional)
- **price**: Decimal (12 digits, 2 decimal places, indexed)
- **category**: ForeignKey → Category (CASCADE delete)
- **stock**: Integer (default: 0, indexed)
- **in_stock**: Boolean (computed from stock; kept for compatibility)
- **image_url**: String (optional)
- **created_at**: DateTime (auto)
- **updated_at**: DateTime (auto update)

**Indexes**: product_name, category, price, stock for fast queries
**Auto-Logic**: `save()` ensures `in_stock` matches `stock > 0`

---

#### **Order**
- **id**: UUID (Primary Key)
- **user**: ForeignKey → User (CASCADE delete)
- **status**: Enum: pending | paid | shipped | delivered | cancelled (indexed)
- **total_amount**: Decimal (12 digits, 2 decimal places)
- **created_at**: DateTime (auto, indexed)
- **updated_at**: DateTime (auto update)

**Relations**:
- `items` (1-to-M): OrderItems in this order
- `payment` (1-to-1): Payment for this order

---

#### **OrderItem**
- **id**: UUID (Primary Key)
- **order**: ForeignKey → Order (CASCADE delete)
- **product**: ForeignKey → Product (PROTECT delete—don't delete product if referenced)
- **quantity**: PositiveInteger
- **price**: Decimal (snapshot of product price at order time)

**String Repr**: `"{quantity} x {product_name}"`

---

#### **Payment**
- **id**: UUID (Primary Key)
- **user**: ForeignKey → User (CASCADE delete)
- **order**: OneToOneField → Order (CASCADE delete, related_name="payment")
- **amount**: Decimal (12 digits, 2 decimal places)
- **method**: Enum: mpesa | card | paypal
- **status**: Enum: pending | successful | failed (indexed)
- **transaction_id**: String (Unique, max 255 chars, indexed)
- **paid_at**: DateTime (optional, null initially; set when payment succeeds)

**Indexes**: transaction_id, status for fast lookups

---

## 3. API Endpoints

### Base URL
```
http://localhost:8000/api/
```

### Authentication
- **Token Auth**: Pass `Authorization: Token <token>` header
- **Session Auth**: Login via Django admin and use session cookies
- **Default Permission**: `IsAuthenticatedOrReadOnly` (anyone can GET, authenticated users can POST/PUT/DELETE)

---

### **Products** 
`/api/products/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products/` | List all products (paginated, filterable) | None |
| POST | `/api/products/` | Create new product | Token |
| GET | `/api/products/{id}/` | Retrieve product details | None |
| PUT | `/api/products/{id}/` | Update product | Token |
| DELETE | `/api/products/{id}/` | Delete product | Token |

**Filters**: 
- `category` (UUID or url_key)
- `price_min`, `price_max`
- `in_stock` (true/false)
- `search` (text search on product_name, description)

**Example Response** (GET `/api/products/`):
```json
{
  "count": 45,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_name": "Smartphone X",
      "url_key": "smartphone-x",
      "description": "Latest model with 5G",
      "price": "15999.99",
      "category": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "category_name": "Electronics",
        "url_key": "electronics"
      },
      "stock": 50,
      "in_stock": true,
      "image_url": "https://cdn.example.com/smartphone-x.jpg",
      "created_at": "2025-11-15T10:30:00Z",
      "updated_at": "2025-12-01T08:45:00Z"
    }
  ]
}
```

---

### **Categories**
`/api/categories/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories/` | List all categories | None |
| POST | `/api/categories/` | Create new category | Token |
| GET | `/api/categories/{id}/` | Retrieve category details | None |
| PUT | `/api/categories/{id}/` | Update category | Token |
| DELETE | `/api/categories/{id}/` | Delete category | Token |

**Example Response** (GET `/api/categories/`):
```json
{
  "count": 8,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "category_name": "Electronics",
      "url_key": "electronics",
      "created_at": "2025-11-10T12:00:00Z",
      "products": [
        { "id": "...", "product_name": "Smartphone X", ... },
        { "id": "...", "product_name": "Laptop Pro", ... }
      ]
    }
  ]
}
```

---

### **Orders**
`/api/orders/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders/` | List user's orders (filtered by auth user) | Token |
| POST | `/api/orders/` | Create new order | Token |
| GET | `/api/orders/{id}/` | Retrieve order details | Token |
| PUT | `/api/orders/{id}/` | Update order status | Token |
| DELETE | `/api/orders/{id}/` | Cancel order | Token |

**Order Status Flow**: 
```
pending → paid → shipped → delivered
         ↘           ↙
          cancelled
```

**Example Request** (POST `/api/orders/`):
```json
{
  "items": [
    { "product_id": "550e8400-e29b-41d4-a716-446655440000", "quantity": 2 },
    { "product_id": "550e8400-e29b-41d4-a716-446655440002", "quantity": 1 }
  ]
}
```

**Example Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "status": "pending",
  "total_amount": "31999.98",
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "product": { ... },
      "quantity": 2,
      "price": "15999.99"
    }
  ],
  "created_at": "2025-12-01T09:15:00Z",
  "updated_at": "2025-12-01T09:15:00Z"
}
```

---

### **Payments**
`/api/payments/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/payments/` | List user's payments | Token |
| POST | `/api/payments/` | Initiate payment (M-Pesa STK push) | Token |
| GET | `/api/payments/{id}/` | Retrieve payment details | Token |

**Payment Methods**: `mpesa`, `card`, `paypal`
**Payment Status**: `pending`, `successful`, `failed`

**Example Request** (POST `/api/payments/`):
```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440010",
  "method": "mpesa",
  "phone_number": "+254712345678"
}
```

**M-Pesa Integration**:
- Uses **Safaricom MPESA API**
- STK push triggers USSD on customer's phone
- Callback webhook updates payment status
- Supports test credentials (provided in `/Safaricom APIs.postman_collection.json`)

---

### **Customers / Users**
`/api/customers/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/customers/` | List all users (admin only) | Admin Token |
| POST | `/api/customers/` | Register new user | None |
| GET | `/api/customers/{id}/` | Retrieve user profile | Token |
| PUT | `/api/customers/{id}/` | Update user profile | Token |

**Example Request** (POST `/api/customers/`):
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

---

## 4. Architecture & Design Patterns

### Project Structure
```
byteMtaaniBackend/
├── byteMtaaniBackend/           # Project settings
│   ├── settings.py              # Django configuration (DB, installed apps, middleware)
│   ├── urls.py                  # Root URL routing
│   ├── celery.py                # Celery configuration
│   └── wsgi.py                  # WSGI entry point
├── mtaani_app/                  # Main app
│   ├── models.py                # Data models (User, Product, Order, Payment, etc.)
│   ├── views.py                 # ViewSets for REST endpoints
│   ├── serializers.py           # Serializers for model validation & response formatting
│   ├── urls.py                  # App-level URL routing
│   ├── mpesa.py                 # M-Pesa payment integration
│   ├── tasks.py                 # Celery async tasks
│   ├── signals.py               # Django signals (post-save hooks)
│   ├── utils.py                 # Helper utilities
│   ├── filters.py               # Query filters for ViewSets
│   └── migrations/              # Database migrations
├── staticfiles/                 # Collected static files (admin CSS, JS)
├── templates/                   # Django templates (if needed)
├── manage.py                    # Django CLI
├── Dockerfile                   # Docker configuration
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (git-ignored)
└── README.md
```

### Key Design Patterns

1. **ViewSet Pattern**
   - Django REST Framework ViewSets provide automatic CRUD endpoints
   - Example: `ProductViewSet` automatically generates `/api/products/` with GET, POST, PUT, DELETE

2. **Serializer Pattern**
   - Validates incoming data
   - Serializes models to JSON
   - Nested serializers for relationships (e.g., OrderSerializer includes OrderItemSerializer)

3. **Signal Pattern**
   - Post-save signals automatically update related fields (e.g., `in_stock` flag on Product)
   - Order creation signals trigger inventory updates

4. **Token Authentication**
   - DRF Token Auth for stateless API requests
   - Tokens stored in `auth_token_token` table
   - Client sends `Authorization: Token <token>` header

5. **Async Tasks (Celery)**
   - Long-running operations (email notifications, payment callbacks) run in background
   - Celery workers consume tasks from Redis queue
   - Improves API response time

6. **Filtering & Search**
   - `django-filter` provides QuerySet filtering
   - Full-text search on product names, descriptions

---

## 5. Tools & Frameworks

### Core Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| Django | 5.2.4 | Web framework |
| DRF | Latest | REST API toolkit |
| PostgreSQL | Latest | Production database |
| Gunicorn | Latest | WSGI HTTP server |
| Celery | 5.2+ | Async task queue |
| Redis | Latest | Message broker & cache |
| drf-yasg | Latest | Swagger/ReDoc API docs |
| django-cors-headers | Latest | CORS support |
| Requests | 2.30+ | HTTP client for external APIs |

### Development Tools

- **Docker**: Containerization (Dockerfile provided)
- **Git**: Version control
- **Postman**: API testing (`Safaricom APIs.postman_collection.json`)
- **Django Admin**: Built-in admin panel for data management

### Testing & Quality
- **pytest**: Unit and integration tests
- **Coverage.py**: Code coverage reporting
- **Flake8**: Code linting

---

## 6. Features

### ✅ Implemented

1. **User Authentication**
   - Custom User model with email login
   - Token-based auth for API
   - Superuser/staff roles

2. **Product Management**
   - Full CRUD operations
   - Category organization
   - Stock tracking (indexed for performance)
   - Image URL support
   - Auto-sync `in_stock` flag

3. **Shopping & Orders**
   - Cart-like order creation
   - OrderItem linking products to orders
   - Order status tracking (pending → paid → shipped → delivered → cancelled)
   - Automatic total amount calculation

4. **Payment Processing**
   - M-Pesa integration (STK push)
   - Card & PayPal placeholders (extensible)
   - Transaction ID tracking
   - Payment callback webhook handling

5. **API Documentation**
   - Swagger UI at `/api/docs/` (via drf-yasg)
   - ReDoc at `/api/redoc/`
   - Auto-generated from docstrings & serializers

6. **Performance Optimizations**
   - Database indexes on frequently queried fields
   - Pagination on list endpoints
   - Filtering & search
   - Connection pooling (via psycopg2)
   - Caching (Redis-backed via django-redis)

### 🚀 Extensible Areas

- Payment providers (Stripe, Flutterwave, etc.)
- Inventory alerts
- Email notifications (Celery tasks)
- Advanced analytics
- Product reviews & ratings
- Wishlist/favorites

---

## 7. Deployment

### Render Deployment

**Config**: See `render.yaml` at project root.

**Steps**:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Create Services on Render**
   - Backend (Docker):
     - Environment: Docker
     - Dockerfile: `byteMtaaniBackend/Dockerfile`
     - Env vars: `SECRET_KEY`, `DATABASE_URL` (PostgreSQL), `DEBUG=false`, `ALLOWED_HOSTS=*`, `CORS_ALLOWED_ORIGINS`
   - Frontend (Node):
     - Root: `byteMtaani/`
     - Build: `npm ci && npm run build`
     - Start: `npm run start`
     - Env: `NEXT_PUBLIC_API_BASE=https://<backend>.onrender.com`

3. **Database Migration**
   - Render automatically runs `python manage.py migrate` (if configured in Dockerfile)
   - Ensure `.env` or Render env vars include `DATABASE_URL`

4. **Verify**
   ```bash
   curl https://<backend>.onrender.com/api/products/
   # Should return JSON array of products
   ```

### Local Development

```bash
# Activate venv
source venv/bin/activate  # Mac/Linux
# or
.\venv\Scripts\Activate.ps1  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env
cp .env.example .env
# Edit .env with local DB credentials

# Migrate database
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start dev server
python manage.py runserver 8000

# In another terminal, start Celery worker (optional)
celery -A byteMtaaniBackend worker -l info
```

### Environment Variables

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database (Render Postgres or local MySQL/SQLite)
DATABASE_URL=postgresql://user:password@host:5432/dbname
# OR for local MySQL:
DB_NAME=byteMtaani_db
DB_USER=root
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4028,https://yourfrontend.com

# Redis (Celery)
REDIS_URL=redis://localhost:6379/0

# M-Pesa
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_BUSINESS_SHORTCODE=your_shortcode
```

---

## 8. Testing & Quality

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=mtaani_app

# Run specific test file
pytest mtaani_app/tests/test_models.py
```

### API Testing with Postman

1. Import `Safaricom APIs.postman_collection.json`
2. Set environment variables (API base URL, auth token)
3. Test endpoints: GET products, POST order, initiate payment

### Code Quality

```bash
# Lint with Flake8
flake8 mtaani_app/

# Type check (optional)
mypy mtaani_app/
```

---

## 📞 Support & Contact

- **Documentation**: See `README.md` in project root
- **API Docs**: http://localhost:8000/api/docs/ (Swagger)
- **Issues**: GitHub Issues

---

## 📝 License

This project is part of the ALX Backend Specialization program.

---

**Last Updated**: December 1, 2025
**Backend Version**: 1.0.0 (Deployed on Render)
