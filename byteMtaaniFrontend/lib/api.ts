
import { Product, Category, Order, OrderItem, Payment, PaginatedResponse } from '../interfaces/api';

// Use Render backend in production, localhost in development
export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_BASE || 'https://alx-project-nexus-bytemtaani-ecommerce.onrender.com';

/**
 * Generic fetch wrapper for API calls
 */
export async function fetchJSON(path: string, init?: RequestInit) {
  const res = await fetch(API_BASE + path, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * ============================
 * Products API
 * ============================
 */
export const getProducts = (filters?: { category?: string; search?: string; page?: number }) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  
  const query = params.toString();
  return fetchJSON(`/api/products/${query ? '?' + query : ''}`);
};

export const getProduct = (id: string) => fetchJSON(`/api/products/${id}/`);

/**
 * ============================
 * Categories API
 * ============================
 */
export const getCategories = () => fetchJSON('/api/categories/');
export const getCategory = (id: string) => fetchJSON(`/api/categories/${id}/`);

/**
 * ============================
 * Orders API
 * ============================
 */
export const getOrders = (userId?: string) => {
  const query = userId ? `?user=${userId}` : '';
  return fetchJSON(`/api/orders/${query}`);
};

export const getOrder = (id: string) => fetchJSON(`/api/orders/${id}/`);

export const createOrder = (data: Partial<Order>) =>
  fetchJSON('/api/orders/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateOrder = (id: string, data: Partial<Order>) =>
  fetchJSON(`/api/orders/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

/**
 * ============================
 * Payments API
 * ============================
 */
export const getPayments = (userId?: string) => {
  const query = userId ? `?user=${userId}` : '';
  return fetchJSON(`/api/payments/${query}`);
};

export const getPayment = (id: string) => fetchJSON(`/api/payments/${id}/`);

export const createPayment = (data: Partial<Payment>) =>
  fetchJSON('/api/payments/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

/**
 * ============================
 * Customers API
 * ============================
 */
export const getCustomers = () => fetchJSON('/api/customers/');
export const getCustomer = (id: string) => fetchJSON(`/api/customers/${id}/`);
