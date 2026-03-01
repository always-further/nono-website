"use client";

import { cn } from "@/lib/utils";
import { TextScramble } from "@/components/hero/TextScramble";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  glitch?: boolean;
  scramble?: boolean;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  glitch = false,
  scramble = true,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[rgba(255,255,255,0.12)] text-muted-strong bg-[rgba(255,255,255,0.04)] mb-6 backdrop-blur-sm">
          {scramble ? <TextScramble text={badge} /> : badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
        {scramble ? <TextScramble text={title} glitch={glitch} /> : title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-muted text-sm md:text-base leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {scramble ? <TextScramble text={subtitle} glitch={glitch} /> : subtitle}
        </p>
      )}
    </div>
  );
}
