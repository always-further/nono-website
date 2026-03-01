import { notFound } from "next/navigation";
import { getAllAcademyTags, getLessonsByTag } from "@/lib/academy";
import { GlassCard } from "@/components/ui/GlassCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Clock, ArrowRight, Signal } from "lucide-react";
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

const difficultyColor = {
  beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  intermediate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  advanced: "text-red-400 border-red-400/30 bg-red-400/10",
};

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
          <div className="mb-16 pt-8 flex items-center gap-4">
            <Link
              href="/academy"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Academy
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm font-mono text-accent">#{decoded}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Lessons tagged{" "}
            <span className="text-accent font-mono">#{decoded}</span>
          </h1>
          <p className="text-muted mb-12">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <Link key={lesson.slug} href={`/academy/${lesson.slug}`}>
                <GlassCard hoverable className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${difficultyColor[lesson.difficulty]}`}
                    >
                      <Signal size={10} />
                      {lesson.difficulty}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight mb-2">
                    {lesson.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted/70 font-mono flex items-center gap-1.5">
                      <Clock size={12} />
                      {lesson.duration}
                    </span>
                    <span className="text-xs text-accent flex items-center gap-1">
                      Start lesson <ArrowRight size={12} />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <Footer />
    </>
  );
}
