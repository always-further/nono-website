"use client";

import { Highlight, themes } from "prism-react-renderer";
import { GlassCard } from "@/components/ui/GlassCard";

interface InfraCodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function InfraCodeBlock({
  code,
  language,
  filename,
  className,
}: InfraCodeBlockProps) {
  return (
    <GlassCard className={className}>
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-xs font-mono text-muted">
          {filename ?? language}
        </span>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 overflow-x-auto text-xs leading-relaxed font-mono"
            style={{ background: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </GlassCard>
  );
}
