"use client";

import { useState } from "react";
import {
  Lock,
  Shield,
  KeyRound,
  ScrollText,
  Layers,
  Undo2,
  FileCheck,
  Fingerprint,
  Box,
  FileJson,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGroup {
  label: string;
  heading: string;
  value: string;
  features: Feature[];
}

const groups: FeatureGroup[] = [
  {
    label: "Runtime Isolation",
    heading: "Zero-Trust Runtime Isolation",
    value: "Eliminate the blast radius.",
    features: [
      {
        icon: Lock,
        title: "Isolation Sandbox",
        description:
          "Landlock on Linux and Windows (WSL2), Seatbelt on macOS — irrevocable allow-lists at the kernel level. Host-level network filtering with CIDR deny ranges blocks SSRF and data exfiltration.",
      },
      {
        icon: Box,
        title: "Runs Anywhere",
        description:
          "No root required. Runs on laptops, embedded devices, containers (Docker, Podman, Kubernetes), and microvms (Kata, Firecracker). Unprivileged userspace sandboxing.",
      },
      {
        icon: Layers,
        title: "Composable Policy",
        description:
          "Composable JSON profiles define exactly what an agent can access. 22 built-in groups cover runtimes, credential deny-lists, and dangerous commands.",
      },
    ],
  },
  {
    label: "Identity & Credentials",
    heading: "Secure Identity & Credential Lifecycle",
    value: "Agents never see the keys to the kingdom.",
    features: [
      {
        icon: KeyRound,
        title: "Secrets Injection",
        description:
          "Secrets load from the system keystore and get injected as environment variables or via the network proxy. Agents never touch raw API tokens or credentials. Zeroised on exit.",
      },
      {
        icon: Shield,
        title: "Supervisor & Capability Expansion",
        description:
          "Runtime approval prompts via Unix socket IPC. On Linux, seccomp-notify enables transparent fd-passing so agents access new files without retry logic.",
      },
      {
        icon: FileJson,
        title: "Config-Driven",
        description:
          "Everything is declarative JSON config. Profiles, groups, network policy, and trust policy are all version-controlled alongside your code. Persist agent security state in your repo.",
      },
    ],
  },
  {
    label: "Integrity & Supply Chain",
    heading: "Cryptographic Integrity & Supply Chain",
    value: "Verify every instruction before execution.",
    features: [
      {
        icon: FileCheck,
        title: "Instruction File Trust",
        description:
          "Sigstore-based signing and verification of SKILLS.md, CLAUDE.md, and AGENT.MD files. Unsigned instruction files are blocked at the kernel level.",
      },
      {
        icon: Fingerprint,
        title: "Cryptographic Audit Trail",
        description:
          "Merkle tree commitments over every filesystem snapshot. Cryptographically verify that no file was altered outside the sandbox. Tamper-evident by construction.",
      },
    ],
  },
  {
    label: "Resilience & Forensics",
    heading: "Resilience & Forensic Accountability",
    value: "Immutable history and one-click recovery.",
    features: [
      {
        icon: ScrollText,
        title: "Provenance and Audit",
        description:
          "Every operation is recorded with a Merkle tree rooted in SHA-256 hashes. Full session audit trail with date and command filtering, plus JSON export.",
      },
      {
        icon: Undo2,
        title: "Atomic Rollbacks",
        description:
          "SHA-256 content-addressed snapshots capture filesystem state before and after execution. Restore any session with a single command.",
      },
    ],
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const group = groups[active];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          Security without compromise
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Unlike policy-based approaches that intercept and filter operations after they occur,
          nono leverages OS security primitives to create an environment where
          unauthorized operations are structurally impossible.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {groups.map((g, i) => (
            <button
              key={g.label}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                i === active
                  ? "bg-surface-hover text-foreground"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-8 pt-8 pb-4 md:px-10 md:pt-10 border-b border-border">
            <h3 className="text-xl font-semibold tracking-tight">
              {group.heading}
            </h3>
            <p className="text-sm text-muted mt-1">
              {group.value}
            </p>
          </div>

          <div
            className={`grid ${
              group.features.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {group.features.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-8 md:p-10 hover:bg-surface transition-colors ${
                  index < group.features.length - 1
                    ? "border-b md:border-b-0 md:border-r border-border"
                    : ""
                }`}
              >
                <feature.icon
                  className="w-5 h-5 text-muted mb-5"
                  strokeWidth={1.5}
                />
                <h4 className="text-lg font-semibold mb-2 tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
