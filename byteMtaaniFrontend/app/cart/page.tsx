"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "../../services/products";

type CartItem = {
  id: string;
  qty: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [productsMap, setProductsMap] = useState<any>({});

  useEffect(() => {
    // Try to read cart from localStorage; otherwise show sample
    try {
      const raw = localStorage.getItem("cart_items");
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        // default: add the first product as example
        setItems([{ id: productsData[0]?.id || "1", qty: 1 }]);
      }
    } catch (e) {
      setItems([{ id: productsData[0]?.id || "1", qty: 1 }]);
    }

    const map: Record<string, any> = {};
    productsData.forEach((p: any) => (map[p.id] = p));
    setProductsMap(map);
  }, []);

  const updateQty = (id: string, qty: number) => {
    const next = items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it));
    setItems(next);
    localStorage.setItem("cart_items", JSON.stringify(next));
  };

  const removeItem = (id: string) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    localStorage.setItem("cart_items", JSON.stringify(next));
  };

  const subtotal = items.reduce((s, it) => s + (productsMap[it.id]?.price || 0) * it.qty, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="space-y-4">
            {items.length === 0 && (
              <div className="p-6 bg-white rounded shadow text-center">Your cart is empty. <Link href="/products" className="text-brandBlue">Continue shopping</Link></div>
            )}

            {items.map((it) => {
              const p = productsMap[it.id];
              return (
                <div key={it.id} className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
                  <div className="w-24 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                    <Image src={p?.image || '/placeholder.png'} alt={p?.title} width={96} height={96} className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{p?.title}</div>
                    <div className="text-sm text-gray-500">Ksh {p?.price?.toFixed?.(2) ?? p?.price}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(it.id, it.qty - 1)} className="px-3 py-1 border rounded">-</button>
                    <div className="px-3">{it.qty}</div>
                    <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-3 py-1 border rounded">+</button>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="font-semibold">Ksh {(p?.price * it.qty)?.toFixed?.(2) ?? 0}</div>
                    <button onClick={() => removeItem(it.id)} className="text-sm text-red-500 mt-1">Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="bg-white p-4 rounded shadow-sm">
          <div className="mb-4 text-sm text-gray-600">Order summary</div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">Subtotal</div>
            <div className="font-semibold">Ksh {subtotal.toFixed(2)}</div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Link href="/products" className="px-4 py-2 rounded-md border text-center">Continue shopping</Link>
            <button className="px-4 py-2 rounded-md font-medium" style={{ backgroundColor: '#EDA415', color: '#292D32' }}>Proceed to Checkout</button>
          </div>
        </aside>
      </div>
    </main>
  );
}