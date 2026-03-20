import { getAllGuides } from "@/lib/guides";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
          <div className="pt-8 mb-12">
            <h1 className="text-2xl font-mono font-bold uppercase tracking-tight mb-3">
              Guides
            </h1>
            <p className="text-sm text-muted max-w-2xl">
              Long-form technical guides on AI agent security, sandboxing, and runtime governance.
            </p>
          </div>

          {guides.length === 0 ? (
            <p className="text-muted text-center py-20 font-mono text-sm">No guides yet.</p>
          ) : (
            <div className="border border-border divide-y divide-border">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="flex items-center justify-between px-6 py-5 hover:bg-surface transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-mono font-semibold text-foreground mb-1">
                      {guide.title}
                    </h2>
                    <p className="text-xs text-muted line-clamp-1">
                      {guide.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs font-mono text-muted hidden sm:block">
                      {guide.readingTime}
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
