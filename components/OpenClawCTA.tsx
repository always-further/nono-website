import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function OpenClawCTA() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg md:text-xl text-muted mb-6">
          Looking for how to secure OpenClaw?
        </p>

        <a
          href="https://docs.nono.sh/profiles/openclaw"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center gap-6 group"
        >
          <Image
            src="/openclaw-logo-text.png"
            alt="OpenClaw"
            width={300}
            height={100}
            className="opacity-90 group-hover:opacity-100 transition-opacity"
          />

          <span className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Head over here
            <ArrowRight size={20} />
          </span>
        </a>
      </div>
    </section>
  );
}
