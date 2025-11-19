API Flow Overview

This document describes how requests move through the ByteMtaani backend from the client to the database and back.

High Level Flow

Client sends a request to the API server.

Middleware validates authentication and request format.

Controller handles the business logic.

Service layer processes computations and validation.

Repository or ORM handles database interactions.

Response is formatted and returned to the client.

Request Lifecycle

Incoming Request

Validate headers

Validate body

Authenticate token when required

Controller Actions

Trigger services

Check permissions

Return structured response

Service Layer

Execute logic

Process transformations

Manage third-party integrations

Data Layer

Run SQL queries

Maintain ACID guarantees

Apply indexing rules

Response Rules

Always return JSON

Include status code

Return error messages with reason codes

Keep response predictable across endpoints

==============================