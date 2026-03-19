import Link from "next/link";
import { cn } from "@/lib/utils";
import { DOCS_URL } from "@/lib/site";

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
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
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
    "inline-flex items-center justify-center gap-2 font-mono font-medium transition-all duration-200 relative tracking-tight",
    sizeClasses[size],
    variant === "primary" &&
      "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)]",
    variant === "outline" &&
      "border border-border-strong text-foreground hover:bg-surface hover:border-foreground",
    className,
  );
  const isDocsLink =
    !!href &&
    (href.startsWith("/docs") || href.startsWith(DOCS_URL));

  if (href) {
    if (external || isDocsLink) {
      return (
        <a
          href={href}
          {...(external
            ? {
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
          className={baseClasses}
        >
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
