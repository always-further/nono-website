"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const tabs = [
  { label: "Homebrew", command: "brew install nono" },
  { label: "Crates", command: "cargo install nono-cli" },
] as const;

export function InstallSnippet() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(tabs[active].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="border border-code-border bg-code-bg text-code-text">
        <div className="flex border-b border-code-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                i === active
                  ? "text-code-text bg-surface-hover"
                  : "text-code-text/50 hover:text-code-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <code className="font-mono text-sm text-code-text/80">
            <span className="text-code-text/40 mr-2">$</span>
            {tabs[active].command}
          </code>
          <button
            onClick={handleCopy}
            className="ml-4 p-1 text-code-text/40 hover:text-code-text transition-colors flex-shrink-0"
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
