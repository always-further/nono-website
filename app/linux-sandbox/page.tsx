import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Globe, Layers } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linux Sandbox - Kernel-Level Isolation for AI Agents | nono",
  description:
    "How nono uses Linux Landlock and macOS Seatbelt to create irrevocable, kernel-enforced sandboxes for AI coding agents.",
  alternates: { canonical: "/linux-sandbox" },
};

const relatedPages = [
  {
    href: "/runtime-supervisor",
    label: "Runtime Supervisor",
    description: "Dynamic permission expansion via IPC",
  },
  {
    href: "/audit-trail",
    label: "Audit Trail",
    description: "Cryptographic session logging",
  },
  {
    href: "/guides/safe-ai-agent-execution",
    label: "Guide: Safe AI Agent Execution",
    description: "End-to-end walkthrough",
  },
];

const policyCode = `{
  "name": "claude-code",
  "sandbox": {
    "allow": ["~/projects/myapp"],
    "deny": ["~/.ssh", "~/.aws", "~/.config/gcloud"]
  },
  "network": {
    "allow": ["registry.npmjs.org", "api.github.com"],
    "deny_private": true
  },
  "commands": {
    "allow": ["git", "npm", "node", "python3"],
    "deny": ["curl", "wget", "ssh"]
  }
}`;

const landlockCode = `use landlock::{
    ABI, Access, AccessFs, PathBeneath,
    PathFd, Ruleset, RulesetAttr,
};

pub fn apply_sandbox(allowed: &[PathBuf]) -> Result<()> {
    let abi = ABI::V5;
    let access = AccessFs::from_all(abi);

    let mut ruleset = Ruleset::default()
        .handle_access(access)?
        .create()?;

    for path in allowed {
        let fd = PathFd::new(path)?;
        ruleset = ruleset.add_rule(
            PathBeneath::new(fd, access)
        )?;
    }

    // Irrevocable: cannot be loosened after this call
    ruleset.restrict_self()?;
    Ok(())
}`;

export default function LinuxSandboxPage() {
  return (
    <InfraPageLayout
      title="Kernel-Level Isolation for AI Agents"
      tagline="Runtime Isolation"
      description="nono uses Linux Landlock LSM and macOS Seatbelt to create irrevocable, kernel-enforced allow-lists. No root, no containers, no overhead."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main explanation */}
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Why kernel-level sandboxing
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              AI coding agents run as your user, with access to everything you
              have: SSH keys, cloud credentials, source code across every
              project. Traditional sandboxing approaches like Docker or VMs
              introduce significant overhead &mdash; a daemon, image management,
              networking configuration, and volume mounts just to let an agent
              edit a file.
            </p>
            <p>
              nono takes a different approach. On Linux, it uses{" "}
              <strong className="text-foreground">Landlock LSM</strong> to
              restrict filesystem access at the kernel level. On macOS, it uses{" "}
              <strong className="text-foreground">Seatbelt</strong> (the same
              sandbox framework behind every App Store application). Both
              mechanisms are irrevocable once applied &mdash; the sandbox cannot
              be loosened, only tightened.
            </p>
            <p>
              This means zero runtime overhead after sandbox initialization, no
              root privileges required, and automatic inheritance by all child
              processes. The AI agent and every subprocess it spawns are
              structurally unable to access anything outside the allow-list.
            </p>
          </div>
        </GlassCard>

        {/* Composable policy */}
        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Layers size={20} className="text-accent mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Composable JSON Profiles
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Define exactly what an agent can access with declarative JSON
            profiles. 22 built-in groups cover language runtimes, credential
            deny-lists, and dangerous commands. Profiles are version-controlled
            alongside your code.
          </p>
          <Link
            href="/docs"
            className="text-xs text-accent hover:text-accent-hover transition-colors"
          >
            See profile reference &rarr;
          </Link>
        </GlassCard>

        {/* Platform support */}
        <GlassCard className="p-6" glowColor="blue" hoverable>
          <Globe size={20} className="text-accent-blue mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Runs Anywhere
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            No root required. Works on laptops, embedded devices, containers
            (Docker, Podman, Kubernetes), and microvms (Kata, Firecracker).
            Unprivileged userspace sandboxing on both macOS and Linux.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-xs border border-border text-muted">
              macOS via Seatbelt
            </span>
            <span className="px-2 py-0.5 rounded text-xs border border-border text-muted">
              Linux via Landlock
            </span>
          </div>
        </GlassCard>

        {/* Code examples */}
        <InfraCodeBlock
          code={policyCode}
          language="json"
          filename="profiles/claude-code.json"
          className="md:col-span-1"
        />
        <InfraCodeBlock
          code={landlockCode}
          language="rust"
          filename="src/sandbox/landlock.rs"
          className="md:col-span-1"
        />

        {/* Key properties */}
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-xl font-bold tracking-tight mb-6">
            Key Properties
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: "Irrevocable",
                desc: "Once applied, the sandbox cannot be loosened. Only tightened.",
              },
              {
                icon: Lock,
                title: "Unprivileged",
                desc: "No root, no capabilities, no suid binaries required.",
              },
              {
                icon: Lock,
                title: "Inherited",
                desc: "Child processes automatically inherit the sandbox restrictions.",
              },
              {
                icon: Lock,
                title: "Zero Overhead",
                desc: "Kernel-level enforcement. No runtime performance cost after init.",
              },
            ].map((item) => (
              <div key={item.title}>
                <item.icon
                  size={16}
                  className="text-accent mb-2"
                  strokeWidth={1.5}
                />
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </InfraPageLayout>
  );
}
