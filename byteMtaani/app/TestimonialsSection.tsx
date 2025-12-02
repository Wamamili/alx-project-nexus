'use client';
import { useState } from 'react';
import PagerIndicator from '../components/ui/PagerIndicator';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  review: string;
}

export default function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Simon Kiuta',
      avatar: '/images/img_ellipse_5.svg',
      review: 'Lorem ipsum dolor sit amet consectetur. Nec sit enim tellus faucibus bibendum ullamcorper. Phasellus tristique aenean at lorem sed scelerisque.'
    },
    {
      id: '2',
      name: 'Jane Alot',
      avatar: '/images/img_ellipse_5.svg',
      review: 'Lorem ipsum dolor sit amet consectetur. Nec sit enim tellus faucibus bibendum ullamcorper. Phasellus tristique aenean at lorem sed scelerisque.'
    },
    {
      id: '3',
      name: 'Mercy Jack',
      avatar: '/images/img_ellipse_5.svg',
      review: 'Lorem ipsum dolor sit amet consectetur. Nec sit enim tellus faucibus bibendum ullamcorper. Phasellus tristique aenean at lorem sed scelerisque.'
    }
  ]

  return (
    <section className="w-full mt-[74px]">
      <div className="w-full max-w-[1440px] mx-auto px-[61px]">
        <div className="space-y-[46px]">
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] lg:gap-[40px]">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="border border-[#b9b9b9] rounded-[20px] p-[16px]"
              >
                <div className="space-y-[26px]">
                  {/* User Info */}
                  <div className="flex items-center gap-[36px]">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-[80px] sm:w-[90px] lg:w-[100px] h-[80px] sm:h-[90px] lg:h-[100px] rounded-full object-cover"
                    />

                    <h4 className="text-[14px] sm:text-[15px] font-[Poppins] font-medium leading-[22px] sm:leading-[24px] text-primary-background">
                      {testimonial.name}
                    </h4>
                  </div>

                  {/* Review */}
                  <div className="bg-background-accentSoft rounded-[18px] p-[10px]">
                    <p className="text-[12px] sm:text-[13px] font-[Poppins] font-normal leading-[18px] sm:leading-[19px] text-primary-background">
                      {testimonial.review}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicator */}
          <div className="flex justify-center">
            <PagerIndicator
              totalPages={3}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              layout_width="6%"
            />
          </div>
        </div>
      </div>
    </section>
  )
}