'use client';

import { useEffect, useState } from 'react';
import { ChipView } from '../components/ui/ChipView';
import Button from '../components/ui/Button';
import PagerIndicator from '../components/ui/PagerIndicator';
import { getProducts } from '../lib/api';

interface Product {
  id: string;
  product_name: string;
  price: string;
  image?: string;
  backgroundImage?: string;
  rating: number;
  stockCount?: number;
}

interface Category {
  id: string;
  product_name: string;
}

export default function PopularProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('cameras');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const categories: Category[] = [
    { id: 'cameras', product_name: 'Cameras' },
    { id: 'laptops', product_name: 'Laptops' },
    { id: 'tablets', product_name: 'Tablets' },
    { id: 'mouse', product_name: 'Mouse' },
  ];

  const defaultProducts: Product[] = [
    { id: '1', product_name: 'Gaming Controller', price: 'Ksh 3,500', image: '/images/img_camera_1.png', rating: 5, stockCount: 12 },
    { id: '2', product_name: 'Wireless Headphones', price: 'Ksh 1,500', backgroundImage: '/images/img_.png', rating: 5, stockCount: 8 },
    { id: '3', product_name: 'Play Game', price: 'Ksh 2,000', backgroundImage: '/images/img__0x0.png', rating: 5, stockCount: 3 },
    { id: '4', product_name: 'Tablet as a Laptop', price: 'Ksh 30,000', backgroundImage: '/images/img__1.png', rating: 5, stockCount: 2 },
    { id: '5', product_name: 'Wireless Headphones', price: '$11,70', backgroundImage: '/images/img_.png', rating: 5, stockCount: 7 },
    { id: '6', product_name: 'Play Game', price: 'Ksh 2,000', backgroundImage: '/images/img__0x0.png', rating: 5, stockCount: 0 },
    { id: '7', product_name: 'Tablet as a Laptop', price: 'Ksh 30,000', backgroundImage: '/images/img__1.png', rating: 5, stockCount: 4 },
    { id: '8', product_name: 'Play Game', price: 'Ksh 2,000', backgroundImage: '/images/img__0x0.png', rating: 5, stockCount: 6 },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getProducts()
      .then((data: any[]) => {
        if (!mounted) return;

        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p: any) => ({
            id: String(p.id ?? p.pk ?? p._id ?? Math.random()),
            product_name: p.product_name ?? p.name ?? 'Unnamed',
            price: typeof p.price === 'number' ? `Ksh ${p.price}` : p.price ?? 'N/A',
            image: p.image ?? undefined,
            backgroundImage: p.background_image ?? p.image ?? undefined,
            rating: p.rating ?? 5,
          }));
          setRemoteProducts(mapped);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setFetchError(err?.message ?? 'Failed to load products');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryChange = (categoryId: string) => setSelectedCategory(categoryId);

  const renderStars = (rating: number) => (
    Array.from({ length: 5 }, (_, i) => (
      <img key={i} src="/images/img_vector.svg" alt="Star" className="w-[14px] h-[14px]" />
    ))
  );

  const productsToShow = remoteProducts ?? defaultProducts;

  return (
    <section className="w-full mt-[78px]">
      <div className="w-full max-w-[1440px] mx-auto px-[61px]">
        <div className="flex flex-col gap-[48px]">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-[Poppins] font-semibold leading-[35px] sm:leading-[40px] lg:leading-[42px] text-primary-light">
              Popular products
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <ChipView
                  key={category.id}
                  text={category.product_name}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`text-[16px] font-[Poppins] font-medium leading-[25px] px-[30px] py-[10px] rounded-[20px] 
                  ${selectedCategory === category.id ? 'border border-primary-background text-primary-light' : 'border border-[#b4b4b4] text-primary-light hover:border-primary-background'}`} layout_width={undefined} position={undefined} children={undefined} onRemove={undefined}                />
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] sm:gap-[26px]">
                  {productsToShow.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="group border border-[#b5b5b5] rounded-[18px] p-[12px] sm:p-[20px] lg:p-[22px] hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative mb-[20px]">
                  {product.image ? (
                    <img
                      src={product.image}
                            alt={product.product_name}
                      className="w-full h-[140px] sm:h-[160px] lg:h-[168px] object-contain rounded-[12px]"
                    />
                  ) : (
                    <div
                      className="w-full h-[140px] sm:h-[160px] lg:h-[168px] rounded-[12px] bg-center bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url(${product.backgroundImage})` }}
                    />
                  )}

                  {/* Wishlist */}
                  <button className="absolute top-[6px] right-[6px] w-[26px] h-[26px] bg-secondary-light rounded-[12px] flex items-center justify-center hover:bg-secondary-background transition-colors">
                    <img src="/images/img_heart_blue_gray_900.svg" alt="Add to wishlist" className="w-[14px] h-[14px]" />
                  </button>
                </div>

                {/* Info */}
                    <div className="space-y-[14px]">
                  <h3 className="text-[16px] sm:text-[17px] font-[Poppins] font-medium leading-[24px] sm:leading-[26px] text-primary-background">
                          {product.product_name ?? product.product_name}
                  </h3>

                  <p className="text-[16px] sm:text-[17px] font-[Poppins] font-semibold leading-[24px] sm:leading-[26px] text-[#4a4a4a]">
                    {product.price}
                  </p>

                  <div className="flex items-center gap-[10px]">{renderStars(product.rating)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <PagerIndicator totalPages={3} currentPage={currentPage} onPageChange={setCurrentPage} layout_width="6%" />
          </div>
        </div>
      </div>
    </section>
  );
}
