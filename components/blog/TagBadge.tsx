import Link from "next/link";

const TAG_COLORS: Record<string, string> = {
  security: "border-accent/50 text-accent bg-accent/10",
  linux: "border-yellow-700/50 text-yellow-400 bg-yellow-900/20",
  macos: "border-blue-700/50 text-blue-400 bg-blue-900/20",
  rust: "border-orange-700/50 text-orange-400 bg-orange-900/20",
  python: "border-green-700/50 text-green-400 bg-green-900/20",
  typescript: "border-blue-600/50 text-blue-300 bg-blue-900/20",
  sandbox: "border-purple-700/50 text-purple-400 bg-purple-900/20",
  ai: "border-accent/50 text-accent bg-accent/10",
  networking: "border-teal-700/50 text-teal-400 bg-teal-900/20",
};

const DEFAULT_COLOR = "border-border text-muted bg-white/[0.03]";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
}

export function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const colorClass = TAG_COLORS[tag.toLowerCase()] ?? DEFAULT_COLOR;

  const badge = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono border ${colorClass} transition-colors`}
    >
      {tag}
    </span>
  );

  if (!linked) return badge;

  return (
    <Link
      href={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`}
      className="hover:opacity-80 transition-opacity"
    >
      {badge}
    </Link>
  );
}
