import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Testimonials from "@/components/Testimonials";
import { type Testimonial } from "@/types/testimonial";

type HeroProps = {
  testimonials: Testimonial[];
};

export default function Hero({ testimonials }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center w-full">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
          nono: OS-Level <br />
          Isolation for AI Agents.
        </h1>

        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          OS-enforced sandboxing for untrusted AI agents and processes.
          <br />
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#quick-start"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
            <ArrowRight size={18} />
          </a>
          <a
            href="https://github.com/always-further/nono"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-border hover:border-muted px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-white/5">
          <span className="text-sm text-muted">Brought to you by the creator of</span>
          <a
            href="https://sigstore.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
          >
            <Image src="/sigstore.svg" alt="Sigstore" width={28} height={28} />
            Sigstore
          </a>
        </div>

        <Testimonials testimonials={testimonials} embedded />
      </div>
    </section>
  );
}
