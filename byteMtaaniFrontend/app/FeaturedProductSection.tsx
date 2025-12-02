'use client';
import { useState } from 'react';
import Button from '../components/ui/Button';
import PagerIndicator from '../components/ui/PagerIndicator';

export default function FeaturedProductSection() {
  const [currentPage, setCurrentPage] = useState<number>(1)

  return (
    <section className="w-full mt-[74px]">
      <div className="w-full max-w-[1440px] mx-auto px-[51px]">
        <div className="flex flex-col lg:flex-row gap-[32px]">
          {/* Left Side - Main Product Slider */}
          <div className="flex-1">
            <div className="relative border border-[#b5b5b5] rounded-[20px] p-[28px] sm:p-[40px] lg:p-[62px]">
              <div className="flex flex-col lg:flex-row items-center gap-[36px]">
                {/* Product Image */}
                <div className="w-full lg:w-[45%]">
                  <img
                    src="/images/img_11_1.png"
                    alt="JBL bar 2.1 deep bass"
                    className="w-[280px] h-[310px] sm:w-[320px] sm:h-[350px] lg:w-[344px] lg:h-[380px] object-contain mx-auto"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-[36px] text-center lg:text-left">
                  <div className="space-y-[14px]">
                    <h3 className="text-[19px] sm:text-[20px] lg:text-[21px] font-[Poppins] font-semibold leading-[30px] sm:leading-[31px] lg:leading-[32px] text-primary-background">
                      JBL bar 2.1 deep bass
                    </h3>

                    <p className="text-[16px] sm:text-[17px] font-[Poppins] font-semibold leading-[24px] sm:leading-[26px] text-[#4a4a4a]">
                      Ksh 2 500
                    </p>

                    <div className="flex items-center justify-center lg:justify-start gap-[10px]">
                      {Array.from({ length: 5 }, (_, index) => (
                        <img
                          key={index}
                          src="/images/img_vector.svg"
                          alt="Star"
                          className="w-[14px] h-[14px]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center lg:justify-start gap-[10px]">
                    {[
                      { value: '57', label: 'Days' },
                      { value: '11', label: 'Hours' },
                      { value: '33', label: 'Minutes' },
                      { value: '59', label: 'Seconds' }
                    ].map((item, index) => (
                      <Button
                        key={index}
                        text={item.value}
                        text_font_size="22"
                        text_font_weight="700"
                        text_color="#eca315"
                        fill_background_color="#e1f4ff"
                        border_border_radius="38px"
                        padding="t=20px,r=24px,b=20px,l=24px"
                        className="min-w-[68px]"
                        onClick={() => { } } children={undefined}                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                    <Button
                      text="Add to cart"
                      text_font_size="15"
                      text_font_weight="600"
                      text_color="#272727"
                      fill_background_color="#86bbd8"
                      border_border_radius="18px"
                      padding="t=14px,r=54px,b=14px,l=24px"
                      className="flex-1 sm:flex-none"
                      onClick={() => { } } children={undefined}                    />

                    <button className="w-[54px] h-[54px] bg-secondary-background rounded-[18px] flex items-center justify-center hover:bg-secondary-light transition-colors">
                      <img src="/images/img_eye.svg" alt="View product" className="w-[22px] h-[22px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination for Main Slider */}
            <div className="flex justify-center mt-[36px]">
              <PagerIndicator
                totalPages={3}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                layout_width="6%"
              />
            </div>
          </div>

          {/* Right Side - Product List */}
          <div className="w-full lg:w-[38%] space-y-[22px]">
            {/* Product 1 */}
            <div className="border border-[#b5b5b5] rounded-[18px] p-[20px] sm:p-[30px] lg:p-[36px]">
              <div className="flex items-center gap-[20px]">
                <div className="w-[200px] sm:w-[240px] lg:w-[282px] h-[140px] sm:h-[160px] lg:h-[168px]">
                  <img
                    src="/images/img_frame_29.png"
                    alt="Play game product"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 space-y-[14px]">
                  <h4 className="text-[16px] sm:text-[17px] font-[Poppins] font-medium leading-[24px] sm:leading-[26px] text-primary-background">
                    Play game
                  </h4>

                  <p className="text-[16px] sm:text-[17px] font-[Poppins] font-semibold leading-[24px] sm:leading-[26px] text-[#4a4a4a]">
                    Ksh 2 000
                  </p>

                  <div className="flex items-center gap-[10px]">
                    {Array.from({ length: 5 }, (_, index) => (
                      <img
                        key={index}
                        src="/images/img_vector.svg"
                        alt="Star"
                        className="w-[14px] h-[14px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="border border-[#b5b5b5] rounded-[18px] p-[20px] sm:p-[30px] lg:p-[36px]">
              <div className="flex items-center gap-[20px]">
                <div className="w-[200px] sm:w-[240px] lg:w-[280px] h-[140px] sm:h-[160px] lg:h-[166px] bg-center bg-cover bg-no-repeat rounded-lg"
                  style={{ backgroundImage: 'url(/images/img__0x0.png)' }}>
                  <img
                    src="/images/img_frame_29_166x280.png"
                    alt="Play game product variant"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 space-y-[14px]">
                  <h4 className="text-[16px] sm:text-[17px] font-[Poppins] font-medium leading-[24px] sm:leading-[26px] text-primary-background">
                    Play game
                  </h4>

                  <p className="text-[16px] sm:text-[17px] font-[Poppins] font-semibold leading-[24px] sm:leading-[26px] text-[#4a4a4a]">
                    Ksh 35 000
                  </p>

                  <div className="flex items-center gap-[10px]">
                    {Array.from({ length: 5 }, (_, index) => (
                      <img
                        key={index}
                        src="/images/img_vector.svg"
                        alt="Star"
                        className="w-[14px] h-[14px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
