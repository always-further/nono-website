import { Link } from "lucide-react";
import type { ReactNode } from "react";

interface AnchorProps {
  level: 1 | 2 | 3 | 4;
  children?: ReactNode;
  id?: string;
}

const sizes: Record<number, string> = {
  1: "text-3xl md:text-4xl font-bold tracking-tight mt-12 mb-4",
  2: "text-2xl md:text-3xl font-bold tracking-tight mt-10 mb-3 border-b border-border pb-2",
  3: "text-xl font-semibold tracking-tight mt-8 mb-2",
  4: "text-base font-semibold tracking-tight mt-6 mb-1 text-muted",
};

export function Anchor({ level, children, id }: AnchorProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

  return (
    <Tag id={id} className={`group relative ${sizes[level]}`}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-foreground"
          aria-label="Link to section"
        >
          <Link size={14} />
        </a>
      )}
    </Tag>
  );
}
