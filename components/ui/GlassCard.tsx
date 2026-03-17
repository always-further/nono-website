import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "purple" | "blue" | "teal" | "none";
  hoverable?: boolean;
  as?: "div" | "article" | "section" | "a";
}

const glowClasses = {
  purple: "hover:shadow-[0_0_50px_rgba(168,85,247,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]",
  blue: "hover:shadow-[0_0_50px_rgba(59,130,246,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]",
  teal: "hover:shadow-[0_0_50px_rgba(20,184,166,0.18),inset_0_1px_0_rgba(255,255,255,0.06)]",
  none: "hover:shadow-[0_0_50px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.06)]",
} as const;

export function GlassCard({
  children,
  className,
  glowColor = "none",
  hoverable = false,
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden",
        "bg-[rgba(255,255,255,0.03)] backdrop-blur-xl",
        hoverable &&
          "transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.14)]",
        hoverable && glowClasses[glowColor],
        className,
      )}
    >
      {/* Glass highlight sheen */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%, rgba(255,255,255,0.015) 100%)",
        }}
      />
      <div className="relative z-[1]">
        {children}
      </div>
    </Tag>
  );
}
