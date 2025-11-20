ByteMtaani Backend Documentation
Database Design
Overview

The ByteMtaani e-commerce backend uses a relational PostgreSQL database designed for scalability, data integrity, and smooth integration with external services like payment gateways. The schema supports key marketplace features including product listings, order processing, payments, user roles, and category-based navigation.

Database Goals

Maintain clean relational links between core resources.

Ensure fast product filtering and search.

Support high-volume order activity without performance loss.

Allow both customers and admins to interact with the system safely.

Preserve historical transaction and pricing data.

Remain extensible for future features such as inventory tracking or vendor onboarding.

Mtaani Table Tables

The database includes the following primary tables:

Users

Categories

Products

Orders

OrderItems

Payments

Each model is optimized for relational mapping and real-world e-commerce workflows.

Table Fields
Users
Field	Type	Notes
id	UUID or INT	Primary key
username	VARCHAR	Unique
email	VARCHAR	Unique and required
password_hash	TEXT	Secured using hashing
is_admin	BOOLEAN	Role distinction
date_joined	TIMESTAMP	Auto timestamp
Categories
Field	Type	Notes
id	UUID or INT	Primary key
name	VARCHAR	Unique
slug	VARCHAR	URL friendly
created_at	TIMESTAMP	Timestamp
Products
Field	Type	Notes
id	UUID or INT	Primary key
name	VARCHAR	Product name
slug	VARCHAR	Used for URLs
description	TEXT	Product details
price	DECIMAL	Current price
category_id	FK to Categories	Category reference
in_stock	BOOLEAN	Availability
image_url	TEXT	Image file link
created_at	TIMESTAMP	Timestamp
updated_at	TIMESTAMP	On update
Orders
Field	Type	Notes
id	UUID or INT	Primary key
user_id	FK to Users	Owner of the order
status	ENUM	pending, paid, shipped, delivered, cancelled
total_amount	DECIMAL	Final cost
created_at	TIMESTAMP	Timestamp
updated_at	TIMESTAMP	Timestamp
OrderItems
Field	Type	Notes
id	UUID or INT	Primary key
order_id	FK to Orders	Parent order
product_id	FK to Products	Linked product
quantity	INT	Units ordered
price	DECIMAL	Price at purchase time
Payments
Field	Type	Notes
id	UUID or INT	Primary key
user_id	FK to Users	Payer
order_id	One-to-One FK to Orders	Payment tied to one order
amount	DECIMAL	Should match order total
method	ENUM	mpesa, card, paypal
status	ENUM	pending, successful, failed
transaction_id	VARCHAR	Provider reference
paid_at	TIMESTAMP	Confirmation time
Indexing

To ensure speed and reduce query load:

Products

Index on name

Index on category_id

Index on price

Orders

Index on user_id

Index on status

Index on created_at

Payments

Index on transaction_id

Index on status

ERD (Entity Relationship Diagram)
Structure Overview
Users (1) ------ (M) Orders ------ (M) OrderItems ------ (1) Products ------ (M) Categories

Users (1) ------ (M) Payments

Orders (1) ------ (1) Payments

Detailed Relationships

Users create many orders.

Each order contains multiple order items.

Each order item references a single product.

Products belong to categories.

Users can make many payments.

Each order has one payment record.

Security Rules

Passwords stored in hashed form only.

Only authenticated users can place orders or make payments.

Stock must be validated before order confirmation.

Payment must be verified before setting order status to “paid”.

Admin-only privileges required for product creation, updates, and category management.

Transaction IDs must be validated to prevent duplicate payments.
/assets/erd.png