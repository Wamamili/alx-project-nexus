// app/cart/ShoppingCartPage.tsx
'use client';
import React from 'react';
import type { CartItem } from '../../interfaces';
import Image from 'next/image';
import Button from '../../components/common/Button';

interface Props {
  items?: CartItem[];
}

export default function ShoppingCartPage({ items = [] }: Props) {
  const total = items.reduce((s, it) => s + it.product.price * it.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.product.id} className="flex items-center gap-4 border rounded p-3">
                <div className="w-20 h-20 relative">
                <Image
                  src={it.product.image ?? '/images/placeholder.png'}
                  alt={it.product.product_name ?? it.product.product_name ?? 'Product image'}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">{it.product.product_name ?? it.product.product_name}</div>
                <div className="text-sm text-gray-600">KSH {it.product.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-700">x{it.quantity}</div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Total</div>
            <div className="text-lg font-semibold">KSH {total}</div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary">Checkout</Button>
            <Button variant="outline">Continue Shopping</Button>
          </div>
        </div>
      )}
    </div>
  );
}
