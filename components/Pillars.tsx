"use client";

import { Shield, RotateCcw, FileCheck, Fingerprint, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { TextScramble } from "@/components/hero/TextScramble";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "Kernel Isolation",
    description: "Landlock and Seatbelt enforce irrevocable allow-lists at the kernel level. No API can widen permissions after the sandbox is applied.",
    href: "/linux-sandbox",
  },
  {
    icon: RotateCcw,
    title: "Undo & Rollback",
    description: "Content-addressed snapshots capture filesystem state before every session. Atomic restore with a single command.",
    href: "/undo",
  },
  {
    icon: FileCheck,
    title: "Audit Trail",
    description: "Merkle-tree-committed session logs with cryptographic integrity verification.",
    href: "/audit-trail",
  },
  {
    icon: Fingerprint,
    title: "Supply Chain Provenance",
    description: "Sigstore-backed signing ensures instruction files were authored by trusted identities.",
    href: "/provenance",
  },
  {
    icon: Eye,
    title: "Runtime Supervisor",
    description: "Dynamic permission expansion with approval workflows. Terminal prompts for dev, webhooks for production.",
    href: "/runtime-supervisor",
  },
];

export default function Pillars() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <AnimatedBackground variant="section" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeader
          badge="Infrastructure"
          title="Five layers of runtime safety"
          subtitle="Each layer builds on the previous, creating defense in depth for AI agent execution."
        />

        <div className="grid md:grid-cols-6 gap-4">
          {pillars.map((pillar, i) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className={i < 3 ? "md:col-span-2" : "md:col-span-3"}
            >
              <GlassCard
                hoverable
                className="p-6 h-full flex flex-col group relative"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle at top right, rgba(255,255,255,0.04), transparent 70%)",
                  }}
                />

                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      boxShadow: "0 0 20px rgba(255,255,255,0.03)",
                    }}
                  >
                    <pillar.icon
                      className="w-5 h-5 text-foreground/70"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">
                    <TextScramble text={pillar.title} />
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed flex-1">
                  <TextScramble text={pillar.description} />
                </p>
                <span className="mt-4 text-xs text-foreground/60 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <ArrowRight size={12} />
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
