# Quick Start: Running Frontend + Backend

## Step 1: Backend Setup & Start

Open a terminal in the project root:

```powershell
cd byteMtaaniBackend

# Install dependencies
pip install -r requirements.txt

# Run migrations to initialize database
python manage.py migrate

# Start the backend server on port 8000
python manage.py runserver
```

The backend will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/swagger/**

## Step 2: Frontend Setup & Start

Open a **second terminal** in the project root:

```powershell
cd byteMtaani

# Install dependencies (if not already done)
npm install

# Start the dev server on port 4028
npm run dev
```

The frontend will be available at: **http://localhost:4028**

## Step 3: Test the Integration

1. Open your browser to **http://localhost:4028**
2. Navigate to the Products page
3. The frontend will fetch products from the backend API at **http://localhost:8000/api/products/**
4. If the backend is running, you'll see real data; otherwise, you'll see mock data

## Endpoints

- **Frontend**: http://localhost:4028
- **Backend API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

## Troubleshooting

### Backend fails to start
```powershell
# Clear any existing .db files and migrate again
python manage.py migrate --run-syncdb
python manage.py runserver
```

### CORS errors in browser
Make sure:
1. Backend is running on `http://localhost:8000`
2. Backend settings include `CORS_ALLOWED_ORIGINS = [..., "http://localhost:4028", ...]`
3. Check browser DevTools Network tab for failed requests

### Products page shows only mock data
Check that:
1. Backend is running (`python manage.py runserver` in terminal)
2. Backend has data (add sample products via admin or shell)
3. Browser console for error messages

### react-icons module not found
```powershell
cd byteMtaani
npm install react-icons
```

## Database

The backend uses SQLite by default (`db.sqlite3`). To use a different database (MySQL, PostgreSQL), set the `DATABASE_URL` environment variable in a `.env` file.

## Creating Sample Data

```powershell
# In byteMtaaniBackend terminal, open Django shell
python manage.py shell

# Inside the shell:
from mtaani_app.models import Category, Product

cat = Category.objects.create(Category_name="Electronics", slug="electronics")
Product.objects.create(
    product_name="Wireless Headphones",
    slug="wireless-headphones",
    description="High-quality wireless headphones",
    price="59.99",
    category=cat,
    stock=10
)

exit()
```

Then refresh the frontend to see the new product.

## Next Steps

- See `INTEGRATION_GUIDE.md` for detailed integration documentation
- Check `byteMtaaniBackend/Safaricom APIs.postman_collection.json` for M-Pesa integration examples
- Review `byteMtaaniBackend/byteMtaaniBackend/settings.py` for configuration options
