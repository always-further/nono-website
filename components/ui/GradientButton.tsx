import Link from "next/link";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function GradientButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
}: GradientButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 relative",
    sizeClasses[size],
    variant === "primary" &&
      "text-black bg-white shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.02]",
    variant === "outline" &&
      "border border-[rgba(255,255,255,0.1)] text-foreground backdrop-blur-sm bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.06)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
    className,
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {children}
        </a>
      );
    }
    if (href.startsWith("/docs")) {
      return (
        <a href={href} className={baseClasses}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}
