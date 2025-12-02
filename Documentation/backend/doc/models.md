Models Overview

This document outlines the core data models for the ByteMtaani backend. The goal is to keep the structure predictable, scalable, and easy to work with for both frontend and backend teams.

User Model

Fields

id

name


email

phone

password

is_verified

created_at

updated_at

Product Model

Fields

id

name

url_key

description

price

stock

main_image

category_id

created_at

updated_at

Category Model

Fields

id

name

url_key

created_at

updated_at

Cart Model

Fields

id

user_id

product_id

quantity

created_at

updated_at

Order Model

Fields

id

user_id

total_amount

payment_status

order_status

created_at

updated_at

Order Item Model

Fields

id

order_id

product_id

quantity

price

created_at

Payment Model

Fields

id

order_id

provider

tx_ref

status

amount

created_at

==========================

api_endpoints.md
API Endpoints Overview

This document lists the primary REST endpoints for the ByteMtaani backend. Each endpoint supports integration with web and mobile clients.

Auth Endpoints

POST /auth/register
Create user account.

POST /auth/login
Log in and return access token.

POST /auth/logout
End active session.

Product Endpoints

GET /products
List products.

GET /products/:id
Single product.

GET /categories
List categories.

Cart Endpoints

POST /cart/add
Add product to cart.

PATCH /cart/update/:id
Update quantity.

DELETE /cart/remove/:id
Remove product.

GET /cart
User cart.

Order Endpoints

POST /orders/create
Create order from cart.

GET /orders
List user orders.

GET /orders/:id
Single order.

Payment Endpoints

POST /payments/initialize
Start payment.

GET /payments/verify
Verify transaction.