"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

export default function BrokerCarousel() {
     const [swiper, setSwiper] = useState<SwiperType | null>(null);

     const images = [
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
       "https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/UPSTOX.png",
     ];
  return (
    <div className="relative w-full">
      <Swiper
        className="swiper_class"
        modules={[Autoplay]}
        onSwiper={setSwiper}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 4, spaceBetween: 20 },
        }}
        loop={true}
        // observer={true}
        // observeParents={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        // pagination={{ clickable: true }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            {/* 🔥 Full width banner */}
            <div
              className="w-full h-[100px] bg-white bg-center flex items-center justify-center rounded-lg"
            >
             <Image src={img} alt="" width={200} height={200} />
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
