# ByteMtaani API Testing Guide

## Overview

This guide helps you test the ByteMtaani backend API. All test data is provided in `API_TEST_DATA.json`.

---

## Quick Start

### 1. Start the Backend Server

```bash
cd byteMtaaniBackend
python manage.py runserver
# Server runs on http://localhost:8000
```

### 2. Access API Documentation

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/
- **API Root**: http://localhost:8000/api/

---

## Base URL

```
http://localhost:8000/api/
```

---

## Authentication

### Get Token

**Request:**
```bash
curl -X POST http://localhost:8000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wamamiliclinton",
    "email": "wamamiliclinton@gmail.com",
    "password": "12345"
  }'
```

**Response:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Use Token in Requests

Add token to all authenticated requests:

```bash
curl -X GET http://localhost:8000/api/orders/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
```

---

## API Endpoints

### Products

#### List All Products

**Request:**
```bash
GET http://localhost:8000/api/products/
```

**Response:**
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "product_name": "Wireless Earbuds Pro",
      "url_key": "wireless-earbuds-pro",
      "description": "High-quality wireless earbuds with noise cancellation",
      "price": "2499.99",
      "category": "550e8400-e29b-41d4-a716-446655440000",
      "stock": 45,
      "in_stock": true,
      "image_url": "/images/products/earbuds-pro.jpg",
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

#### Filter Products by Category

**Request:**
```bash
GET http://localhost:8000/api/products/?category=550e8400-e29b-41d4-a716-446655440002
```

#### Filter by Price Range

**Request:**
```bash
GET http://localhost:8000/api/products/?price_min=1000&price_max=50000
```

#### Filter by Stock Status

**Request:**
```bash
GET http://localhost:8000/api/products/?in_stock=true
```

#### Search Products

**Request:**
```bash
GET http://localhost:8000/api/products/?search=earbuds
```

#### Get Single Product

**Request:**
```bash
GET http://localhost:8000/api/products/650e8400-e29b-41d4-a716-446655440000/
```

#### Create Product (Admin Only)

**Request:**
```bash
POST http://localhost:8000/api/products/
Authorization: Token <your_token>
Content-Type: application/json

{
  "product_name": "New Gaming Headset",
  "url_key": "gaming-headset",
  "description": "Premium gaming headset with surround sound",
  "price": "5999.99",
  "category": "550e8400-e29b-41d4-a716-446655440002",
  "stock": 20,
  "image_url": "/images/products/headset.jpg"
}
```

#### Update Product (Admin Only)

**Request:**
```bash
PUT http://localhost:8000/api/products/650e8400-e29b-41d4-a716-446655440000/
Authorization: Token <your_token>
Content-Type: application/json

{
  "product_name": "Wireless Earbuds Pro Max",
  "stock": 50
}
```

#### Delete Product (Admin Only)

**Request:**
```bash
DELETE http://localhost:8000/api/products/650e8400-e29b-41d4-a716-446655440000/
Authorization: Token <your_token>
```

---

### Productions (All Products - Cached)

#### Get All Productions

**Request:**
```bash
GET http://localhost:8000/productions/
```

