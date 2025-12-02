"use client";

import React, { useEffect, useState } from "react";
import Button from "../components/ui/Button";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-background-main shadow-[19px_4px_16px_#00000016]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-10">

        <div className="relative w-full h-[520px] rounded-lg overflow-hidden flex items-center justify-between">

          {/* Text Block */}
          <div className="z-10 max-w-[520px] text-left">
            <h1 className="text-[40px] lg:text-[48px] font-bold leading-tight text-primary-light mb-6">
              Canon<br />camera
            </h1>

            <div className="flex gap-5 mb-10">
              <Button
                text="Shop now"
                text_font_size="16"
                text_font_weight="600"
                text_color="#ffffff"
                fill_background_color="#eca315"
                border_border_radius="20px"
                padding="t=18px,r=32px,b=18px,l=32px"
              />

              <Button
                text="View more"
                text_font_size="16"
                text_font_weight="600"
                text_color="#306886"
                fill_background_color="transparent"
                border_border="1px solid #316887"
                border_border_radius="20px"
                padding="t=18px,r=28px,b=18px,l=28px"
              />
            </div>

            {/* Dots */}
            <div className="flex gap-3 mb-6">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${currentSlide === index ? "bg-accent-color" : "border border-[#adadad]"}`}
                />
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex items-center justify-end relative">
            <img src="/images/img_8_1.png" alt="Canon Camera" className="w-[420px] h-[420px] object-contain" />

            <div className="absolute bottom-10 right-10 bg-accent-color rounded-full px-4 py-6 text-center">
              <span className="text-[20px] font-semibold text-primary-foreground">
                only<br />Ksh 43 999
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
