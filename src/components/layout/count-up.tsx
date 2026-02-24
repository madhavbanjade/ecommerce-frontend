"use client";

import { useEffect, useState } from "react";

// Hook
function useCountUp(start: number, target: number, duration: number, delay: number) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const range = target - start;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setCount(Math.floor(start + eased * range));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [start, target, duration, delay]);

  return count;
}

// Component
interface CountUpProps {
  start?: number;
  target: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

export function CountUp({
  start = 0,
  target,
  duration = 2000,
  delay = 0.9,
  suffix = "",
  className,
}: CountUpProps) {
  const count = useCountUp(start, target, duration, delay);
  return <span className={className}>{count}{suffix}</span>;
}