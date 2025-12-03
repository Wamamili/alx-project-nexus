import { ReactNode } from "react";

//interfaces/index.ts
export type ID = string;

export interface Category {
  id: ID;
  name: string;
  url_key: string;
}

export interface Product {
  stockCount: number;
  product_name: string;
  id: string;
  title?: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  url_key?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}


export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';

export interface CartItem {
  product: Product;
  quantity: number;
}
