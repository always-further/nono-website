import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverable?: boolean;
  as?: "div" | "article" | "section" | "a";
}

export function GlassCard({
  children,
  className,
  hoverable = false,
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "relative border border-border bg-background",
        hoverable && "transition-colors duration-200 hover:border-border-strong hover:bg-surface",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
