"use client";

import { FileText, Lock, Eye, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextScramble } from "@/components/hero/TextScramble";

const steps = [
  {
    icon: FileText,
    number: "01",
    label: "Define",
    title: "Policy",
    description:
      "JSON profiles declare filesystem paths, network hosts, and denied commands.",
  },
  {
    icon: Lock,
    number: "02",
    label: "Enforce",
    title: "Kernel Sandbox",
    description:
      "Landlock and Seatbelt create irrevocable allow-lists at the kernel level. Works on Linux, macOS, and Windows.",
  },
  {
    icon: Eye,
    number: "03",
    label: "Supervise",
    title: "Runtime Proxy",
    description:
      "An unsandboxed supervisor handles approvals and network filtering.",
  },
  {
    icon: BarChart3,
    number: "04",
    label: "Audit",
    title: "Verify",
    description:
      "Merkle-tree session logs with cryptographic verification and atomic rollback.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="Architecture"
          title="How nono works"
          subtitle="Four layers between your agent and the operating system."
        />

        <div className="relative">
          <svg
            className="absolute top-12 left-0 w-full h-4 hidden md:block pointer-events-none"
            viewBox="0 0 1000 16"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="step-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
            </defs>
            <line x1="125" y1="8" x2="875" y2="8" stroke="url(#step-line)" strokeWidth="1" strokeDasharray="6 6" className="animate-flow-line" />
            <circle cx="125" cy="8" r="3" fill="rgba(255,255,255,0.3)" />
            <circle cx="375" cy="8" r="3" fill="rgba(255,255,255,0.25)" />
            <circle cx="625" cy="8" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="875" cy="8" r="3" fill="rgba(255,255,255,0.2)" />
          </svg>

          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <GlassCard key={step.label} className="p-6 relative">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-3xl font-bold font-mono tracking-tighter text-foreground/40"
                    style={{
                      textShadow: "0 0 30px rgba(255,255,255,0.08)",
                    }}
                  >
                    {step.number}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <step.icon
                      className="w-4 h-4 text-foreground/50"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] block mb-2 text-foreground/40">
                  <TextScramble text={step.label} />
                </span>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">
                  <TextScramble text={step.title} />
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  <TextScramble text={step.description} />
                </p>

                <div
                  className="absolute bottom-0 left-6 right-6 h-px"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
                  }}
                />
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
