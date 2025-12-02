// components/products/ProductGrid.tsx
"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/interfaces";

interface Props {
  products?: Product[];
}

export default function ProductGrid({ products = [] }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
