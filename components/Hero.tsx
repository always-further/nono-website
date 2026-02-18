import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.04)_0%,_transparent_70%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto text-center">

        <a
          href="https://alwaysfurther.ai?utm_source=nono-sh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 mb-10 opacity-70 hover:opacity-100 transition-opacity"
        >
          <Image src="/af-logo.svg" alt="Always Further" width={160} height={33} />
        </a>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          nono<br />
        </h1>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Constrain. Control. Correct.
        </h2>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
          Kernel-enforced process isolation for AI agents. <br />
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

        <div className="mt-10 flex flex-col items-center gap-1 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span>From the creator of</span>
            <a
              href="https://sigstore.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-accent transition-colors"
            >
              <Image
                src="/sigstore.svg"
                alt="Sigstore"
                width={20}
                height={20}
              />
              Sigstore
            </a>
          </div>
          <span className="text-xs text-muted/70">
            The industry standard for software signing, used by PyPi, Homebrew, Maven and Google, GitHub, NVIDIA
          </span>
        </div>
      </div>
    </section>
  );
}
