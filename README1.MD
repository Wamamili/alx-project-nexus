Project Nexus: Frontend Engineering Documentation
Project Summary

This repository serves as a central hub for documenting my progress, insights, and technical depth gained throughout the ProDev Frontend Engineering program. It captures practical learnings from real project work and showcases the core skills I have developed across modern frontend ecosystems.

Purpose of This Repository

The goal is to maintain a clear record of concepts, tools, workflows, and best practices I have mastered. This helps track growth, support collaboration with peers, and demonstrate competency in frontend engineering for professional opportunities.

Overview of the ProDev Frontend Program

The ProDev Frontend Engineering program delivers hands-on training in modern web development. The curriculum focuses on real-world implementation, teamwork, iterative problem solving, and end-to-end understanding of how frontend applications are built, deployed, and maintained.

The learning path includes:

Mobile and web development practices.

Progressive Web App development.

API consumption and integration.

Team-based engineering and project delivery.

Key Technologies Learned

Next.js for application structure and routing.

TypeScript for strong typing and predictable codebases.

Tailwind CSS for utility-first styling.

React for component-driven interfaces.

GraphQL for structured data querying.

REST APIs for backend integration.

PWA technologies for offline-ready web apps.

Git and GitHub for version control and collaboration.

Notable Concepts

Component architecture and reusable UI patterns.

State management and data flow.

System design fundamentals for frontend-heavy systems.

API integration patterns for scalable applications.

Performance optimization strategies.

Routing, caching, and user experience patterns.

Responsive design for mobile and desktop.

Challenges and Solutions

Complex UI layouts
Solved by breaking down interfaces into modular components and using Tailwind utility classes for consistent styling.

State synchronization across components
Addressed through structured state management patterns and controlled data flow.

API data handling
Solved with improved error handling, loading states, and reusable API utilities.

TypeScript errors
Reduced by enforcing strict typing rules and creating shared types across the application.





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

Core Tables

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

Next Steps

You can extend the backend documentation with:

Django model implementations

API endpoint specifications

Checkout workflow documentation

Stock management logic

Admin dashboard structure

Payment integration notes (M-PESA, Chapa, Stripe)