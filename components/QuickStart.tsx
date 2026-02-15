"use client";

import { useState } from "react";
import { Check, Copy, Apple, Monitor } from "lucide-react";

const codeExamples = [
  {
    label: "macOS (Homebrew)",
    code: `brew tap always-further/nono
brew install nono`,
  },
  {
    label: "Source",
    code: `# Build from source
cargo build --release

# Binary will be at target/release/nono`,
  },
];

export default function QuickStart() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quick-start" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          Get started
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Get up and running in seconds.
        </p>

        <div className="bg-code-bg rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {codeExamples.map((example, index) => (
              <button
                key={example.label}
                onClick={() => setActiveTab(index)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === index
                    ? "text-white border-accent"
                    : "text-gray-400 hover:text-gray-200 border-transparent"
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="relative">
            <pre className="p-6 text-code-text font-mono text-sm overflow-x-auto">
              <code>{codeExamples[activeTab].code}</code>
            </pre>

            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              aria-label="Copy code"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Platform badges */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Apple className="w-4 h-4" />
            <span>macOS via Seatbelt</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted">
            <Monitor className="w-4 h-4" />
            <span>Linux via Landlock</span>
          </div>
        </div>

        <p className="text-muted text-center mt-4 text-sm">
          Building from source requires Rust toolchain. See{" "}
          <a
            href="https://docs.nono.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            the docs
          </a>{" "}
          for more installation options.
        </p>
      </div>
    </section>
  );
}
