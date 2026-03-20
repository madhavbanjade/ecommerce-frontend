"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SliderSectionProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplayDelay?: number;
  slideSize?: string;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function SliderSection({
  children,
  autoplay: enableAutoplay = true,
  autoplayDelay = 3000,
  slideSize = "50%",
  showDots = true,
  showArrows = true,
}: SliderSectionProps) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps" },
    enableAutoplay ? [autoplayPlugin.current] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Embla requires useEffect to subscribe — unavoidable
  // But all visual reactions are handled by Framer Motion below
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    autoplayPlugin.current?.reset();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    autoplayPlugin.current?.reset();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    autoplayPlugin.current?.reset();
  }, [emblaApi]);

  return (
    <div className="relative">

      {/* ── Arrows — fade + scale with Framer Motion ── */}
      <AnimatePresence>
        {showArrows && canScrollPrev && (
          <motion.button
            key="prev"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
              w-10 h-14 flex items-center justify-center rounded-full bg-[#4285F4] border border-zinc-200
              shadow-sm hover:border-zinc-900"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showArrows && canScrollNext && (
          <motion.button
            key="next"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
                w-10 h-14 flex items-center justify-center rounded-full bg-[#4285F4] border border-zinc-200
              shadow-sm hover:border-zinc-900"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

    {/* ── Track ── */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {children.map((child, index) => (
            <div
              key={index}
              style={{ flex: `0 0 ${slideSize}` }}
              className="min-w-0"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* ── Dots — active dot expands with layout animation ── */}
      {showDots && (
        <div className="flex gap-1.5 items-center justify-center mt-4">
          {children.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              animate={
                index === selectedIndex
                  ? { width: 24, height: 10, backgroundColor: "#18181b", borderRadius: 5 }
                  : { width: 10, height: 10, backgroundColor: "#a1a1aa", borderRadius: 5 }
              }
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="block"
            />
          ))}
        </div>
      )}

    </div>
  );
}