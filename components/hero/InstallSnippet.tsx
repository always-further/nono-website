"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const tabs = [
  { label: "Homebrew", command: "brew tap always-further/nono && brew install nono" },
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
    <div className="w-full max-w-lg mx-auto mt-10">
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[rgba(255,255,255,0.08)]">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                i === active
                  ? "text-foreground bg-[rgba(255,255,255,0.06)]"
                  : "text-muted/60 hover:text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Command */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <code className="font-mono text-sm text-muted/80">
            <span className="text-foreground/40 mr-2">&gt;</span>
            {tabs[active].command}
          </code>
          <button
            onClick={handleCopy}
            className="ml-4 p-1.5 text-muted/40 hover:text-foreground/70 transition-colors flex-shrink-0"
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
