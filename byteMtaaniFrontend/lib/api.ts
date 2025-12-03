
import { Product, Category, Order, OrderItem, Payment, PaginatedResponse } from '../interfaces/api';

// Use Render backend in production, localhost in development
export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_BASE || 'https://alx-project-nexus-bytemtaani-ecommerce.onrender.com';

// Toggle to disable real API calls. Set NEXT_PUBLIC_USE_API=true to enable.
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Minimal mock data used when frontend runs standalone
const mockProducts: any[] = [
  { id: '1', product_name: 'Wireless Earbuds', price: 2499, url_key: 'earbuds', image: '/images/earbuds.jpg', in_stock: true, stock_count: 25 },
  { id: '2', product_name: 'Gaming Controller', price: 4599, url_key: 'controller', image: '/images/controller.jpg', in_stock: false, stock_count: 0 },
];

/**
 * Generic fetch wrapper for API calls
 */
export async function fetchJSON(path: string, init?: RequestInit) {
  if (!USE_API) {
    // Provide mock responses for common endpoints so frontend can run standalone
    if (path.startsWith('/api/products')) {
      const idMatch = path.match(/^\/api\/products\/(\d+)\/?/);
      if (idMatch) {
        const id = idMatch[1];
        const item = mockProducts.find((p) => p.id === id);
        if (item) return item;
        const notFound = { detail: 'Not found.' };
        return notFound;
      }
      // list (support pagination query strings)
      return { results: mockProducts } as any;
    }
    if (path.startsWith('/api/categories')) {
      return [] as any;
    }
    if (path.startsWith('/api/orders') || path.startsWith('/api/payments') || path.startsWith('/api/customers')) {
      return [] as any;
    }
    // default mock
    return {} as any;
  }

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
