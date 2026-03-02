import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { TagBadge } from "./TagBadge";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block border border-border rounded-xl overflow-hidden hover:border-muted/50 transition-colors bg-white/[0.01] hover:bg-white/[0.02] ${featured ? "md:col-span-2" : ""}`}
    >
      {post.image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes={
              featured
                ? "(min-width: 768px) 66vw, 100vw"
                : "(min-width: 768px) 33vw, 100vw"
            }
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} linked={false} />
          ))}
        </div>

        <h2
          className={`font-bold tracking-tight mb-2 group-hover:text-accent transition-colors ${featured ? "text-2xl" : "text-lg"}`}
        >
          {post.title}
        </h2>

        <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted/70 font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
