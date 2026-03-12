import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllLessonSlugs, getLessonBySlug } from "@/lib/academy";
import { getMdxComponents } from "@/lib/mdx-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Clock, Signal } from "lucide-react";
import BreadcrumbSchema from "@/components/structured-data/BreadcrumbSchema";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const lesson = getLessonBySlug(slug);
    return {
      title: lesson.title,
      description: lesson.description,
      alternates: { canonical: `/academy/${slug}` },
      openGraph: {
        title: lesson.title,
        description: lesson.description,
        type: "article",
        publishedTime: lesson.date,
        images: [{ url: "/logo.png" }],
      },
    };
  } catch {
    return { title: "Lesson Not Found" };
  }
}

const difficultyColor = {
  beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  intermediate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  advanced: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;

  let lesson;
  try {
    lesson = getLessonBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: lesson.content,
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
        { name: "Academy", href: "/academy" },
        { name: lesson.title, href: `/academy/${slug}` },
      ]} />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link
              href="/academy"
              className="hover:text-foreground transition-colors"
            >
              Academy
            </Link>
            <span className="text-border-strong">/</span>
            <span className="text-muted/60 truncate">{lesson.title}</span>
          </div>

          {/* Header */}
          <header className="border-b border-border pb-10 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${difficultyColor[lesson.difficulty]}`}
              >
                <Signal size={10} />
                {lesson.difficulty}
              </span>
              {lesson.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/academy/tags/${encodeURIComponent(tag.toLowerCase())}`}
                  className="text-xs text-muted/60 font-mono hover:text-foreground transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-tight">
              {lesson.title}
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-4">
              {lesson.description}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted/70 font-mono flex items-center gap-2">
                <Clock size={14} />
                {lesson.duration}
              </span>
              <span className="text-sm text-muted/70">
                by {lesson.author}
              </span>
            </div>
          </header>

          {/* Content */}
          <article>{content}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
