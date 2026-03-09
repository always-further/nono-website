import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { TagBadge } from "@/components/blog/TagBadge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing on AI agent security, sandboxing, and kernel-level isolation.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog",
    description:
      "Technical writing on AI agent security, sandboxing, and kernel-level isolation.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-muted max-w-2xl leading-relaxed">
              Technical writing on AI agent security, OS-level sandboxing, and
              secure infrastructure.
            </p>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} linked={true} />
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <p className="text-muted text-center py-20">No posts yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {featured && <BlogCard post={featured} featured />}
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <Footer />
    </>
  );
}
