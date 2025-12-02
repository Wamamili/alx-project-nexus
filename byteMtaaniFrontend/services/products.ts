import { Product } from "../interfaces";
import { getProducts as getProductsFromAPI } from "../lib/api";

// Fallback mock data (used if API is unavailable)
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 59.99,
    image: "/images/product-img1.jpg",
    category: "Electronics",
    rating: 4.5,
    reviews: 120,
    inStock: true,
    url_key: "Wireless Headphones",
    product_name: "Wireless Headphones"
  },
  {
    id: "2",
    title: "Smart Watch",
    description: "Fitness tracking watch with heart rate monitoring.",
    price: 79.99,
    image: "/images/product-img11.jpg",
    category: "Wearables",
    rating: 4.2,
    reviews: 80,
    inStock: true,
    url_key: "Smart Watch",
    product_name: "Smart Watch"
  },
  {
    id: "3",
    title: "Bluetooth Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 39.99,
    image: "/images/product-4.jpg",
    category: "Audio",
    rating: 4.8,
    reviews: 200,
    inStock: true,
    url_key: "Bluetooth Speaker",
    product_name: "Bluetooth Speaker"
  }
];

/**
 * Fetch products from backend API with fallback to mock data
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await getProductsFromAPI();
    // Handle paginated response from backend
    const results = response.results || response;
    return (Array.isArray(results) ? results : []).map((p: any) => ({
      id: p.id,
      title: p.product_name || p.title,
      description: p.description,
      price: parseFloat(p.price) || 0,
      image: p.image_url || p.image || '/placeholder.png',
      category: p.category || 'Uncategorized',
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      inStock: p.in_stock !== false,
      name: p.product_name,
      product_name: p.product_name,
    }));
  } catch (err) {
    console.warn('Failed to fetch products from API, using mock data:', err);
    return mockProducts;
  }
};

/**
 * Fetch a single product by ID from backend API with fallback
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const p = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/products/${id}/`).then(r => r.json());
    return {
      id: p.id,
      title: p.product_name || p.title,
      description: p.description,
      price: parseFloat(p.price) || 0,
      image: p.image_url || p.image || '/placeholder.png',
      category: p.category || 'Uncategorized',
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      inStock: p.in_stock !== false,
      url_key: p.product_name,
      product_name: p.product_name,
    };
  } catch (err) {
    console.warn(`Failed to fetch product ${id} from API, checking mock data:`, err);
    return mockProducts.find((p) => p.id === id) || null;
  }
};

/**
 * Export mock data as default for backward compatibility
 */
export default mockProducts;
