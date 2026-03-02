"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GradientButton } from "@/components/ui/GradientButton";
import { InstallSnippet } from "@/components/hero/InstallSnippet";
import { TextScramble } from "@/components/hero/TextScramble";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
      <AnimatedBackground variant="hero" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(6,6,10,0.6) 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <a
          href="https://alwaysfurther.ai?utm_source=nono-sh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 mb-10 opacity-60 hover:opacity-100 transition-opacity"
        >
          <Image src="/af-logo.svg" alt="Always Further" width={140} height={29} />
        </a>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-2 text-foreground">
          <TextScramble text="nono" delay={200} scrambleDuration={1000} glitch />
        </h1>

        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6 leading-tight">
          Runtime Safety Infrastructure
          <br />
          <span className="text-muted">for AI Agents</span>
        </h2>

        <p className="text-base md:text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          Kernel-enforced isolation, immutable auditing, and atomic rollbacks &mdash; built into the CLI and native SDKs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton href="https://github.com/always-further/nono" external size="lg">
            Get Started <ArrowRight size={18} />
          </GradientButton>
          <GradientButton href="/docs" variant="outline" size="lg">
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
              <Image src="/sigstore.svg" alt="Sigstore" width={18} height={18} />
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
