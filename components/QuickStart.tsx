"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const codeExamples = [
  {
    label: "Basic",
    code: `# Build from source
cargo build --release

# Run with access to current directory only
nono --allow . -- your-command`,
  },
  {
    label: "Claude Code",
    code: `# Run Claude Code with restricted access
nono --allow ./my-project -- claude`,
  },
  {
    label: "Advanced",
    code: `# Separate read and write permissions
nono --read ./src --write ./output -- cargo build

# Multiple paths
nono --allow ./project-a --allow ./project-b -- command

# Dry run (show what would be sandboxed)
nono --allow . --dry-run -- command`,
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
    <section id="quick-start" className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Quick start
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          Get up and running in seconds. NONO is designed to be simple and
          intuitive.
        </p>

        <div className="bg-code-bg rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {codeExamples.map((example, index) => (
              <button
                key={example.label}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === index
                    ? "text-white bg-gray-800"
                    : "text-gray-400 hover:text-gray-200"
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

        <p className="text-muted text-center mt-8 text-sm">
          Requires Rust toolchain. See{" "}
          <a
            href="https://github.com/lukehinds/nono"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            the repository
          </a>{" "}
          for detailed installation instructions.
        </p>
      </div>
    </section>
  );
}
