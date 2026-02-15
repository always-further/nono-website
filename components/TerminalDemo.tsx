"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const examples = [
  {
    command: "nono run agentprocess",
    output: [
      "Sandbox active. Restrictions are now in effect",
      "Accessing credentials for deployment...",
      "cat: ~/.aws/credentials: Operation not permitted",
      "cat: ~/.ssh/id_rsa: Operation not permitted",
    ],
  },
  {
    command: "nono run --allow /project myagent",
    output: [
      "Sandbox active. Restrictions are now in effect",
      "Reading project files...",
      "Reading file: /project/index.js",
      "Reading file: /project/utils.js",
      "Clearing disk space...",
      "rm -rf ~/: Operation not permitted",
    ],
  },
];

const longestOutput = examples.reduce(
  (max, ex) => Math.max(max, ex.output.length),
  0
);

export default function TerminalDemo() {
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [exampleIndex, setExampleIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentExample = examples[exampleIndex];

  const runAnimation = useCallback(() => {
    setDisplayedCommand("");
    setVisibleLines(0);
    setShowCursor(true);

    let charIndex = 0;
    const command = examples[exampleIndex].command;
    const outputLines = examples[exampleIndex].output;

    intervalRef.current = setInterval(() => {
      if (charIndex < command.length) {
        setDisplayedCommand(command.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setShowCursor(false);

        let lineIndex = 0;
        const showNextLine = () => {
          if (lineIndex < outputLines.length) {
            lineIndex++;
            setVisibleLines(lineIndex);
            timeoutRef.current = setTimeout(showNextLine, 400);
          } else {
            timeoutRef.current = setTimeout(() => {
              setExampleIndex((prev) => (prev + 1) % examples.length);
            }, 3000);
          }
        };
        timeoutRef.current = setTimeout(showNextLine, 500);
      }
    }, 80);
  }, [exampleIndex]);

  useEffect(() => {
    runAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [runAnimation]);

  return (
    <section className="pt-8 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-950 border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 px-5 py-4 bg-gray-900 border-b border-border">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
            <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
            <span className="ml-2 text-sm text-muted">Terminal</span>
          </div>
          <div className="p-8 font-mono text-base md:text-lg">
            <div className="flex">
              <span className="text-green-400">$</span>
              <span className="ml-3 text-white">
                {displayedCommand}
                {showCursor && (
                  <span className="inline-block w-2.5 h-5 bg-white ml-0.5 animate-pulse" />
                )}
              </span>
            </div>
            {Array.from({ length: longestOutput }).map((_, i) => (
              <div
                key={i}
                className={`mt-2 ${
                  i < visibleLines && currentExample.output[i]
                    ? currentExample.output[i].includes("Sandbox")
                      ? "text-green-400"
                      : currentExample.output[i].includes("not permitted") ||
                          currentExample.output[i].includes("denied")
                        ? "text-red-400"
                        : "text-muted"
                    : "invisible"
                }`}
              >
                {currentExample.output[i] || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
