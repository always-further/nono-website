import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/types/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.15em] text-foreground">
          Related Articles
        </h2>
        <Link
          href="/blog"
          className="text-xs font-mono text-muted hover:text-foreground flex items-center gap-1 transition-colors"
        >
          All posts <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
