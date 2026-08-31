"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
     const [swiper, setSwiper] = useState<SwiperType | null>(null);

     const images = [
       "https://picsum.photos/id/1018/1200/500",
       "https://picsum.photos/id/1015/1200/500",
       "https://picsum.photos/id/1019/1200/500",
     ];
  return (
    <div className="relative w-full">
      <Swiper
        className="swiper_class"
        modules={[Pagination, Autoplay]}
        onSwiper={setSwiper}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        observer={true}
        observeParents={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            {/* 🔥 Full width banner */}
            <div
              className="h-[300px] md:h-[500px] bg-cover bg-center flex items-center justify-center text-white"
              style={{ backgroundImage: `url(${img})` }}
            >
              <p className="text-2xl md:text-4xl font-bold">
                About 5nance Slide {i + 1}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 🔥 LEFT RIGHT ARROW (center) */}
      <button
        onClick={() => swiper?.slidePrev()}
        className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-r-full hover:bg-red-600 transition z-10"
      >
        ◀
      </button>
      <button
        onClick={() => swiper?.slideNext()}
        className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-l-full hover:bg-red-600 transition z-10"
      >
        ▶
      </button>
    </div>
  );
}
