//app/products/ProductCard.tsx
import Link from "next/link";
import { Product } from "../../interfaces";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.url_key ?? product.id}`}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition"
    >
      <div className="aspect-square mb-3 overflow-hidden rounded-md bg-gray-50">
        <img
          src={product.image}
          alt={product.product_name ?? product.product_name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-medium text-gray-900">{product.product_name ?? product.product_name}</h3>
      <p className="text-gray-600 text-sm truncate">{product.description}</p>

      <div className="mt-3 text-byte-primary font-semibold">
        KES {product.price?.toLocaleString ? product.price.toLocaleString() : product.price}
      </div>
    </Link>
  );
}
