"use client";

import { GradientButton } from "@/components/ui/GradientButton";
import { DOCS_URL } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto border border-border">
        <div className="py-16 px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-mono font-bold uppercase tracking-tight mb-4">
            Start securing your AI agents
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Kernel-level isolation, cryptographic audit trails, and atomic rollbacks. Open source and ready to deploy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <GradientButton href={`${DOCS_URL}/cli/getting_started/installation`} external size="lg">
              Get Started <ArrowRight size={14} />
            </GradientButton>
            <GradientButton href={DOCS_URL} external variant="outline" size="lg">
              Read the Docs
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
}
