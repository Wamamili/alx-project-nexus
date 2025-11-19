pi_endpoints.md
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