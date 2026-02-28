"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GradientButton } from "@/components/ui/GradientButton";
import { TextScramble } from "@/components/hero/TextScramble";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto relative rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <AnimatedBackground variant="hero" />

        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.1) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-10 py-20 px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <TextScramble text="Start securing your AI agents" />
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            <TextScramble text="Kernel-level isolation, cryptographic audit trails, and atomic rollbacks. Open source and ready to deploy." />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton href="https://github.com/always-further/nono" external size="lg">
              Get Started <ArrowRight size={16} />
            </GradientButton>
            <GradientButton href="/docs" variant="outline" size="lg">
              Read the Docs
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
}
