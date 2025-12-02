import { fetchProductById } from "@/services/products";
import { useCart } from "@/services/cart/CartContext";

export default async function ProductDetails({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.product_name ?? product.product_name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{product.product_name ?? product.product_name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

          <div className="mt-4 text-2xl font-bold text-byte-primary">
            KES {product.price.toLocaleString()}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

function AddToCartButton({ product }: { product: {
  product_name: string | undefined; id: string; name?: string; description?: string; image?: string; price: number 
} }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    const item = {
      ...product,
      product_name: product.product_name ?? product.name ?? "Untitled",
      title: product.product_name ?? product.name ?? "Untitled",
    };
    addItem(item as any);
  };

  return (
    <button
      onClick={handleAdd}
      className="mt-6 bg-byte-primary text-white px-6 py-3 rounded-md hover:bg-byte-primary-dark transition"
      type="button"
    >
      Add to Cart
    </button>
  );
}
