
export default function PromotionalSection() {
  return (
    <section className="w-full mt-12 relative">
      {/* Carousel indicators */}
      <div className="flex justify-center mb-4 space-x-2">
        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
      </div>

      {/* Promo section */}
      <div className="max-w-[1440px] mx-auto px-6">
        <div
          className="w-full h-[320px] md:h-[360px] lg:h-[400px] rounded-[20px] bg-black flex items-center justify-between overflow-visible px-6 lg:px-16 relative"
        >
          {/* Laptop Image */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <img
              src="/images/img__1.jpg"
              alt="Laptop"
              className="absolute w-[1315px] h-[417px] left-[64px] top-[1792px] rounded-[20px] object-cover"
            />

          </div>

          {/* Text Content */}
          <div className="w-1/2 text-white px-6 lg:px-10">
            <span className="bg-yellow-400 text-black text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
              New laptop
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-400">
              Sale up to 50% off
            </h2>
            <p className="text-sm md:text-base mb-6">12 inch hd display</p>
            <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full">
              Shop now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
