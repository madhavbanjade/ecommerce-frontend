"use client";

import { aspire, brands, heroImg, naya, offer } from "@/src/assets";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";

const heroSlides = [aspire, naya, heroImg, offer];

export default function Brands() {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: false },
    [autoplay.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      autoplay.current.reset();
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-6 text-dark mb-8">

      {/* Breadcrumb */}
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Brands</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden px-16" ref={emblaRef}>
        <div className="flex gap-4">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`md:flex-[0_0_40%] flex-[0_0_140%] rounded-2xl overflow-hidden transition-opacity duration-300 ${
                index === selectedIndex ? "opacity-100" : "opacity-40"
              }`}
            >
              <Image
                src={slide}
                alt={`slide-${index}`}
                className="object-contain"
                priority={index === 0}
            />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="grid place-items-center">
        <div className="flex gap-1 items-center">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`rounded-lg transition-all duration-300 ${
                index === selectedIndex
                  ? "w-3 h-3 border-2 border-gray-800 bg-transparent"
                  : "w-2.5 h-2.5 bg-[#414955]"
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}