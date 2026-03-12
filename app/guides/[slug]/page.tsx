import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllGuideSlugs, getGuideBySlug } from "@/lib/guides";
import { getMdxComponents } from "@/lib/mdx-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Clock } from "lucide-react";
import BreadcrumbSchema from "@/components/structured-data/BreadcrumbSchema";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const guide = getGuideBySlug(slug);
    return {
      title: guide.title,
      description: guide.description,
      alternates: { canonical: `/guides/${slug}` },
      openGraph: {
        title: guide.title,
        description: guide.description,
        type: "article",
        publishedTime: guide.date,
        images: [{ url: "/logo.png" }],
      },
    };
  } catch {
    return { title: "Guide Not Found" };
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;

  let guide;
  try {
    guide = getGuideBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: guide.content,
    components: getMdxComponents(),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
      parseFrontmatter: true,
    },
  });

  return (
    <>
      <Header />
      <BreadcrumbSchema items={[
        { name: "Guides", href: "/guides" },
        { name: guide.title, href: `/guides/${slug}` },
      ]} />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link
              href="/guides"
              className="hover:text-foreground transition-colors"
            >
              Guides
            </Link>
            <span className="text-border-strong">/</span>
            <span className="text-muted/60 truncate">{guide.title}</span>
          </div>

          {/* Header */}
          <header className="border-b border-border pb-10 mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-tight">
              {guide.title}
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-4">
              {guide.description}
            </p>
            <span className="text-sm text-muted/70 font-mono flex items-center gap-2">
              <Clock size={14} />
              {guide.readingTime}
            </span>
          </header>

          {/* Content */}
          <article>{content}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
