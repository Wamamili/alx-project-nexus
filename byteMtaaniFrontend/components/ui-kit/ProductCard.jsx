'use client';

import React from 'react';
import Link from 'next/link';
import RatingStars from './RatingStars';

export default function ProductCard({ product }) {
    const img = product.image ?? product.backgroundImage ?? '/images/placeholder.png';

    return (
        <Link href={`/products/${product.url_key ?? product.id}`} className="block bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                <div className="aspect-[4/3] w-full mb-3 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
                <img src={img} alt={product.product_name ?? product.name} className="max-w-full max-h-full object-contain" />
            </div>

            <h3 className="text-sm font-medium text-gray-800">{product.product_name}</h3>
            <div className="text-sm text-gray-500 truncate">{product.description ?? ''}</div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-byte-primary font-semibold">KES {product.price?.toLocaleString ? product.price.toLocaleString() : product.price}</div>
                <RatingStars rating={product.rating ?? 5} />
            </div>
        </Link>
    );
}
