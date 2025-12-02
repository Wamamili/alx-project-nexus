'use client';

import React from 'react';
import RatingStars from './RatingStars';
import Button from './Button';

export default function ProductPageLayout({ product = {}, children }) {
    const img = product.image ?? product.backgroundImage ?? '/images/placeholder.png';

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg flex items-center justify-center p-4">
                            <img src={img} alt={product.product_name ?? product.name} className="max-w-full max-h-[420px] object-contain" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold">{product.product_name ?? product.name}</h1>
                            <div className="mt-2 flex items-center gap-3">
                                <div className="text-xl font-bold text-byte-primary">KES {product.price}</div>
                                <RatingStars rating={product.rating ?? 5} />
                            </div>

                            <div className="mt-4 text-gray-600">{product.description}</div>

                            <div className="mt-6 flex items-center gap-3">
                                <Button text="Add to cart" />
                                <button className="px-4 py-2 border rounded-md">Buy now</button>
                            </div>
                        </div>
                    </div>
                </div>

                {children}
            </div>

            <aside className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-600">Delivery</div>
                    <div className="font-medium mt-1">Free – 3 to 5 business days</div>
                    <div className="mt-4">
                        <div className="text-sm text-gray-600">Seller</div>
                        <div className="font-medium">ByteMtaani Store</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-600">Payment options</div>
                    <div className="mt-2">Mpesa, Visa, Cash on delivery</div>
                </div>
            </aside>
        </div>
    );
}
