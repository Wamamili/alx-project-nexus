# Backend (Django)

This folder contains a minimal Django project scaffold with Django REST Framework.

Quick start (Windows):

```powershell
# from repo root
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver 0.0.0.0:8000
```

API endpoint (after run): `http://localhost:8000/api/items/`
