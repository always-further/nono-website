import { getAllLessons } from "@/lib/academy";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Learn about AI agent security, sandboxing, and runtime governance through structured educational content.",
  alternates: { canonical: "/academy" },
  openGraph: {
    title: "Academy",
    description:
      "Learn about AI agent security, sandboxing, and runtime governance through structured educational content.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

export default function AcademyIndexPage() {
  const lessons = getAllLessons();

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="pt-8 mb-12">
            <h1 className="text-2xl font-mono font-bold uppercase tracking-tight mb-3">
              Academy
            </h1>
            <p className="text-sm text-muted max-w-2xl">
              Structured educational content on AI agent security.
            </p>
          </div>

          {lessons.length === 0 ? (
            <p className="text-muted text-center py-20 font-mono text-sm">
              No lessons yet. Check back soon.
            </p>
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