**Response:**
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "product_name": "Wireless Earbuds Pro",
    "url_key": "wireless-earbuds-pro",
    "price": "2499.99",
    "in_stock": true,
    "image_url": "/images/products/earbuds-pro.jpg"
  }
]
```

**Note:** This endpoint is cached for 15 minutes at the view level.

---

### Categories

#### List All Categories

**Request:**
```bash
GET http://localhost:8000/api/categories/
```

**Response:**
```json
{
  "count": 4,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "category_name": "Electronics",
      "url_key": "electronics",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Category (Admin Only)

**Request:**
```bash
POST http://localhost:8000/api/categories/
Authorization: Token <your_token>

{
  "category_name": "Tablets",
  "url_key": "tablets"
}
```

---

### Orders

#### List My Orders (Auth Required)

**Request:**
```bash
GET http://localhost:8000/api/orders/
Authorization: Token <your_token>
```

#### Create Order

**Request:**
```bash
POST http://localhost:8000/api/orders/
Authorization: Token <your_token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": "650e8400-e29b-41d4-a716-446655440000",
      "quantity": 1
    },
    {
      "product_id": "650e8400-e29b-41d4-a716-446655440004",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "id": "850e8400-e29b-41d4-a716-446655440003",
  "user": "750e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440005",
      "product": {
        "id": "650e8400-e29b-41d4-a716-446655440000",
        "product_name": "Wireless Earbuds Pro",
        "price": "2499.99"
      },
      "quantity": 1,
      "price": "2499.99"
    }
  ],
  "status": "pending",
  "total_amount": "3299.97",
  "created_at": "2025-01-16T10:30:00Z",
  "updated_at": "2025-01-16T10:30:00Z"
}
```

#### Get Single Order

**Request:**
```bash
GET http://localhost:8000/api/orders/850e8400-e29b-41d4-a716-446655440000/
Authorization: Token <your_token>
```

#### Update Order Status

**Request:**
```bash
PUT http://localhost:8000/api/orders/850e8400-e29b-41d4-a716-446655440000/
Authorization: Token <your_token>

{
  "status": "shipped"
}
```

#### Delete Order

**Request:**
```bash
DELETE http://localhost:8000/api/orders/850e8400-e29b-41d4-a716-446655440000/
Authorization: Token <your_token>
```

---

### Payments

#### List Payments (Auth Required)

**Request:**
```bash
GET http://localhost:8000/api/payments/
Authorization: Token <your_token>
```

#### Initiate M-Pesa Payment

**Request:**
```bash
POST http://localhost:8000/api/payments/initiate/
Authorization: Token <your_token>
Content-Type: application/json

{
  "order_id": "850e8400-e29b-41d4-a716-446655440000",
  "phone": "254712345678"
}
```

**Response:**
```json
{
  "payment_id": "a50e8400-e29b-41d4-a716-446655440003",
  "checkout_request_id": "ws_CO_01122025101530773712345678",
  "raw": {
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing"
  }
}
```

#### Verify Payment Status

**Request:**
```bash
POST http://localhost:8000/api/payments/a50e8400-e29b-41d4-a716-446655440000/verify/
Authorization: Token <your_token>
Content-Type: application/json

{
  "checkout_request_id": "ws_CO_01122025101530773712345678"
}
```

**Response:**
```json
{
  "detail": "Payment marked successful",
  "raw": {
    "ResponseCode": "0",
    "ResultCode": 0,
    "ResultDesc": "The transaction has been completed successfully"
  }
}
```

---

### Customers

#### List All Users (Auth Required)

**Request:**
```bash
GET http://localhost:8000/api/customers/
Authorization: Token <your_token>
```

#### Get User Profile

**Request:**
```bash
GET http://localhost:8000/api/customers/750e8400-e29b-41d4-a716-446655440000/
Authorization: Token <your_token>
```

---

### Cache Metrics

#### Get Cache Performance Metrics

**Request:**
```bash
GET http://localhost:8000/cache-metrics/
```

**Response:**
```json
{
  "connected": true,
  "commands_processed": 1234,
  "connected_clients": 2,
  "used_memory": "2.5M",
  "keyspace": {
    "db0": {
      "keys": 42,
      "expires": 10,
      "avg_ttl": 450000
    }
  }
}
```

---

## Testing with cURL

### Example: Full Order Flow

#### 1. Get Products
```bash
curl http://localhost:8000/api/products/
```

#### 2. Create Order
```bash
curl -X POST http://localhost:8000/api/orders/ \
  -H "Authorization: Token <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": "650e8400-e29b-41d4-a716-446655440000", "quantity": 1}
    ]
  }'
```

#### 3. Initiate Payment
```bash
curl -X POST http://localhost:8000/api/payments/initiate/ \
  -H "Authorization: Token <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "850e8400-e29b-41d4-a716-446655440000",
    "phone": "254712345678"
  }'
```

#### 4. Verify Payment
```bash
curl -X POST http://localhost:8000/api/payments/a50e8400-e29b-41d4-a716-446655440000/verify/ \
  -H "Authorization: Token <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "checkout_request_id": "ws_CO_01122025101530773712345678"
  }'
```

---

## Testing with Postman

### 1. Create Collection
- Open Postman
- Click "New" → "Collection"
- Name: `ByteMtaani API`

### 2. Add Environment Variables
- Click "Environments" → "New"
- Add variables:
  - `base_url`: `http://localhost:8000`
  - `api_token`: `<your_token>`
  - `phone`: `254712345678`

### 3. Create Requests
- Use `{{base_url}}/api/products/` in URLs
- Use `{{api_token}}` in Authorization headers
- Use `{{phone}}` in request bodies

### 4. Import from Swagger
- Go to: `http://localhost:8000/swagger/?format=openapi`
- Copy JSON
- In Postman: File → Import → Paste Raw Data

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data",
  "errors": {
    "price": ["Ensure this value is greater than or equal to 0"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 502 Bad Gateway (M-Pesa Error)
```json
{
  "detail": "Failed to initiate Mpesa payment",
  "error": "Connection timeout"
}
```

---

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)

### Example
```bash
GET http://localhost:8000/api/products/?page=2&page_size=10
```

### Response
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/products/?page=3&page_size=10",
  "previous": "http://localhost:8000/api/products/?page=1&page_size=10",
  "results": [...]
}
```

---

## Filtering & Search

### Available Filters
- **Products**:
  - `category`: Filter by category UUID
  - `price_min`: Minimum price
  - `price_max`: Maximum price
  - `in_stock`: true/false
  - `search`: Search by name or description

### Examples

```bash
# Filter by category
GET http://localhost:8000/api/products/?category=550e8400-e29b-41d4-a716-446655440000

# Price range
GET http://localhost:8000/api/products/?price_min=1000&price_max=50000

# In stock only
GET http://localhost:8000/api/products/?in_stock=true

# Search
GET http://localhost:8000/api/products/?search=laptop

# Combine filters
GET http://localhost:8000/api/products/?category=550e8400-e29b-41d4-a716-446655440001&in_stock=true&price_max=100000
```

---

## Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request successful |
| 201 | Created | POST request successful |
| 204 | No Content | DELETE request successful |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing token |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |
| 502 | Bad Gateway | External service error (M-Pesa) |

---

## Common Scenarios

### Scenario 1: Browse Products

```bash
# 1. List all products
curl http://localhost:8000/api/products/

# 2. Filter by category
curl http://localhost:8000/api/products/?category=550e8400-e29b-41d4-a716-446655440002

# 3. Get single product details
curl http://localhost:8000/api/products/650e8400-e29b-41d4-a716-446655440000/
```

### Scenario 2: Place Order

```bash
# 1. Get token
curl -X POST http://localhost:8000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "pass"}'

# 2. Create order
curl -X POST http://localhost:8000/api/orders/ \
  -H "Authorization: Token <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": "650e8400-e29b-41d4-a716-446655440000", "quantity": 2}
    ]
  }'

