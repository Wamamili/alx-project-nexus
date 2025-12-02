"""Small Mpesa helper for sandbox/production STK push and status queries.

This module implements the minimal interactions needed by the app:
- obtain an OAuth token
- initiate an STK push (mobile payment prompt)
- query the STK push status

Configuration is via environment variables (set these in your `.env`):
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE` (BusinessShortCode / Lipa Na Mpesa shortcode)
- `MPESA_PASSKEY` (for STK push)
- `MPESA_ENV` (optional; `sandbox` or `production`, default `sandbox`)
- `MPESA_CALLBACK_URL` (callback URL for STK push)

Note: You must register for the Safaricom developer sandbox and use the credentials
from there for testing. This code is a light wrapper and reports responses
from Safaricom unchanged so you can inspect raw payloads.
"""

import os
import time
import base64
import requests

MPESA_ENV = os.getenv("MPESA_ENV", "sandbox")
MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE")
MPESA_PASSKEY = os.getenv("MPESA_PASSKEY")
MPESA_CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL", "")


def _base_url():
    return "https://sandbox.safaricom.co.ke" if MPESA_ENV == "sandbox" else "https://api.safaricom.co.ke"


def get_oauth_token():
    """Return OAuth access token string from Safaricom OAuth service."""
    if not (MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET):
        raise RuntimeError("Mpesa credentials not configured (MPESA_CONSUMER_KEY/SECRET)")
    url = f"{_base_url()}/oauth/v1/generate?grant_type=client_credentials"
    r = requests.get(url, auth=(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET), timeout=10)
    r.raise_for_status()
    data = r.json()
    return data.get("access_token")


def _timestamp():
    return time.strftime("%Y%m%d%H%M%S")


def _password(timestamp: str):
    if not (MPESA_SHORTCODE and MPESA_PASSKEY):
        raise RuntimeError("MPESA_SHORTCODE and MPESA_PASSKEY must be set for STK push")
    raw = f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{timestamp}".encode("utf-8")
    return base64.b64encode(raw).decode()


def initiate_stk_push(amount: float, phone_number: str, account_reference: str, transaction_desc: str = "Payment", callback_url: str = None):
    """Initiate STK push. Returns the raw response JSON.

    phone_number should be in the format 2547XXXXXXXX (no leading +)
    """
    token = get_oauth_token()
    url = f"{_base_url()}/mpesa/stkpush/v1/processrequest"
    timestamp = _timestamp()
    payload = {
        "BusinessShortCode": MPESA_SHORTCODE,
        "Password": _password(timestamp),
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url or MPESA_CALLBACK_URL,
        "AccountReference": account_reference,
        "TransactionDesc": transaction_desc,
    }
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    r = requests.post(url, json=payload, headers=headers, timeout=15)
    r.raise_for_status()
    return r.json()


def query_stk_status(checkout_request_id: str):
    """Query STK push status by `CheckoutRequestID`. Returns raw JSON."""
    token = get_oauth_token()
    url = f"{_base_url()}/mpesa/stkpushquery/v1/query"
    timestamp = _timestamp()
    payload = {
        "BusinessShortCode": MPESA_SHORTCODE,
        "Password": _password(timestamp),
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id,
    }
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    r = requests.post(url, json=payload, headers=headers, timeout=15)
    r.raise_for_status()
    return r.json()
