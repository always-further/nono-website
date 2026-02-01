import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/nono-mascot.png"
            alt="NONO mascot"
            width={800}
            height={800}
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
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
            href="https://github.com/lukehinds/nono"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-border hover:border-muted px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
