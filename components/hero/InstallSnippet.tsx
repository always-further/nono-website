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
      <div className="border border-border">
        <div className="flex border-b border-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                i === active
                  ? "text-foreground bg-surface"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <code className="font-mono text-sm text-muted">
            <span className="text-muted/50 mr-2">$</span>
            {tabs[active].command}
          </code>
          <button
            onClick={handleCopy}
            className="ml-4 p-1 text-muted hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
