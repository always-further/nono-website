"use client";

import { useEffect, useState, useCallback } from "react";

export default function TerminalDemo() {
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const command = "nono run cat .ssh/id_rsa";
  const output = "cat: .ssh/id_rsa: Operation not permitted";

  const runAnimation = useCallback(() => {
    setDisplayedCommand("");
    setShowOutput(false);
    setShowCursor(true);

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < command.length) {
        setDisplayedCommand(command.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowOutput(true);
          setShowCursor(false);
          setTimeout(() => {
            runAnimation();
          }, 3000);
        }, 500);
      }
    }, 80);

    return typingInterval;
  }, []);

  useEffect(() => {
    const interval = runAnimation();
    return () => clearInterval(interval);
  }, [runAnimation]);

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-gray-950 border border-border rounded-xl overflow-hidden shadow-2xl">
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
          <div className={`mt-3 ${showOutput ? "text-red-400" : "invisible"}`}>
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}
