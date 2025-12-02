'use client';

import { Package, Crown, ShieldCheck } from "lucide-react";

export default function ServiceHighlights() {
  return (
    <section className="w-full bg-[#E7F5FF] py-6 mt-10 rounded-2xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 flex-wrap gap-8">
        
        {/* Free Delivery */}
        <div className="flex items-start gap-3">
          <Package className="text-yellow-500 w-8 h-8" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Free delivery</h3>
            <p className="text-sm text-gray-600">on order above Ksh 30 000</p>
          </div>
        </div>

        {/* Best Quality */}
        <div className="flex items-start gap-3">
          <Crown className="text-yellow-500 w-8 h-8" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Best quality</h3>
            <p className="text-sm text-gray-600">best quality in low price</p>
          </div>
        </div>

        {/* Warranty */}
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-yellow-500 w-8 h-8" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">1 year warranty</h3>
            <p className="text-sm text-gray-600">Available warranty</p>
          </div>
        </div>

      </div>
    </section>
  );
}
