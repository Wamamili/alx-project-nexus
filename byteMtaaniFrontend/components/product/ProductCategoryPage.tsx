//app/products/ProductCategoryPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

 import RatingBar from'@/components/ui/RatingBar';
 import EditText from'@/components/ui/EditText';

interface Product {
  id: number
  product_name: string
  name?: string
  price: string
  image: string
  rating: number
}

interface FilterOption {
  id: string
  name: string
  count: number
  selected: boolean
}

interface FilterSection {
  title: string
  options: FilterOption[]
}

export default function ProductCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filterSections, setFilterSections] = useState<FilterSection[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = (): void => {
    setTimeout(() => {
      // Initialize filter sections
      setFilterSections([
        {
          title: 'Categories',
          options: [
            { id: 'all', name: 'All categories', count: 10, selected: true },
            { id: 'tablet', name: 'Tablet', count: 5, selected: false },
            { id: 'laptop', name: 'Laptop', count: 5, selected: false },
            { id: 'headphones', name: 'Headphones', count: 5, selected: false },
            { id: 'console', name: 'Console', count: 5, selected: false },
            { id: 'other', name: 'other', count: 5, selected: false }
          ]
        },
        {
          title: 'Availability',
          options: [
            { id: 'in-stock', name: 'In stock', count: 5, selected: false },
            { id: 'out-of-stock', name: 'Out of stock', count: 0, selected: false }
          ]
        },
        {
          title: 'Product type',
          options: [
            { id: 'smart-watch', name: 'Smart-watch', count: 5, selected: false }
          ]
        },
        {
          title: 'Brand',
          options: [
            { id: 'smart-watch-brand', name: 'Smart-watch', count: 5, selected: false }
          ]
        },
        {
          title: 'Size',
          options: [
            { id: 'm', name: 'M', count: 5, selected: false },
            { id: 's', name: 'S', count: 5, selected: false },
            { id: 'x', name: 'X', count: 5, selected: false },
            { id: 'xx', name: 'XX', count: 5, selected: false }
          ]
        }
      ])

      // Initialize products
        setProducts([
        {
          id: 1,
          product_name: 'Wireless headphones',
          price: 'Ksh 2, 5000',
          image: '/images/img_.png',
          rating: 4
        },
        {
          id: 2,
          product_name: 'Play game',
          price: 'Ksh 2 000',
          image: '/images/img__0x0.png',
          rating: 5
        },
        {
          id: 3,
          product_name: 'Tablet as a laptop',
          price: 'Ksh 35 000',
          image: '/images/img__1.png',
          rating: 4
        },
        {
          id: 4,
          product_name: 'Wireless headphones',
          price: 'Ksh 2000',
          image: '/images/img_.png',
          rating: 3
        },
        {
          id: 5,
          product_name: 'Play game',
          price: 'Ksh 2 500',
          image: '/images/img__0x0.png',
          rating: 5
        },
        {
          id: 6,
          product_name: 'Tablet as a laptop',
          price: 'Ksh 35 000',
          image: '/images/img__1.png',
          rating: 4
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const handleFilterSelection = (sectionIndex: number, optionId: string): void => {
    setFilterSections(prevSections => 
      prevSections.map((section, idx) => 
        idx === sectionIndex 
          ? {
              ...section,
              options: section.options.map(option =>
                option.id === optionId 
                  ? { ...option, selected: !option.selected }
                  : option
              )
            }
          : section
      )
    )
  }

  const handleResetFilter = (sectionIndex: number): void => {
    setFilterSections(prevSections =>
      prevSections.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              options: section.options.map(option => ({ ...option, selected: false }))
            }
          : section
      )
    )
  }

  const handleAddToWishlist = (productId: number): void => {
    // Wishlist functionality
  }

  const handleSubscribeNewsletter = (email: string): void => {
    // Newsletter subscription
  }

  return (
    <div className="min-h-screen bg-background-main">
      <Header />

      {/* Breadcrumb */}
      <section className="w-full bg-background-main py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="text-md font-[Poppins] font-medium leading-md text-text-secondary">
              Home
            </span>
            <Image 
              src="/images/img_arrow_down_blue_gray_900_24x24.svg" 
              alt="Arrow" 
              width={24} 
              height={24}
              className="rotate-[-90deg]"
            />
            <span className="text-md font-[Poppins] font-medium leading-md text-text-secondary">
              All category
            </span>
            <Image 
              src="/images/img_arrow_down_blue_gray_900_24x24.svg" 
              alt="Arrow" 
              width={24} 
              height={24}
              className="rotate-[-90deg]"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 space-y-6">
              {filterSections.map((section, sectionIndex) => (
                <div key={section.title} className="bg-background-card rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-[Poppins] font-medium leading-md text-primary-background">
                      {section.title}
                    </h3>
                    <button
                      onClick={() => handleResetFilter(sectionIndex)}
                      className="text-base font-[Poppins] font-normal leading-base text-text-muted hover:text-accent-color transition-colors"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.options.map((option) => (
                      <div key={option.id} className="flex items-center justify-between">
                        <button
                          onClick={() => handleFilterSelection(sectionIndex, option.id)}
                          className="flex items-center gap-3 flex-1"
                        >
                          <div 
                            className={`w-[30px] h-[30px] rounded-lg ${
                              option.selected ? 'bg-accent-light' : 'bg-accent-light'
                            }`}
                          />
                          <span className={`text-md font-[Poppins] font-normal leading-md flex-1 text-left ml-2 ${
                            option.name === 'Out of stock' ? 'text-text-light' : 'text-text-primary'
                          }`}>
                            {option.name}
                          </span>
                        </button>
                        <span className={`text-md font-[Poppins] font-normal leading-md ${
                          option.name === 'Out of stock' ? 'text-text-light' : 'text-text-primary'
                        }`}>
                          {option.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  {sectionIndex < filterSections.length - 1 && (
                    <div className="w-full h-[1px] bg-border-primary mt-6" />
                  )}
                </div>
              ))}

              {/* Color Filter */}
              <div className="bg-background-card rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-[Poppins] font-medium leading-md text-primary-background">
                    Color
                  </h3>
                  <button className="text-base font-[Poppins] font-normal leading-base text-text-muted hover:text-accent-color transition-colors">
                    Reset
                  </button>
                </div>
                <div className="mb-6">
                  <span className="text-md font-[Poppins] font-normal leading-md text-text-secondary">
                    0 selected
                  </span>
                </div>
                <Image 
                  src="/images/img_frame_110.svg" 
                  alt="Color selector" 
                  width={310} 
                  height={16}
                  className="w-full"
                />
              </div>
            </aside>

            {/* Products Grid */}
            <section className="w-full lg:w-3/4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-background-card rounded-lg p-6 animate-pulse">
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-background-card rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative p-3">
                        <div 
                          className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg relative"
                          style={{ backgroundImage: `url('${product.image}')` }}
                        >
                          <button
                            onClick={() => handleAddToWishlist(product.id)}
                            className="absolute top-3 right-3 w-[26px] h-[26px] bg-accent-light rounded-xl p-1.5 hover:bg-accent-color transition-colors"
                            aria-label="Add to wishlist"
                          >
                            <Image 
                              src="/images/img_frame_28.svg" 
                              alt="Heart" 
                              width={26} 
                              height={26}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <h3 className="text-[17px] font-[Poppins] font-medium leading-[26px] text-primary-background">
                          {product.product_name ?? product.name}
                        </h3>
                        <p className="text-[17px] font-[Poppins] font-semibold leading-[26px] text-text-secondary">
                          {product.price}
                        </p>
                        <RatingBar rating={product.rating} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Promotional Banner */}
      <section className="w-full py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="relative w-full h-[416px] bg-cover bg-center rounded-xl overflow-hidden"
            style={{ backgroundImage: "url('/images/img_pexels_nao_triponez_129208.png')" }}
          >
            <div className="absolute inset-0 flex flex-col justify-center items-end p-12 lg:p-16">
              <div className="text-right space-y-9 max-w-2xl">
                <div className="inline-block bg-secondary-background text-primary-foreground px-2 py-2 rounded-xl">
                  <span className="text-sm font-[Poppins] font-medium leading-base">
                    New laptop
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-[32px] sm:text-[41px] font-[Poppins] font-bold leading-[48px] sm:leading-[62px] text-accent-color">
                    Sale up to 50% off
                  </h2>
                  <p className="text-lg font-[Poppins] font-medium leading-[27px] text-primary-foreground">
                    12 inch hd display
                  </p>
                </div>

                <Button
                  text="Shop now"
                  className="bg-secondary-background text-primary-foreground hover:bg-secondary-light transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-background-section py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-card rounded-xl p-8 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <h2 className="text-2xl sm:text-3xl font-[Poppins] font-bold leading-3xl text-primary-light text-center lg:text-left">
                Subscribe newsletter
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                <EditText
                  placeholder="Email address"
                  className="w-full sm:w-80"
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { } } layout_gap={undefined} layout_width={undefined} padding={undefined} position={undefined} size={undefined} value={undefined}                />
                
                <div className="flex items-center gap-5">
                  <Image 
                    src="/images/img_headphone.svg" 
                    alt="Support" 
                    width={44} 
                    height={44}
                  />
                  <div className="text-sm font-[Poppins] font-semibold leading-sm text-text-muted">
                    Call us 24/7:<br />
                    (+254) 70000000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}