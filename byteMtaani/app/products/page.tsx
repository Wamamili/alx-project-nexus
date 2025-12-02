import Link from "next/link";
import Image from "next/image";
import React from "react";
import { fetchProducts } from "../../services/products";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="text-sm text-gray-600">Showing {products.length} items</div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <article key={p.id} className="bg-white rounded-md shadow-sm p-4 flex flex-col">
            <div className="h-48 w-full mb-4 bg-gray-50 flex items-center justify-center overflow-hidden rounded">
              <Image src={p.image || '/placeholder.png'} alt={p.title || 'Product image'} width={300} height={200} className="object-cover" />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">{p.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{p.description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div>
                <div className="text-base font-semibold">Ksh {p.price?.toFixed?.(2) ?? p.price}</div>
                <div className="text-xs text-gray-500">{p.category}</div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/product/${p.id}`} className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">View</Link>
                <Link href="/cart" className="px-3 py-1 rounded-md text-sm font-medium" style={{ backgroundColor: '#EDA415', color: '#292D32' }}>Add to cart</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
