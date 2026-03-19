import Link from "next/link";
import Image from "next/image";
import { TagBadge } from "./TagBadge";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block border border-border hover:border-border-strong transition-colors ${featured ? "md:col-span-2" : ""}`}
    >
      {post.image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes={
              featured
                ? "(min-width: 768px) 66vw, 100vw"
                : "(min-width: 768px) 33vw, 100vw"
            }
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} linked={false} />
          ))}
        </div>

        <h2
          className={`font-mono font-bold tracking-tight mb-2 group-hover:text-muted-strong transition-colors ${featured ? "text-xl" : "text-sm"}`}
        >
          {post.title}
        </h2>

        <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted font-mono">
          <span>{formattedDate}</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
