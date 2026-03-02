import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { getMdxComponents } from "@/lib/mdx-components";
import { PostHeader } from "@/components/blog/PostHeader";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostSchema from "@/components/structured-data/BlogPostSchema";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.title} - nono`,
      description: post.description,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
        images: post.image ? [{ url: post.image }] : [{ url: "/logo.png" }],
      },
    };
  } catch {
    return { title: "Post Not Found - nono" };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components: getMdxComponents(),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
      parseFrontmatter: true,
    },
  });

  const relatedPosts = getRelatedPosts(slug, post.tags);

  return (
    <>
      <Header />
      <BlogPostSchema post={post} />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <PostHeader post={post} />

          <article className="mt-10">{content}</article>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-16 mb-12" />

          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </div>
      </main>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <Footer />
    </>
  );
}
