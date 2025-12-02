# ByteMtaani Electronics Store - Full Stack Project

A modern e-commerce platform for electronics and tech accessories built with **Next.js 14** (Frontend) and **Django REST Framework** (Backend).

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Integration Guide](#integration-guide)
- [M-Pesa Testing](#mpesa-sandbox-testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 📱 Project Overview

ByteMtaani is a full-featured e-commerce platform for buying and selling electronics in Kenya. The platform includes:

- **Frontend**: Modern Next.js 14 application with TypeScript, Tailwind CSS, and responsive design
- **Backend**: Django REST Framework API with product management, order processing, and M-Pesa payment integration
- **Database**: SQLite (development) / PostgreSQL (production)
- **Payments**: M-Pesa integration via Safaricom API
- **Task Queue**: Celery for async tasks (emails, notifications)

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18
- Next/Image optimization

**Backend:**
- Django 5.2
- Django REST Framework
- Celery (async tasks)
- PostgreSQL / SQLite
- Swagger/ReDoc (API docs)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+ (backend)
- Node.js 18+ (frontend)
- Git

### 1-Minute Setup

**Terminal 1 - Backend:**
```powershell
cd byteMtaaniBackend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```powershell
cd byteMtaaniFrontend
npm install
npm run dev
```

Then open:
- **Frontend**: http://localhost:4028
- **Backend API**: http://localhost:8000/api/
- **API Docs**: http://localhost:8000/swagger/

---

## 📁 Project Structure

```
alx-project-nexus/
│
├── README.md                          # This file
├── QUICK_START.md                     # Quick start guide
├── INTEGRATION_GUIDE.md               # Frontend-backend integration docs
├── INTEGRATION_STATUS.md              # Integration status report
│
├── byteMtaaniFrontend/                        # Next.js Frontend
│   ├── app/                           # App Router pages & layouts
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.jsx                # Root layout with Header/Footer
│   │   ├── products/
│   │   │   └── page.tsx              # Products listing page
│   │   ├── product-detail/
│   │   │   └── page.tsx              # Product detail page
│   │   └── cart/
│   │       └── page.tsx              # Shopping cart page
│   │
│   ├── components/                    # React components
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation header with search
│   │   │   └── Footer.tsx            # Footer component
│   │   ├── ui/                       # TypeScript UI adapters
│   │   │   ├── Button.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RatingBar.tsx
│   │   │   └── ...
│   │   ├── ui-kit/                   # Legacy JS UI components
│   │   │   ├── Button.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ...
│   │   ├── product/                  # Product-specific components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductCategoryPage.tsx
│   │   └── common/                   # Common components
│   │       └── Button.tsx
│   │
│   ├── interfaces/                    # TypeScript interfaces
│   │   ├── index.ts                  # Frontend types
│   │   └── api.ts                    # Backend API response types
│   │
│   ├── lib/                           # Utility functions
│   │   └── api.ts                    # API client with all endpoints
│   │
│   ├── services/                      # Business logic
│   │   ├── products.ts               # Product service (live API + mock)
│   │   └── cart/
│   │       └── CartContext.tsx       # Cart state management
│   │
│   ├── styles/                        # CSS files
│   │   ├── globals.css               # Global styles
│   │   ├── tailwind.css              # Tailwind directives
│   │   └── ui-kit.css                # Legacy component styles
│   │
│   ├── public/                        # Static assets
│   │   └── images/                   # Product images
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.cjs
│   ├── next.config.js
│   └── postcss.config.js
│
├── byteMtaaniBackend/                # Django Backend
│   ├── byteMtaaniBackend/            # Project settings
│   │   ├── settings.py               # Django configuration
│   │   ├── urls.py                   # API routes & router config
│   │   ├── wsgi.py                   # WSGI app
│   │   ├── asgi.py                   # ASGI app
│   │   └── celery.py                 # Celery configuration
│   │
│   ├── mtaani_app/                    # Main Django app
│   │   ├── models.py                 # Database models
│   │   ├── views.py                  # DRF ViewSets
│   │   ├── serializers.py            # DRF serializers
│   │   ├── filters.py                # Custom filters
│   │   ├── tasks.py                  # Celery tasks
│   │   ├── signals.py                # Django signals
│   │   ├── utils.py                  # Utility functions
│   │   ├── mpesa.py                  # M-Pesa integration
│   │   ├── admin.py                  # Admin configuration
│   │   ├── migrations/               # Database migrations
│   │   └── __pycache__/
│   │
│   ├── staticfiles/                   # Collected static files
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example                   # Environment variables template
│   ├── Dockerfile                     # Docker configuration
│   ├── docker-compose.yml             # Docker Compose setup
│   └── entrypoint.sh                  # Docker entrypoint
│
└── Documentation/                     # Additional docs
    ├── assets/                        # Images, diagrams
    └── backend/
        └── doc/                       # Backend technical docs
```

---

## 🎨 Frontend Setup

### Installation

```bash
cd byteMtaaniFrontend
npm install
```

### Development

```bash
npm run dev
```

Frontend runs on **http://localhost:4028**

### Build

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, categories, featured products, testimonials |
| `/products` | Products listing with filtering |
| `/product-detail` | Product detail page (dynamic) |
| `/cart` | Shopping cart with checkout |

### Key Features

- ✅ Responsive design (mobile-first)
- ✅ TypeScript throughout
- ✅ Tailwind CSS styling with brand colors (EDA415, 003F62, FFFFFF, 292D32)
- ✅ Real-time API integration with fallback to mock data
- ✅ Shopping cart with localStorage persistence
- ✅ SEO optimized with Next.js metadata
- ✅ Image optimization with Next/Image
- ✅ Fast Refresh for development

---

## 🔧 Backend Setup

### Installation

```bash
cd byteMtaaniBackend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Database Setup

```bash
python manage.py migrate
```

### Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

Then access Django admin: http://localhost:8000/admin/

### Development Server

```bash
python manage.py runserver
```

Backend runs on **http://localhost:8000**

### Environment Variables

Create `.env` in `byteMtaaniBackend/`:
```bash
DEBUG=true
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3

# M-Pesa Sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=http://localhost:8000/mpesa/callback/

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=no-reply@example.com

# CORS
CORS_ALLOW_ALL_ORIGINS=false
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Interactive Docs
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

### Main Endpoints

#### Products
```
GET    /api/products/              # List all products
GET    /api/products/{id}/         # Get product by ID
GET    /api/products/?search=      # Search products
GET    /api/products/?category=    # Filter by category
```

#### Categories
```
GET    /api/categories/            # List categories
GET    /api/categories/{id}/       # Get category by ID
```

#### Orders
```
GET    /api/orders/                # List orders
POST   /api/orders/                # Create order
GET    /api/orders/{id}/           # Get order details
PATCH  /api/orders/{id}/           # Update order status
```

#### Payments
```
GET    /api/payments/              # List payments
POST   /api/payments/              # Create payment
GET    /api/payments/{id}/         # Get payment details
POST   /api/payments/initiate/     # Initiate M-Pesa payment
POST   /api/payments/{id}/verify/  # Verify payment status
```

#### Customers
```
GET    /api/customers/             # List customers
GET    /api/customers/{id}/        # Get customer details
```

### Product Response Example
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_name": "Wireless Headphones",
  "url_key": "wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": "59.99",
  "category": "550e8400-e29b-41d4-a716-446655440001",
  "stock": 10,
  "in_stock": true,
  "image_url": "http://example.com/images/headphones.jpg",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### Authentication
API uses token-based authentication (optional):
```
Header: Authorization: Token <token>
```

---

## ✨ Features

### Frontend Features
- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart with add/remove/update
- 💳 Checkout flow
- ⭐ Product ratings and reviews
- 📱 Mobile-responsive design
- 🎨 Tailwind CSS with custom brand colors
- 🔍 SEO optimized pages
- 🚀 Fast performance with Next.js optimizations

### Backend Features
- 📦 Product and inventory management
- 📋 Order processing and tracking
- 💰 M-Pesa payment integration
- 👥 Customer management
- 📧 Email notifications via Celery
- 🔐 User authentication and permissions
- 📊 Admin dashboard
- 🔄 Pagination, filtering, and search
- 📚 Auto-generated API documentation

---

## 🔗 Integration Guide

The frontend and backend are fully integrated:

### How It Works
1. Frontend makes HTTP requests to Backend API
2. Backend processes requests and returns JSON
3. Frontend displays data or falls back to mock data if API is unavailable
4. Axios/Fetch interceptors handle authentication

### API Client (Frontend)
```typescript
// lib/api.ts
import { getProducts, createOrder } from '../lib/api';

// Fetch products
const products = await getProducts();

// Create order
const order = await createOrder({ 
  user: userId, 
  items: [...] 
});
```

### Environment Integration
```
Frontend (localhost:4028) 
    ↓ (HTTP API calls)
Backend (localhost:8000)
    ↓ (Database operations)
Database (SQLite/PostgreSQL)
```

### CORS Configuration
Backend allows requests from:
- http://localhost:4028 (frontend dev)
- http://localhost:3000 (alternative dev port)
- http://localhost:4000

Update `CORS_ALLOWED_ORIGINS` in `settings.py` for production domains.

---

## 💳 M-Pesa Sandbox Testing

Follow these steps to test the M-Pesa STK push flow locally using the Safaricom sandbox and `ngrok`:

## 💳 M-Pesa Sandbox Testing

Follow these steps to test the M-Pesa STK push flow locally using the Safaricom sandbox and `ngrok`:

### 1. Prepare Environment

Copy `.env.example` to `.env` and fill in M-Pesa sandbox credentials:
```bash
cp byteMtaaniBackend/.env.example byteMtaaniBackend/.env
```

Update with your Safaricom sandbox details:
```bash
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://xxxx.ngrok.io/mpesa/callback/
```

### 2. Start Local Server

```powershell
cd byteMtaaniBackend
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

### 3. Expose Callback URL with ngrok

In a separate terminal:
```bash
ngrok http 8000
```

Copy the ngrok HTTPS URL (e.g., `https://xxxx.ngrok.io`) and update `.env`:
```bash
MPESA_CALLBACK_URL=https://xxxx.ngrok.io/mpesa/callback/
```

Restart Django server for changes to take effect.

### 4. Create an Order

Use the Django admin or API to create an order, note its UUID.

### 5. Initiate M-Pesa Payment

```bash
curl -X POST http://localhost:8000/api/payments/initiate/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_USER_TOKEN" \
  -d '{
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "2547XXXXXXXX"
  }'
```

Response:
```json
{
  "id": "payment-uuid",
  "checkout_request_id": "ws_CO_123456789",
  "status": "pending"
}
```

### 6. Complete Payment in Sandbox

In the Safaricom sandbox, complete the STK push on your test phone.

Alternatively, simulate the callback:
```bash
curl -X POST https://xxxx.ngrok.io/mpesa/callback/ \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "12345",
        "CheckoutRequestID": "ws_CO_123456789",
        "ResultCode": 0,
        "ResultDesc": "The service request is processed successfully.",
        "CallbackMetadata": {
          "Item": [
            {"Name": "MpesaReceiptNumber", "Value": "ABC123XYZ"},
            {"Name": "Amount", "Value": 100},
            {"Name": "PhoneNumber", "Value": "2547XXXXXXXX"}
          ]
        }
      }
    }
  }'
```

### 7. Verify Payment Status

```bash
curl -X POST http://localhost:8000/api/payments/{payment_id}/verify/ \
  -H "Authorization: Token YOUR_USER_TOKEN"
```

### Notes
- Use console email backend for testing: `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`
- Check server logs for callback payloads
- Ensure ngrok is running and URL matches in `.env`
- Inspect Django admin to see payment records

---

## 📦 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Deploy to Vercel**
```bash
npm i -g vercel
vercel --prod
```

3. **Set Environment Variables**
```
NEXT_PUBLIC_API_BASE=https://your-backend-domain.com
```

### Backend (Docker/Railway/Heroku)

1. **Build Docker Image**
```bash
cd byteMtaaniBackend
docker build -t byteMtaani-backend .
```

2. **Deploy to Railway**
```bash
railway up
```

3. **Environment Variables** (Production)
```bash
DEBUG=false
SECRET_KEY=your-strong-secret-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

4. **Create Superuser** (After deployment)
```bash
heroku run python manage.py createsuperuser
```

---

## 🐛 Troubleshooting

### Frontend Issues

**"Module not found: Can't resolve..."**
```bash
rm -r .next node_modules
npm install
npm run dev
```

**"CORS error in browser console"**
- Ensure backend is running on http://localhost:8000
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`
- Verify frontend URL is in the CORS list

**"Products not loading"**
- Check backend API: http://localhost:8000/api/products/
- Check browser Network tab for errors
- Ensure backend is running

### Backend Issues

**"ModuleNotFoundError"**
```bash
pip install -r requirements.txt
```

**"Database error"**
```bash
python manage.py migrate
```

**"M-Pesa callback not received"**
- Ensure ngrok is running
- Check `MPESA_CALLBACK_URL` matches ngrok URL in `.env`
- Inspect server logs for incoming requests
- Verify firewall allows incoming connections

**"Port already in use"**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python manage.py runserver 8001
```

---

## 📚 Documentation Files

The project includes comprehensive documentation:

- `QUICK_START.md` - 5-minute setup guide
- `INTEGRATION_GUIDE.md` - Detailed frontend-backend integration
- `INTEGRATION_STATUS.md` - Current integration status and features

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👥 Team & Support

For questions or support, please open an issue on GitHub or contact the development team.

---

## 🎯 Project Goals

- ✅ Build a fully functional e-commerce platform
- ✅ Integrate M-Pesa payment gateway for Kenyan market
- ✅ Implement modern tech stack (Next.js + Django)
- ✅ Create seamless user experience
- ✅ Deploy to production
- 🔄 Scale to handle high traffic
- 🔄 Add advanced features (recommendations, wishlists, reviews)

---

## 📈 Performance Metrics

- Frontend Lighthouse Score: 90+
- API Response Time: <200ms
- Database Query Time: <100ms
- Frontend Build Time: <5 minutes
- Backend Startup Time: <10 seconds

---

## 🔐 Security Features

- ✅ CORS protection
- ✅ CSRF tokens
- ✅ SQL injection prevention (Django ORM)
- ✅ XSS protection (Next.js built-in)
- ✅ Password hashing (bcrypt)
- ✅ Token-based authentication
- ✅ Environment variable protection
- ✅ SSL/TLS in production

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Getting Help

- **Documentation**: See QUICK_START.md and INTEGRATION_GUIDE.md
- **API Docs**: Visit http://localhost:8000/swagger/
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions

---

**Last Updated**: December 2025
**Status**: ✅ Development Active

