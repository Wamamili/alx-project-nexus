'use client';
import { fetchProductById } from '../../../services/products';
import Image from 'next/image';

import Button from '@/components/ui/Button';
import RatingBar from '@/components/ui/RatingBar';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);

  if (!product) {
    return (
      <main className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600">Sorry, we couldn't find a product with ID "{params.id}".</p>
      </main>
    );
  }

  return (
    <div>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
              <Image src={product.image || '/images/img_placeholder.png'} alt={product.product_name ?? 'Product image'} width={420} height={320} />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-2xl font-semibold">{product.product_name ?? product.title}</h1>
            <div className="text-xl font-bold">KSh {product.price}</div>
            <div className="flex items-center gap-3">
              <RatingBar rating={product.rating || 0} readonly />
              <span className="text-sm text-gray-600">{product.stockCount ?? 0} in stock</span>
            </div>

            <div className="flex gap-4 mt-4">
              <Button text="Add to cart" onClick={() => {}} className="px-6 py-3 rounded" />
              <Button text="Buy it now" onClick={() => {}} className="px-6 py-3 rounded" />
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
