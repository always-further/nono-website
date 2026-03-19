"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  scrambleDuration?: number;
  glitch?: boolean;
  glitchOnly?: boolean;
}

function scrambleWord(str: string): string {
  return str
    .split("")
    .map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
    .join("");
}

export function TextScramble({
  text,
  className,
  delay = 0,
  scrambleDuration = 800,
  glitch = false,
  glitchOnly = false,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(glitchOnly ? text : "");
  const [started, setStarted] = useState(glitchOnly);
  const [resolved, setResolved] = useState(glitchOnly);
  const frameRef = useRef<number>(0);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (glitchOnly) return;
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay, glitchOnly]);

  useEffect(() => {
    if (!started || glitchOnly) return;

    const startTime = performance.now();
    const totalChars = text.length;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / scrambleDuration, 1);
      const resolvedCount = Math.floor(progress * totalChars);

      let result = "";
      for (let i = 0; i < totalChars; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolvedCount) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayed(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayed(text);
        setResolved(true);
      }
    }

    setDisplayed(scrambleWord(text));

    const pauseTimer = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(pauseTimer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [started, text, scrambleDuration, glitchOnly]);

  useEffect(() => {
    if (!resolved || (!glitch && !glitchOnly)) return;

    function schedule() {
      const nextDelay = 3000 + Math.random() * 4000;

      glitchTimerRef.current = setTimeout(() => {
        const words = text.split(" ");
        const wordIndex = Math.floor(Math.random() * words.length);
        const word = words[wordIndex];
        if (!word || word.length === 0) {
          schedule();
          return;
        }

        const glitched = [...words];
        glitched[wordIndex] = scrambleWord(word);
        setDisplayed(glitched.join(" "));

        setTimeout(() => {
          setDisplayed(text);
          schedule();
        }, 40 + Math.random() * 30);
      }, nextDelay);
    }

    schedule();

    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [resolved, glitch, glitchOnly, text]);

  if (!started) {
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{displayed}</span>;
}
