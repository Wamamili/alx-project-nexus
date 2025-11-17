# Getting Started (backend + frontend)

This repository scaffold contains a minimal Django backend and a Next.js frontend.

Backend (Django)
- Path: `backend/`
- Use Python 3.10+ (3.11 is fine). Create a virtualenv and install `requirements.txt`.
- Run migrations and start the server on port 8000.

Frontend (Next.js)
- Path: `frontend/`
- Use Node.js 18+ recommended. Run `npm install` and `npm run dev` (port 3000).

Local dev flow
1. Start Django backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

2. Start Next frontend:

```bash
cd frontend
npm install
npm run dev
```

3. Visit `http://localhost:3000` to view the frontend. The frontend fetches `http://localhost:8000/api/items/`.

Notes
- For CORS during local development `django-cors-headers` is included and configured to allow all origins. For production restrict origins.
- The Django admin is available at `/admin/` — create a superuser to add items.
