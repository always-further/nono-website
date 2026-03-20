import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
}

export function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const badge = (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono text-muted border border-border transition-colors">
      {tag}
    </span>
  );

  if (!linked) return badge;

  return (
    <Link
      href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`}
      className="hover:opacity-70 transition-opacity"
    >
      {badge}
    </Link>
  );
}