# 3. View order
curl http://localhost:8000/api/orders/850e8400-e29b-41d4-a716-446655440000/ \
  -H "Authorization: Token <token>"
```

### Scenario 3: Process Payment

```bash
# 1. Get token (from Scenario 2)

# 2. Initiate M-Pesa payment
curl -X POST http://localhost:8000/api/payments/initiate/ \
  -H "Authorization: Token <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "850e8400-e29b-41d4-a716-446655440000",
    "phone": "254712345678"
  }'

# 3. Verify payment (after user completes M-Pesa prompt)
curl -X POST http://localhost:8000/api/payments/<payment_id>/verify/ \
  -H "Authorization: Token <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "checkout_request_id": "<checkout_request_id_from_step_2>"
  }'
```

---

## Notes

- All IDs are UUIDs (use actual UUIDs from your database)
- Passwords must be at least 8 characters
- Stock is automatically decremented when orders are created
- Payments use real M-Pesa API (requires phone in correct format: 254XXXXXXXXX)
- Callbacks from M-Pesa are handled automatically
- Cache TTL for products is 15 minutes

---

## Troubleshooting

### Issue: "Authentication credentials were not provided"
**Solution**: Add `Authorization: Token <your_token>` header

### Issue: "Invalid category ID"
**Solution**: Use actual category UUID from database (not hardcoded)

### Issue: "Product out of stock"
**Solution**: Check `in_stock` field; create new product with stock > 0

### Issue: "M-Pesa payment failed"
**Solution**: 
- Verify phone format: `254XXXXXXXXX`
- Check M-Pesa API credentials in environment variables
- Verify account has sufficient balance

### Issue: "Permission denied"
**Solution**: Ensure token belongs to admin user for admin operations

---

## Environment Variables Required

```bash
# M-Pesa Configuration
MPESA_CONSUMER_KEY=<your_key>
MPESA_CONSUMER_SECRET=<your_secret>
MPESA_BUSINESS_CODE=<your_code>
MPESA_SHORTCODE=<your_shortcode>
MPESA_PASSKEY=<your_passkey>

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/byteMtaani

# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# Redis (optional)
REDIS_URL=redis://localhost:6379/0
```

---

## Performance Tips

1. Use `/productions/` endpoint for cached product list
2. Add pagination: `?page=1&page_size=20`
3. Use filters to narrow down results
4. Cache frequently accessed data in frontend
5. Monitor cache metrics: `GET /cache-metrics/`

---

**Happy Testing! 🚀**
