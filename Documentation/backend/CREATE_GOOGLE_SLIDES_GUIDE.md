# Quick Guide: Create ByteMtaani Google Slides Presentation

## Option A: Manual Creation (15-20 minutes)

### Step 1: Create New Presentation
1. Go to [Google Slides](https://docs.google.com/presentation/)
2. Click **"+ New"** → **"Blank presentation"**
3. Name it: `ByteMtaani Backend - Technical Presentation`
4. Set theme: Choose **"Modern Writer"** or **"Simple Light"** theme
5. Apply colors:
   - Primary: `#003F62` (dark blue)
   - Accent: `#EDA415` (gold)

---

## Step 2: Build Slides (18 slides total)

### Template for Each Slide:
```
Slide Title (54pt, bold)
├── Subtitle or content
├── Bullet points (28-32pt)
└── Speaker notes (click "Notes" at bottom)
```

---

### SLIDE 1: Title Slide
**Edit → "Title Slide"** layout

**Title**: `ByteMtaani Backend API`
**Subtitle**: `E-Commerce Platform | Django REST Framework`
**Add Image**: Upload ByteMtaani logo (if available)
**Footer**: `ALX Backend Specialization | December 2025`

**Speaker Notes**:
```
Welcome mentors and team. This presentation covers the complete 
backend architecture and API design. We'll walk through data model, 
API endpoints, tools, and deployment. Duration: ~15-20 minutes + Q&A.
```

---

### SLIDE 2: Project Overview
**Layout**: Title and Content

**Title**: `What is ByteMtaani?`

**Content** (Add as bullet list):
- Full-stack e-commerce platform for electronics in Kenya
- Backend: Django 5.2.4 + Django REST Framework
- Frontend: Next.js 14 (React 18, TypeScript, Tailwind CSS)
- Database: PostgreSQL (production), SQLite/MySQL (local)
- Key Features:
  - Product catalog with categories
  - User authentication & authorization
  - Shopping orders & order management
  - Payment processing (M-Pesa integration)
  - RESTful API for frontend consumption

**Speaker Notes**:
```
ByteMtaani is an e-commerce platform targeting the East African market. 
We focused on clean API design, scalability, and real-world payment 
integration. Both frontend and backend are production-ready and deployed 
on Render. The backend provides a complete REST API that can be used 
by any frontend (web, mobile, etc.).
```

---

### SLIDE 3: High-Level Architecture
**Layout**: Title and Content

**Title**: `System Architecture`

**Add Image/Diagram**: 
- Insert → Drawing → Create diagram with boxes and arrows
  - Client Layer (Next.js)
  - API Gateway (NGINX)
  - Django REST Framework
  - PostgreSQL, Redis, Celery

OR use text box with ASCII art (select monospace font):
```
┌─────────────────────────────────────────────┐
│ CLIENT LAYER: Frontend (Next.js)            │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│ API GATEWAY: NGINX (Load balancing, CORS)   │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│ Django REST Framework Layer                 │
│ • Authentication  • ViewSets                │
│ • Serializers     • Permissions             │
│ • Filtering       • Documentation           │
└──┬────────────────────┬─────────────┬───────┘
   ▼                    ▼             ▼
PostgreSQL          Redis          Celery
```

**Speaker Notes**:
```
Clean layered architecture separating concerns. Django REST Framework 
handles API logic. PostgreSQL is our primary data store. Redis caches 
data and runs Celery task queue. External APIs like M-Pesa are called 
from async Celery workers.
```

---

### SLIDE 4: Data Model Overview (ERD)
**Layout**: Title and Content

**Title**: `Entity Relationship Diagram`

**Add Image/Diagram**: Create visual ERD showing:
- 6 entities: USER, CATEGORY, PRODUCT, ORDER, ORDERITEM, PAYMENT
- Relationships with cardinality (1-M, 1-1)
- Use different colors for each entity

**Text Callout**:
```
6 Core Entities:
1. User - Customers and admins
2. Category - Product categories
3. Product - Items for sale
4. Order - Customer purchases
5. OrderItem - Line items in orders
6. Payment - Payment transactions
```

**Speaker Notes**:
```
We have 6 carefully designed entities. Relations are optimized for 
queries and referential integrity. This design ensures data consistency 
and query performance. User can have multiple orders and payments. 
Each order contains multiple OrderItems. Payment is 1-to-1 with Order.
```

---

### SLIDE 5: Entity Details - User & Category
**Layout**: Title, two columns

**Title**: `Core Entities: User & Category`

**LEFT Column**:
```
User (PK: id UUID)
├── username (String, unique)
├── email (String, unique)
├── is_admin (Boolean)
├── is_staff (Boolean)
└── date_joined (DateTime)

Relations:
• orders (1-to-M)
• payments (1-to-M)
```

**RIGHT Column**:
```
Category (PK: id UUID)
├── category_name (String, unique)
├── url_key (String, unique)
└── created_at (DateTime)

Relations:
• products (1-to-M)
```

**Speaker Notes**:
```
Custom User model allows login with email instead of username. 
All IDs are UUIDs for distributed systems. Category url_key enables 
SEO-friendly URLs.
```

---

### SLIDE 6: Entity Details - Product
**Layout**: Title and Content

**Title**: `Core Entities: Product`

**Add two-column layout**:

**LEFT Column** (Code/Details):
```
Product (PK: id UUID)
├── product_name (String, indexed)
├── url_key (String, unique)
├── description (Text)
├── price (Decimal 12,2, indexed)
├── category_id (FK)
├── stock (Integer, indexed)
├── in_stock (Boolean, auto-synced)
├── image_url (String)
├── created_at (DateTime)
└── updated_at (DateTime)
```

**RIGHT Column** (Key Features):
```
Key Features:
✓ Price & stock indexed for fast queries
✓ in_stock auto-synced with stock value
✓ Multiple database indexes
✓ Timestamps for audit trail
```

**Speaker Notes**:
```
Product is the core entity. Price and stock are indexed for fast 
filtering and sorting. in_stock is auto-synced with stock value. 
created_at and updated_at track record lifecycle.
```

---

### SLIDE 7: Entity Details - Order & OrderItem
**Layout**: Title, two columns

**Title**: `Core Entities: Order & OrderItem`

**LEFT Column**:
```
Order (PK: id UUID)
├── user_id (FK)
├── status (Enum, indexed)
├── total_amount (Decimal)
├── created_at (DateTime)
└── updated_at (DateTime)

Status Workflow:
pending → paid → shipped 
→ delivered → cancelled

Relations:
• items (1-to-M)
• payment (1-to-1)
```

**RIGHT Column**:
```
OrderItem (PK: id UUID)
├── order_id (FK)
├── product_id (FK)
├── quantity (Integer)
└── price (Decimal)

Purpose:
Links Order to Product
(Allows multiple products per order)
```

**Speaker Notes**:
```
Order tracks customer purchases with status workflow. OrderItem is 
a junction table enabling many-to-many relationship. Price is stored 
in OrderItem for historical accuracy.
```

---

### SLIDE 8: Entity Details - Payment
**Layout**: Title and Content

**Title**: `Core Entities: Payment`

**Add centered code block**:
```
Payment (PK: id UUID)
├── user_id (FK)
├── order_id (FK, unique 1-to-1)
├── amount (Decimal)
├── method (Enum: mpesa | card | paypal)
├── status (Enum: pending | successful | failed, indexed)
├── transaction_id (String, unique, indexed)
└── paid_at (DateTime, optional)

M-Pesa Integration:
✓ STK push triggers USSD on phone
✓ Callback webhook updates status
✓ Transaction ID for reconciliation
```

**Speaker Notes**:
```
Payment model connects Order with transaction details. method field 
is extensible for multiple payment providers. transaction_id uniquely 
identifies payment in external system. M-Pesa integration uses 
Safaricom API with real callback handling.
```

---

### SLIDE 9: API Endpoints - Products & Categories
**Layout**: Title and Content

**Title**: `REST API Endpoints (Part 1/2)`

**Add three sections**:

**Products Endpoints**:
```
GET    /api/products/          List (paginated)
POST   /api/products/          Create
GET    /api/products/{id}/     Retrieve
PUT    /api/products/{id}/     Update
DELETE /api/products/{id}/     Delete

Filters: category, price_min, price_max, in_stock, search
```

**Categories Endpoints**:
```
GET    /api/categories/
POST   /api/categories/
GET    /api/categories/{id}/
PUT    /api/categories/{id}/
DELETE /api/categories/{id}/
```

**Example Response** (smaller text):
```json
GET /api/products/?category=electronics
Response: 200 OK
{
  "count": 45,
  "results": [
    {
      "id": "550e8400-e29b-41d4-...",
      "product_name": "Smartphone X",
      "price": "15999.99",
      "in_stock": true
    }
  ]
}
```

**Speaker Notes**:
```
RESTful design following HTTP standards. Pagination prevents massive 
data transfers. Filters enable flexible queries. Full-text search on 
product name and description. Responses include nested relationships.
```

---

### SLIDE 10: API Endpoints - Orders & Payments
**Layout**: Title and Content

**Title**: `REST API Endpoints (Part 2/2)`

**Orders Endpoints**:
```
GET    /api/orders/            List user's orders (auth required)
POST   /api/orders/            Create new order (auth required)
GET    /api/orders/{id}/       Retrieve order (auth required)
PUT    /api/orders/{id}/       Update status (auth required)
DELETE /api/orders/{id}/       Cancel order (auth required)
```

**Payments Endpoints**:
```
GET    /api/payments/          List payments (auth required)
POST   /api/payments/          Initiate M-Pesa (auth required)
GET    /api/payments/{id}/     Retrieve payment (auth required)
```

**Example: Create Order** (code block):
```json
POST /api/orders/
{
  "items": [
    {"product_id": "...", "quantity": 2}
  ]
}
Response: 201 Created
{
  "id": "order-001",
  "status": "pending",
  "total_amount": "249.97"
}
```

**Speaker Notes**:
```
All order and payment endpoints require authentication. Order creation 
accepts list of products. Backend calculates total_amount automatically. 
Payment initiation triggers M-Pesa STK push.
```

---

### SLIDE 11: Authentication & Permissions
**Layout**: Title and Content

**Title**: `Authentication & Authorization`

**Add three sections**:

**Authentication Methods**:
```
1. Token Auth
   Authorization: Token <token>
   ✓ Stateless, ideal for frontend/mobile
   
2. Session Auth
   ✓ Cookies, for browsers
   
3. Permissions
   ✓ IsAuthenticatedOrReadOnly
   ✓ Anyone can GET, auth users can POST/PUT/DELETE
```

**Default Behavior**:
```
GET  /api/products/        ✓ Public
POST /api/products/        ✗ Auth required
GET  /api/orders/          ✗ Auth required (own only)
POST /api/payments/        ✗ Auth required
```

**Speaker Notes**:
```
Token auth makes API suitable for any client. Tokens are stateless. 
IsAuthenticatedOrReadOnly is a common pattern. Users can only see 
their own orders and payments (enforced in backend).
```

---

### SLIDE 12: Architecture & Design Patterns
**Layout**: Title and Content

**Title**: `Architecture & Design Patterns`

**Add bullet points**:
```
Design Patterns Used:
• ViewSet Pattern - Automatic CRUD endpoints
• Serializer Pattern - Validate input, serialize to JSON
• Signal Pattern - Post-save hooks (auto-sync in_stock)
• Token Authentication - Stateless API requests
• Async Tasks (Celery) - Background jobs
• Filtering & Search - Flexible QuerySet customization
```

**Code Snippet** (smaller font, monospace):
```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'in_stock']
    
    # Automatically generates 5 endpoints:
    # GET/POST /api/products/
    # GET/PUT/DELETE /api/products/{id}/
```

**Speaker Notes**:
```
ViewSets dramatically reduce boilerplate code. Serializers handle 
validation and type conversion. Signals keep related data in sync. 
Celery enables async processing without blocking API.
```

---

### SLIDE 13: Tools & Frameworks
**Layout**: Title and Content

**Title**: `Technology Stack`

**Add multiple columns/sections**:

**Backend**:
```
✓ Django 5.2.4
✓ Django REST Framework
✓ Gunicorn
✓ drf-yasg (Swagger/ReDoc)
```

**Database**:
```
✓ PostgreSQL (prod)
✓ SQLite (local)
✓ Redis (cache)
✓ psycopg2 (pooling)
```

**Async**:
```
✓ Celery 5.2+
✓ django-celery-beat
✓ django-celery-results
```

**Integration**:
```
✓ Requests (HTTP client)
✓ django-cors-headers
✓ python-dotenv
✓ Docker
```

**Speaker Notes**:
```
All tools chosen for production readiness. Django is batteries-included. 
PostgreSQL handles complex queries efficiently. Redis enables caching 
and async task processing. Docker ensures consistency.
```

---

### SLIDE 14: Key Features Implemented
**Layout**: Title and Content (icon-based)

**Title**: `Implemented Features`

**Add checkmarks + features**:
```
✓ User Authentication
  Custom User model, token-based auth, roles

✓ Product Management
  Full CRUD, categories, stock tracking, auto-sync

✓ Shopping & Orders
  Cart creation, line items, status workflow, auto total

✓ Payment Processing
  M-Pesa integration, STK push, callback handling

✓ API Documentation
  Swagger UI, ReDoc, auto-generated

✓ Performance Optimizations
  Database indexes, pagination, caching, pooling
```

**Speaker Notes**:
```
All features are production-tested and documented. M-Pesa integration 
is real. API docs auto-generate from code. Performance optimizations 
ensure scalability.
```

---

### SLIDE 15: Deployment Architecture
**Layout**: Title and Content

**Title**: `Deployment on Render`

**Add diagram or text**:
```
GitHub Repository → Render.com → (3 Services)
                                   ├─ Frontend (Next.js)
                                   ├─ Backend (Django)
                                   └─ Database (PostgreSQL)
```

**Environment Configuration**:
```
Backend:
• SECRET_KEY (encrypted)
• DATABASE_URL (managed Postgres)
• DEBUG=false
• ALLOWED_HOSTS=*
• CORS_ALLOWED_ORIGINS=https://frontend

Frontend:
• NEXT_PUBLIC_API_BASE=https://backend
```

**Deployment Steps**:
```
1. Push to GitHub (render.yaml included)
2. Create services on Render (from manifest)
3. Set environment variables
4. Auto-deploy on git push
5. Migrations run on startup
```

**Speaker Notes**:
```
Render provides managed PostgreSQL with backups. render.yaml simplifies 
service creation. Both frontend and backend deployed on same platform. 
Auto-deploy enables CI/CD workflow.
```

---

### SLIDE 16: Performance & Scalability
**Layout**: Title and Content

**Title**: `Performance & Scalability`

**Database Optimizations**:
```
Indexes on:
• Product: product_name, category, price, stock
• Order: user, status, created_at
• Payment: transaction_id, status

Pagination: 20 items per page (default)
```

**Caching Strategy**:
```
✓ Redis Cache (django-redis)
  Frequently accessed products, categories
  10-min TTL for result caching
```

**Async Processing**:
```
✓ Celery Tasks
  M-Pesa callbacks, email notifications
  Report generation, inventory updates
```

**Scalability Roadmap**:
```
1. Database Read Replicas
2. Full-text Search (Elasticsearch)
3. API Rate Limiting
4. Kubernetes (future)
5. Database Partitioning
6. CDN for static assets
```

**Speaker Notes**:
```
Current setup handles 1000+ concurrent users. Index strategy critical 
for product filtering. Caching reduces database load. Celery enables 
async processing. Architecture supports future scaling.
```

---

### SLIDE 17: Security & Best Practices
**Layout**: Title and Content

**Title**: `Security & Best Practices`

**Security Measures**:
```
✓ Password Hashing (PBKDF2)
✓ Token Security (40-char random, hashed)
✓ CORS Configuration (restrict origins)
✓ SQL Injection Prevention (ORM queries)
✓ Authentication Enforcement (permissions)
```

**Code Quality**:
```
✓ Type Hints
✓ Docstrings
✓ Error Handling
✓ Unit Tests (pytest)
✓ Code Linting (Flake8)
✓ Code Formatting (Black)
```

**Monitoring**:
```
✓ Django logging
✓ Render log streaming
✓ Sentry integration (optional)
✓ Performance monitoring (APM)
```

**Speaker Notes**:
```
Django provides built-in security by default. ORM prevents SQL injection. 
CORS prevents unauthorized cross-site requests. Token-based auth is 
stateless and scalable. Type hints improve maintainability.
```

---

### SLIDE 18: Thank You & Next Steps
**Layout**: Title and Content

**Title**: `Thank You!`

**Content**:
```
Questions?

Documentation:
📄 BACKEND_DOCUMENTATION.md (comprehensive)
📄 ERD_GUIDE.md (data model details)
📊 ByteMtaani_ERD.drawio (visual ERD)
🚀 render.yaml (deployment config)

API Docs:
🔗 Swagger: /api/docs/
🔗 ReDoc: /api/redoc/

GitHub:
🔗 https://github.com/Wamamili/alx-project-nexus

Next Steps:
1. Clone repository
2. Run locally
3. Test API
4. Integrate frontend
5. Deploy
```

**Speaker Notes**:
```
Thank you for attending. All code is open-source and well-documented. 
Feel free to clone, test, and extend. The documentation covers 
everything in detail. Happy to answer any questions.
```

---

## Option B: Quick Copy-Paste (Faster)

### If you want to speed up:

1. **Create Slide from Web**: Go to Google Slides → New presentation
2. **Copy Outline**: Copy the entire presentation outline from `GOOGLE_SLIDES_OUTLINE.md`
3. **Paste into Notes**: 
   - Create 18 blank slides
   - For each slide, paste the content into speaker notes
   - Copy titles to slide title boxes
   - Copy content to slide content areas
   - Use keyboard shortcuts to format

4. **Add Visuals**:
   - Use Insert → Drawing for diagrams
   - Use Insert → Image for logos/screenshots
   - Format code blocks with monospace font

5. **Share**:
   - Click Share button
   - Set to "Viewer" access for mentors
   - Copy link and send

---

## Option C: Use Google Slides Add-on

### "Slides Automation" or "Smart Slides" Add-on:
1. Open Google Slides
2. Extensions → Add-ons → Search for "Slides automation"
3. Use add-on to import structured data
4. Can batch-create slides from outline

---

## Tips for Professional Look

### Color Scheme (ByteMtaani Brand):
```
Primary: #003F62 (Dark Blue)
Accent: #EDA415 (Gold)
Text: #292D32 (Dark Gray)
Background: #FFFFFF (White)
```

### Font Recommendation:
- **Titles**: Montserrat Bold 54pt
- **Content**: Roboto 28-32pt
- **Code**: Courier New 20pt
- **Speaker Notes**: Default 12pt

### Slide Design Tips:
1. Keep text minimal (max 5 bullet points per slide)
2. Use images/diagrams for key concepts
3. Leave white space (don't overcrowd)
4. Use consistent formatting (align bullets, colors)
5. Add slide numbers (Insert → Slide number)
6. Preview before presenting

### Speaker Notes:
- Include timing for each slide (~1 min per slide)
- Add pronunciation guides for technical terms
- Include interesting facts or statistics
- Note when to click for animations

---

## Estimated Creation Time

| Task | Time |
|------|------|
| Create 18 blank slides | 2 min |
| Copy titles and content | 10 min |
| Format and style | 5 min |
| Add images/diagrams | 5 min |
| Add speaker notes | 5 min |
| Review and polish | 3 min |
| **Total** | **~30 minutes** |

---

## Download & Share

### Export Options:
1. **Download as PDF**: File → Download → PDF
2. **Download as PPTX**: File → Download → PowerPoint
3. **Share Link**: Click Share → Copy link (Viewer access)
4. **Email**: File → Share → Send via email

### Presenter View:
- Press 'N' during presentation to open speaker notes
- Alt-tab to switch between slides and other windows
- Use Presenter View in Google Slides for speaker notes + timer

---

**You're all set! Create the presentation and share it with your mentors. Good luck!**
