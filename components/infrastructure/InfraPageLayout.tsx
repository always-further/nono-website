import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { RelatedInfraPages } from "./RelatedInfraPages";
import { GradientButton } from "@/components/ui/GradientButton";

interface RelatedPage {
  href: string;
  label: string;
  description: string;
}

interface InfraPageLayoutProps {
  title: string;
  tagline: string;
  description: string;
  children: React.ReactNode;
  relatedPages: RelatedPage[];
}

export function InfraPageLayout({
  title,
  tagline,
  description,
  children,
  relatedPages,
}: InfraPageLayoutProps) {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <AnimatedBackground variant="subtle" />
          <div className="relative max-w-6xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-accent/30 text-accent bg-accent/5 mb-6">
              {tagline}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 max-w-3xl">
              {title}
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-2xl">
              {description}
            </p>
            <div className="mt-2 h-px w-24 bg-gradient-to-r from-accent to-accent-blue" />
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">{children}</div>
        </section>

        {/* Related pages */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <RelatedInfraPages pages={relatedPages} />
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 py-20 overflow-hidden">
          <AnimatedBackground variant="subtle" />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Get started with nono
            </h2>
            <p className="text-muted mb-8">
              Runtime safety infrastructure that works on macOS, Linux, and in CI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton href="/docs">Read the Docs</GradientButton>
              <GradientButton
                variant="outline"
                href="https://github.com/always-further/nono"
                external
              >
                View on GitHub
              </GradientButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
