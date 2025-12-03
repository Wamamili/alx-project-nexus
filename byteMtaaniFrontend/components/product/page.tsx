// app/products/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../../interfaces';

async function getProducts(): Promise<Product[]> {
  // Replace with real API/service fetch
  return [
    {
      id: '1', product_name: 'Wireless Earbuds', price: 2499, url_key: 'earbuds', image: '/images/earbuds.jpg', inStock: true,
      stockCount: 3
    },
    {
      id: '2', product_name: 'Gaming Controller', price: 4599, url_key: 'controller', image: '/images/controller.jpg', inStock: false,
      stockCount: 5
    },
  ];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => (
          <Link key={p.id} href={`/product/${p.url_key}`} className="block border rounded-md p-4 hover:shadow">
            <div className="aspect-[4/3] relative w-full mb-3">
                <Image fill src={p.image ?? '/images/placeholder.png'} alt={p.product_name ?? ''} className="object-cover rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{p.product_name}</h3>
                <div className="text-sm text-gray-600">KSH {p.price}</div>
              </div>
              <div className={`text-sm ${p.inStock ? 'text-green-600' : 'text-red-600'}`}>{p.inStock ? 'In stock' : 'Out of stock'}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
