import { notFound } from "next/navigation";
import { getAllAcademyTags, getLessonsByTag } from "@/lib/academy";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllAcademyTags().map((tag) => ({
    tag: encodeURIComponent(tag.toLowerCase()),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} - nono Academy`,
    description: `Academy lessons tagged "${decoded}" on AI agent security.`,
    alternates: { canonical: `/academy/tags/${tag}` },
  };
}

export default async function AcademyTagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const lessons = getLessonsByTag(decoded);

  if (lessons.length === 0) notFound();

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 pt-8 flex items-center gap-3">
            <Link
              href="/academy"
              className="text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              Academy
            </Link>
            <span className="text-muted">/</span>
            <span className="text-xs font-mono text-foreground">#{decoded}</span>
          </div>

          <h1 className="text-2xl font-mono font-bold uppercase tracking-tight mb-3">
            Lessons tagged <span className="text-muted">#{decoded}</span>
          </h1>
          <p className="text-xs font-mono text-muted mb-10">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
          </p>

          <div className="border border-border divide-y divide-border">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/academy/${lesson.slug}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-surface transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-sm font-mono font-semibold text-foreground">
                      {lesson.title}
                    </h2>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted border border-border px-1.5 py-0.5">
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-muted line-clamp-1">
                    {lesson.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-xs font-mono text-muted hidden sm:block">
                    {lesson.duration}
                  </span>
                  <ArrowRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <div className="h-px bg-border" />
      <Footer />
    </>
  );
}
