'use client';

import React from 'react';

export default function RatingStars({ rating = 5, size = 14 }) {
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
    return (
        <div className="flex items-center gap-1">
            {stars.map((full, i) => (
                <svg key={i} className="inline-block" width={size} height={size} viewBox="0 0 24 24" fill={full ? '#FBBf24' : 'none'} stroke="#d1d5db">
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.17L12 18.896l-7.336 3.848 1.402-8.17L.132 9.21l8.2-1.192z" />
                </svg>
            ))}
        </div>
    );
}
