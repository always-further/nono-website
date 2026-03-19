import { cn } from "@/lib/utils";

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
        <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-muted mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 font-mono uppercase">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-muted text-sm leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
