import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { TagBadge } from "@/components/blog/TagBadge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: encodeURIComponent(tag.toLowerCase()),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} - nono Blog`,
    description: `Articles tagged "${decoded}" on AI agent security and sandboxing.`,
    alternates: { canonical: `/blog/tags/${tag}` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 pt-8 flex items-center gap-3">
            <Link
              href="/blog"
              className="text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <span className="text-muted">/</span>
            <TagBadge tag={decoded} linked={false} />
          </div>

          <h1 className="text-2xl font-mono font-bold uppercase tracking-tight mb-3">
            Articles tagged <span className="text-muted">#{decoded}</span>
          </h1>
          <p className="text-xs font-mono text-muted mb-10">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
      <div className="h-px bg-border" />
      <Footer />
    </>
  );
}
