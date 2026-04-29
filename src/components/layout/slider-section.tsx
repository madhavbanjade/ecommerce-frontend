"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef, useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SliderSectionProps {
  children?: React.ReactNode[];
  autoplay?: boolean;
  autoplayDelay?: number;
  slideSize?: string;
  slideSizes?: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  showDots?: boolean;
  showArrows?: boolean;
}

export default function SliderSection({
  children = [],
  autoplay: enableAutoplay = true,
  autoplayDelay = 3000,
  slideSize = "50%",
  slideSizes,
  showDots = true,
  showArrows = true,
}: SliderSectionProps) {
  // Unique class per instance — avoids global CSS conflicts
  const uid = useId().replace(/:/g, "");
  const slideClass = `embla-slide-${uid}`;

  const autoplayPlugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps", dragFree: false, watchDrag: true },
    enableAutoplay ? [autoplayPlugin.current] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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

  // Responsive slide sizes via injected <style>
  const responsiveStyles = slideSizes ? `
    .${slideClass} { flex: 0 0 ${slideSizes.base ?? slideSize}; }
    @media (min-width: 640px)  { .${slideClass} { flex: 0 0 ${slideSizes.sm  ?? slideSizes.base ?? slideSize}; } }
    @media (min-width: 768px)  { .${slideClass} { flex: 0 0 ${slideSizes.md  ?? slideSizes.sm  ?? slideSize}; } }
    @media (min-width: 1024px) { .${slideClass} { flex: 0 0 ${slideSizes.lg  ?? slideSizes.md  ?? slideSize}; } }
    @media (min-width: 1280px) { .${slideClass} { flex: 0 0 ${slideSizes.xl  ?? slideSizes.lg  ?? slideSize}; } }
  ` : null;

  return (
    <div className="relative w-full">
      {responsiveStyles && <style>{responsiveStyles}</style>}

      {/* Arrows — hidden on mobile, visible sm+ */}
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
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-10
              w-8 h-10 sm:w-9 sm:h-12 items-center justify-center rounded-full bg-[#000000]
              border border-zinc-200 shadow-sm hover:border-zinc-900"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
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
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-10
              w-8 h-10 sm:w-9 sm:h-12 items-center justify-center rounded-full bg-[#000000]
              border border-zinc-200 shadow-sm hover:border-zinc-900"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Track */}
      <div className="overflow-hidden w-full touch-pan-x" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4">
          {children.map((child, index) => (
            <div
              key={index}
              style={!slideSizes ? { flex: `0 0 ${slideSize}` } : undefined}
              className={`min-w-0 ${slideSizes ? slideClass : ""}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
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