payment_integration.md
Payment Integration Overview

ByteMtaani integrates external payment providers for secure online payments.

Integration Goals

Predictable initialize and verify APIs

Enforced security rules

Clean reconciliation

Clear audit trail

Initialize Payment

Endpoint
POST /payments/initialize

Process

Receive order_id

Validate order and total

Create payment record

Send request to provider

Receive checkout link or payment instructions

Return response to frontend

Verify Payment

Endpoint
GET /payments/verify

Process

Receive tx_ref

Query provider for transaction status

Match amount and reference

Update order and payment status

Return verified result

Rules

tx_ref is always unique

Payment status changes only after verification

Expired transactions are flagged and logged

Future Additions

Add webhooks

Add partial refunds

Add automated settlement logs

==============================

roles_and_permissions.md
Roles and Permissions Overview

ByteMtaani uses a simple but secure role-based access system for both users