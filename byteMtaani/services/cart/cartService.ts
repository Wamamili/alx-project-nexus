import { Product } from '../../interfaces';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class CartService {
  private storageKey = "byteMtaani_cart";

  getCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
  }

  saveCart(items: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  addItem(product: Product) {
    const cart = this.getCart();
    const existing = cart.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }

    this.saveCart(cart);
    return cart;
  }

  removeItem(id: string) {
    const cart = this.getCart().filter(i => i.product.id !== id);
    this.saveCart(cart);
    return cart;
  }

  updateQuantity(id: string, quantity: number) {
    const cart = this.getCart().map(i =>
      i.product.id === id ? { ...i, quantity } : i
    );
    this.saveCart(cart);
    return cart;
  }
}

export const cartService = new CartService();
