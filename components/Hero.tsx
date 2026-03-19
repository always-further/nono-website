"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { InstallSnippet } from "@/components/hero/InstallSnippet";
import { TextScramble } from "@/components/hero/TextScramble";
import { DOCS_URL } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 text-foreground font-mono leading-none">
            <TextScramble text="nono" delay={200} scrambleDuration={1000} glitch />
          </h1>
          <p className="text-xl md:text-2xl text-muted max-w-2xl leading-relaxed">
            Runtime safety infrastructure for AI agents. Kernel-enforced isolation, immutable auditing, and atomic rollbacks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <GradientButton href="https://github.com/always-further/nono" external size="lg">
            Get Started <ArrowRight size={16} />
          </GradientButton>
          <GradientButton href={DOCS_URL} external variant="outline" size="lg">
            Documentation
          </GradientButton>
        </div>

        <InstallSnippet />

        <div className="mt-8 flex flex-col items-center gap-1 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span>From the creator of</span>
            <a
              href="https://sigstore.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-muted-strong transition-colors"
            >
              <Image
                src="/sigstore.svg"
                alt="Sigstore"
                width={18}
                height={18}
                style={{ width: "auto", height: "18px" }}
              />
              Sigstore
            </a>
          </div>
          <span className="text-xs text-muted/60">
            The industry standard for software signing, used by PyPi, Homebrew, Maven and Google, GitHub, NVIDIA
          </span>
        </div>
      </div>
    </section>
  );
}
