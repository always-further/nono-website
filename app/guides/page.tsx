import { getAllGuides } from "@/lib/guides";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Long-form guides on AI agent security, sandboxing, undo, and runtime governance.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides",
    description:
      "Long-form guides on AI agent security, sandboxing, undo, and runtime governance.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="pt-8">
            <SectionHeader
              title="Guides"
              subtitle="Long-form technical guides on AI agent security, sandboxing, and runtime governance."
              align="left"
              scramble={false}
            />
          </div>

          {guides.length === 0 ? (
            <p className="text-muted text-center py-20">No guides yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                  <GlassCard hoverable className="p-6 h-full flex flex-col">
                    <h2 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-accent transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted/70 font-mono flex items-center gap-1.5">
                        <Clock size={12} />
                        {guide.readingTime}
                      </span>
                      <span className="text-xs text-accent flex items-center gap-1">
                        Read guide <ArrowRight size={12} />
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
