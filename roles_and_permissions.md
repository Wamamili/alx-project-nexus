roles_and_permissions.md
Roles and Permissions Overview

ByteMtaani uses a simple but secure role-based access system for both users and administrators.

User Roles

Customer

Browse products

Manage cart

Place orders

Track orders

Vendor or Admin

Create and update products

Manage stock

View orders

Handle fulfillment

Issue refunds when needed

Super Admin

Full system access

Manage roles

Manage staff accounts

Override restricted actions

Permission Rules

Customers never access admin endpoints

Admin actions are protected with role guards

Sensitive logs are available only to super admins

All write actions require an authenticated user

Role Enforcement

Middleware checks role before granting access

Invalid roles return a forbidden response

All actions are logged for audit purposes

==============================

