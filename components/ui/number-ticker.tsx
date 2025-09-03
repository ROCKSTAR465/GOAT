"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    const timer = setTimeout(() => {
      const startValue = direction === "down" ? value : 0;
      const endValue = direction === "down" ? 0 : value;
      const duration = 2000;
      const steps = 60;
      const stepValue = (endValue - startValue) / steps;
      
      let currentStep = 0;
      
      intervalRef.current = setInterval(() => {
        currentStep++;
        const nextValue = startValue + (stepValue * currentStep);
        
        if (currentStep >= steps) {
          setDisplayValue(endValue);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          hasAnimated.current = true;
        } else {
          setDisplayValue(Math.round(nextValue));
        }
      }, duration / steps);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [value, direction, delay]);

  return (
    <span className={cn("tabular-nums", className)}>
      {displayValue.toLocaleString()}
    </span>
  );
}
