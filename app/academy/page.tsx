import { getAllLessons } from "@/lib/academy";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Clock, ArrowRight, Signal } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy - nono",
  description:
    "Learn about AI agent security, sandboxing, and runtime governance through structured educational content.",
  alternates: { canonical: "/academy" },
};

const difficultyColor = {
  beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  intermediate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  advanced: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function AcademyIndexPage() {
  const lessons = getAllLessons();

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="pt-8">
            <SectionHeader
              title="Academy"
              subtitle="Structured educational content on AI agent security."
              align="left"
              scramble={false}
            />
          </div>

          {lessons.length === 0 ? (
            <p className="text-muted text-center py-20">
              No lessons yet. Check back soon.
            </p>
          ) : (
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
                      {lesson.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-muted/60 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
