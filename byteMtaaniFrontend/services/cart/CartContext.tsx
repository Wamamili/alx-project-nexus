"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem, cartService } from "./cartService";
import { Product } from "../../interfaces";

interface CartContextType {
  items: CartItem[];
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartService.getCart());
  }, []);

  const addItem = (product: Product): void => {
    const updated = cartService.addItem(product);
    setItems(updated);
  };

  const removeItem = (id: string): void => {
    const updated = cartService.removeItem(id);
    setItems(updated);
  };

  const updateQuantity = (id: string, qty: number) => {
    const updated = cartService.updateQuantity(id, qty);
    setItems(updated);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext)!;
}
