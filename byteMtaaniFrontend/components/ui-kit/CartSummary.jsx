'use client';

import React from 'react';
import Button from './Button';

export default function CartSummary({ items = [], onCheckout }) {
    const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (it.qty || 1), 0);

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-sm text-gray-600">Order summary</div>
            <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-700">
                    <div>Subtotal</div>
                    <div>KES {subtotal.toLocaleString()}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-1">
                    <div>Delivery</div>
                    <div>Free</div>
                </div>
            </div>

            <div className="mt-4">
                <Button text="Proceed to Checkout" onClick={() => onCheckout && onCheckout()} />
            </div>
        </div>
    );
}
