'use client';

import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], cols = 4 }) {
    const colsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    }[cols] ?? 'grid-cols-4';

    return (
        <div className={`grid ${colsClass} gap-6`}>
            {products.map((p) => <ProductCard key={p.id ?? p.url_key ?? p.product_name} product={p} />)}
        </div>
    );
}
