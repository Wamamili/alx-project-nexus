# Frontend-Backend Integration Guide

## Overview
The byteMtaani frontend (Next.js) is now integrated with the byteMtaaniBackend (Django REST API) for live product, category, order, and payment management.

## Setup Instructions

### 1. Backend Setup (Django)

#### Install dependencies:
```bash
cd byteMtaaniBackend
pip install -r requirements.txt
python manage.py migrate
```

#### Create a superuser (optional, for admin panel):
```bash
python manage.py createsuperuser
```

#### Run the backend server:
```bash
python manage.py runserver
# Or on a specific port:
python manage.py runserver 0.0.0.0:8000
```

The backend API will be available at `http://localhost:8000`

### 2. Frontend Setup (Next.js)

#### Install dependencies:
```bash
cd byteMtaani
npm install
```

#### Configure the API base URL (optional):
By default, the frontend expects the API at `http://localhost:8000`. To change it, set the `NEXT_PUBLIC_API_BASE` environment variable:

```bash
# In .env.local or export before running
export NEXT_PUBLIC_API_BASE=http://localhost:8000
```

#### Run the frontend dev server:
```bash
npm run dev
# Frontend will be available at http://localhost:4028
```

## API Endpoints

The frontend connects to these backend endpoints:

### Products
- `GET /api/products/` - List all products (supports pagination, filtering, search)
- `GET /api/products/{id}/` - Get a single product

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get a single category

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create a new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/` - Update order status

### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/` - Create a payment
- `GET /api/payments/{id}/` - Get payment details

### Customers
- `GET /api/customers/` - List customers

## Backend API Response Format

### Products Response:
```json
{
  "id": "uuid",
  "product_name": "Product Name",
  "url_key": "product-name",
  "description": "Product description",
  "price": "99.99",
  "category": "uuid",
  "stock": 10,
  "in_stock": true,
  "image_url": "url/to/image.jpg",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### Paginated Response:
```json
{
  "count": 100,
  "next": "http://api.example.com/products/?page=2",
  "previous": null,
  "results": [...]
}
```

## Frontend API Client

The frontend API client is located in `lib/api.ts`. It includes:

- `getProducts()` - Fetch products with optional filters
- `getProduct(id)` - Fetch a single product
- `getCategories()` - Fetch categories
- `createOrder(data)` - Create an order
- `updateOrder(id, data)` - Update order status
- `createPayment(data)` - Create a payment

## Mock Data Fallback

If the backend API is unavailable, the frontend automatically falls back to mock data defined in `services/products.ts`. This ensures the frontend remains functional during development.

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:4028` (default Next.js port used in this project)
- `http://localhost:3000` (standard Next.js dev port)
- `http://localhost:4000`

For production, update the `CORS_ALLOWED_ORIGINS` in `byteMtaaniBackend/byteMtaaniBackend/settings.py`.

## Troubleshooting

### "Module not found: Can't resolve 'react-icons'"
```bash
npm install react-icons
```

### Backend returns 405 Method Not Allowed
Ensure the backend ViewSet is properly registered in `byteMtaaniBackend/urls.py`.

### CORS errors in browser console
Check that:
1. Backend is running on `http://localhost:8000`
2. Backend has `CORS_ALLOWED_ORIGINS` configured for your frontend URL
3. Backend middleware includes `corsheaders.middleware.CorsMiddleware`

### Products not loading
Check:
1. Backend database is initialized (`python manage.py migrate`)
2. Products exist in the database or mock data is being used
3. Browser console for network errors

## Database Setup

### Initialize the database:
```bash
python manage.py migrate
```

### Create sample data (optional):
```bash
python manage.py shell
# Inside the shell:
from mtaani_app.models import Category, Product

cat = Category.objects.create(Category_name="Electronics", url_key="electronics")
Product.objects.create(
    product_name="Wireless Headphones",
    url_key="wireless-headphones",
    description="High-quality wireless headphones",
    price=59.99,
    category=cat,
    stock=10,
    image_url="https://example.com/image.jpg"
)
exit()
```

## Environment Variables

### Backend (.env in byteMtaaniBackend)
```
DEBUG=true
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=mysql://user:password@localhost/byteMtaani
CORS_ALLOW_ALL_ORIGINS=false
```

### Frontend (.env.local in byteMtaani)
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## Development Workflow

1. Start the backend: `python manage.py runserver`
2. In a new terminal, start the frontend: `npm run dev`
3. Open http://localhost:4028 in your browser
4. Frontend will fetch data from http://localhost:8000

## Production Deployment

For production, you'll need to:

1. Set `DEBUG=false` in backend `.env`
2. Update `ALLOWED_HOSTS` in backend settings
3. Update `CORS_ALLOWED_ORIGINS` to your production domain
4. Set a strong `SECRET_KEY`
5. Use a production-grade database (PostgreSQL recommended)
6. Build the frontend: `npm run build`
7. Configure proper static file serving for both backend and frontend

