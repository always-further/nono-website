import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GradientButton } from "@/components/ui/GradientButton";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SdkPageLayoutProps {
  language: string;
  packageName: string;
  installCommand: string;
  registryUrl: string;
  registryName: string;
  children: React.ReactNode;
}

export function SdkPageLayout({
  language,
  packageName,
  installCommand,
  registryUrl,
  registryName,
  children,
}: SdkPageLayoutProps) {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <AnimatedBackground variant="subtle" />
          <div className="relative max-w-6xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-accent/30 text-accent bg-accent/5 mb-6">
              {language} SDK
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 max-w-3xl">
              Runtime Safety for {language} AI Agents
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mb-8">
              Enforce kernel-level isolation, network filtering, and atomic
              rollbacks from {language} with{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-sm">
                {packageName}
              </code>
              .
            </p>

            <div className="flex items-center gap-4">
              <GlassCard className="inline-flex items-center px-5 py-3">
                <code className="font-mono text-sm text-foreground">
                  {installCommand}
                </code>
              </GlassCard>
              <a
                href={registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent-hover transition-colors whitespace-nowrap"
              >
                {registryName} &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">{children}</div>
        </section>

        {/* Related */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
              Related
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/linux-sandbox",
                  label: "Linux Sandbox",
                  desc: "How kernel isolation works under the hood",
                },
                {
                  href: "/docs",
                  label: "API Reference",
                  desc: "Full SDK documentation",
                },
                {
                  href: "/guides/safe-ai-agent-execution",
                  label: "Getting Started Guide",
                  desc: "End-to-end walkthrough",
                },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <GlassCard hoverable className="p-6 h-full">
                    <h3 className="font-semibold mb-1">{item.label}</h3>
                    <p className="text-sm text-muted mb-3">{item.desc}</p>
                    <span className="text-xs text-accent flex items-center gap-1">
                      Learn more <ArrowRight size={12} />
                    </span>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 py-20 overflow-hidden">
          <AnimatedBackground variant="subtle" />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ship safer agents today
            </h2>
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
