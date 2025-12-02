/**
 * Backend API types matching byteMtaaniBackend models
 */

// ============================
// User
// ============================
export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_staff: boolean;
  date_joined: string;
}

// ============================
// Category
// ============================
export interface Category {
  id: string;
  Category_name: string;
  url_key: string;
  created_at: string;
}

// ============================
// Product
// ============================
export interface Product {
  id: string;
  product_name: string;
  url_key: string;
  description: string;
  price: number | string;
  category: string; // UUID or Category object
  stock: number;
  in_stock: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// ============================
// Order & OrderItem
// ============================
export interface OrderItem {
  id: string;
  order: string;
  product: string;
  quantity: number;
  price: number | string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  user: string;
  status: OrderStatus;
  total_amount: number | string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ============================
// Payment
// ============================
export type PaymentMethod = "mpesa" | "card" | "paypal";
export type PaymentStatus = "pending" | "successful" | "failed";

export interface Payment {
  id: string;
  user: string;
  order: string;
  amount: number | string;
  method: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

// ============================
// API Request / Response Types
// ============================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}
