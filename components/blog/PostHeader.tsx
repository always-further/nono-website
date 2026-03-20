import Link from "next/link";
import { TagBadge } from "./TagBadge";
import type { BlogPost } from "@/types/blog";

interface PostHeaderProps {
  post: BlogPost;
}

export function PostHeader({ post }: PostHeaderProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b border-border pb-8">
      <div className="flex items-center gap-2 text-xs font-mono text-muted mb-6">
        <Link
          href="/blog"
          className="hover:text-foreground transition-colors"
        >
          Blog
        </Link>
        <span>/</span>
        <span className="text-muted/60 truncate">{post.title}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-tight mb-4 leading-tight">
        {post.title}
      </h1>

      <p className="text-sm text-muted leading-relaxed mb-6">
        {post.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted font-mono">
        <span>{post.author}{post.authorRole && ` -- ${post.authorRole}`}</span>
        <span>{formattedDate}</span>
        <span>{post.readingTime}</span>
      </div>
    </header>
  );
}
