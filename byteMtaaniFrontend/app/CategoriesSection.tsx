'use client';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  itemCount: string;
  image: string;
}

export default function CategoriesSection() {
  const [categories] = useState<Category[]>([
    {
      id: 'speakers',
      name: 'Speaker',
      itemCount: '(6 items)',
      image: '/images/img_2_1.png'
    },
    {
      id: 'desktop-laptop', 
      name: 'Desktop & laptop',
      itemCount: '(6 items)',
      image: '/images/img_5_1.png'
    },
    {
      id: 'dslr-camera',
      name: 'DSLR camera', 
      itemCount: '(6 items)',
      image: '/images/img_8_1.png'
    }
  ])

  return (
    <section className="w-full">
      <div className="w-full max-w-[1440px] mx-auto px-[30px] sm:px-[40px] md:px-[60px] lg:px-[61px] mt-[52px]">
        <div className="flex flex-col lg:flex-row items-center gap-[32px] sm:gap-[38px]">
          {/* Left Navigation Button */}
          <button 
            className="hidden lg:flex w-[36px] h-[36px] items-center justify-center bg-background-neutral rounded-[18px] hover:bg-gray-300 transition-colors"
            aria-label="Previous category"
          >
            <img src="/images/img_frame_20.svg" alt="" className="w-[24px] h-[24px]" />
          </button>
          
          {/* Categories Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[30px] lg:gap-[38px]">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between border border-[#a4a4a4] rounded-[20px] p-[14px] sm:p-[20px] lg:p-[26px] hover:shadow-md transition-all duration-300">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-[80px] h-[60px] sm:w-[120px] sm:h-[80px] lg:w-[154px] lg:h-[94px] object-contain"
                  />
                  
                  <div className="text-right">
                    <h3 className="text-[18px] sm:text-[21px] lg:text-[23px] font-[Poppins] font-semibold leading-[28px] sm:leading-[32px] lg:leading-[36px] text-primary-light mb-[2px]">
                      {category.name}
                    </h3>
                    <p className="text-[16px] sm:text-[17px] lg:text-[18px] font-[Poppins] font-medium leading-[26px] sm:leading-[28px] lg:leading-[29px] text-primary-dark">
                      {category.itemCount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Navigation Button */}
          <button 
            className="hidden lg:flex w-[36px] h-[36px] items-center justify-center bg-background-neutral rounded-[18px] hover:bg-gray-300 transition-colors"
            aria-label="Next category"
          >
            <img src="/images/img_frame_20.svg" alt="" className="w-[24px] h-[24px]" />
          </button>
        </div>
      </div>
    </section>
  )
}