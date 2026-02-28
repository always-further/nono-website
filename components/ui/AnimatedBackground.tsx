"use client";

import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "hero" | "section" | "subtle";
}

export function AnimatedBackground({
  className,
  variant = "hero",
}: AnimatedBackgroundProps) {
  const isHero = variant === "hero";
  const isSubtle = variant === "subtle";

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {/* Animated mesh gradient blobs */}
      <div
        className={cn("absolute inset-0", isSubtle && "opacity-60")}
      >
        {/* Primary white blob */}
        <div
          className="absolute animate-float-slow"
          style={{
            width: isHero ? "70%" : "50%",
            height: isHero ? "70%" : "50%",
            top: "10%",
            left: "-10%",
            background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Secondary blob */}
        <div
          className="absolute animate-float-slower"
          style={{
            width: isHero ? "60%" : "40%",
            height: isHero ? "60%" : "40%",
            top: "-5%",
            right: "-15%",
            background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 40%, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "-4s",
          }}
        />
        {/* Third accent blob */}
        <div
          className="absolute animate-float-slow"
          style={{
            width: isHero ? "50%" : "30%",
            height: isHero ? "40%" : "25%",
            bottom: "0%",
            left: "30%",
            background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.04) 0%, transparent 65%)",
            filter: "blur(70px)",
            animationDelay: "-6s",
          }}
        />
        {isHero && (
          <div
            className="absolute animate-pulse-glow"
            style={{
              width: "40%",
              height: "30%",
              top: "30%",
              left: "30%",
              background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.04) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}
      </div>

      {/* Dot grid */}
      <div
        className={cn(
          "absolute inset-0",
          isHero ? "opacity-[0.07]" : isSubtle ? "opacity-[0.04]" : "opacity-[0.05]",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Top edge fade-in line */}
      {!isHero && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.08) 70%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
}
