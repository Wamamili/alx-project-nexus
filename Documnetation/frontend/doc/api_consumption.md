api_consumption.md
API Consumption Guide

This guide outlines how the frontend interacts with the backend. The goal is consistency, predictable data flow, and clean integration across features.

Service Layer Structure

All backend communication moves through a dedicated service layer.

Location
src/services

Structure
src/services
├─ auth.service.ts
├─ products.service.ts
├─ orders.service.ts
├─ payments.service.ts
└─ http.ts

Principles
• No direct API calls inside components.
• Every feature gets its own service file.
• Shared logic stays in http.ts.

HTTP Client Pattern

http.ts centralizes API behavior.

Features
• Base URL
• JSON handling
• Error mapping
• Authorization header injection
• GET, POST, PUT, DELETE helpers

Pattern Example
const request = async (url: string, options: RequestInit) => {
const token = localStorage.getItem("auth_token");

const headers = {
"Content-Type": "application/json",
Authorization: token ? "Bearer " + token : ""
};

const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
...options,
headers
});

if (!response.ok) {
throw new Error("Request failed");
}

return response.json();
};

export const http = {
get: (url: string) => request(url, { method: "GET" }),
post: (url: string, body: object) =>
request(url, { method: "POST", body: JSON.stringify(body) }),
put: (url: string, body: object) =>
request(url, { method: "PUT", body: JSON.stringify(body) }),
delete: (url: string) => request(url, { method: "DELETE" })
};

Feature Service Example

products.service.ts
import { http } from "./http";

export const ProductsService = {
getAll: () => http.get("/products"),
getOne: (id: string) => http.get("/products/" + id),
search: (query: string) => http.get("/products?search=" + query)
};

Environment Variables

Frontend uses environment variables for secure configuration.

File
.env.local

Example
NEXT_PUBLIC_API_URL=https://api.example.com

NEXT_PUBLIC_CHAPA_PUBLIC_KEY=pk_xxxxxxx

Rules
• All exposed variables start with NEXT_PUBLIC_
• No secrets stored in the frontend
• Backend secrets remain server-side

Authentication Handling

Token Storage
localStorage stores access tokens for simplicity.
For improved security, switch to httpOnly cookies during production hardening.

Attaching Tokens
Authorization: Bearer token

Auto-attach is handled in http.ts

Error Handling Pattern

Errors are normalized inside http.ts to avoid noisy logic in components.

Component usage
try {
const data = await ProductsService.getAll();
setProducts(data);
} catch (e) {
setError("Something went wrong. Please retry.");
}

API Response Typing

Every response from backend is typed.

Example
interface Product {
id: string
name: string
price: number
image: string
}

interface ApiResponse<T> {
success: boolean
data: T
}

Typed usage
const response: ApiResponse<Product[]> = await ProductsService.getAll();

Authentication Headers and Protected Routes

Protecting frontend pages
Use middleware.ts or client-side redirects.

Middleware Example (Next.js)
export function middleware(req) {
const token = req.cookies.get("access_token");
if (!token) return NextResponse.redirect("/login");
return NextResponse.next();
}

Fetch Patterns in Components

Simple usage
const load = async () => {
const response = await OrdersService.getUserOrders();
setOrders(response.data);
};

useEffect(() => {
load();
}, []);

Summary Rules

• Services own API logic
• Components consume clean methods
• Tokens attach automatically
• Errors handled centrally
• Responses strictly typed
• No direct fetch calls inside UI
• Use environment variables for configuration