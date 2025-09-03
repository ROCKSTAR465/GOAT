"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "group relative bg-gradient-to-r from-accent via-accent/80 to-accent bg-clip-text text-transparent",
        className
      )}
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
