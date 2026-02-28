import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
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
    <header className="border-b border-border pb-10">
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link
          href="/blog"
          className="hover:text-foreground transition-colors"
        >
          Blog
        </Link>
        <span className="text-border">/</span>
        <span className="text-muted/60 truncate">{post.title}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-tight">
        {post.title}
      </h1>

      <p className="text-lg text-muted leading-relaxed mb-8">
        {post.description}
      </p>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted/70 font-mono">
        <span className="flex items-center gap-2">
          <User size={14} />
          {post.author}
          {post.authorRole && (
            <span className="text-muted/50">- {post.authorRole}</span>
          )}
        </span>
        <span className="flex items-center gap-2">
          <Calendar size={14} />
          {formattedDate}
        </span>
        <span className="flex items-center gap-2">
          <Clock size={14} />
          {post.readingTime}
        </span>
      </div>
    </header>
  );
}
