import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { DOCS_URL } from "@/lib/site";
import { Lock, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linux Sandbox - Kernel-Level Isolation for AI Agents",
  description:
    "How nono uses Linux Landlock and macOS Seatbelt to create irrevocable, kernel-enforced sandboxes for AI coding agents.",
  alternates: { canonical: "/linux-sandbox" },
  openGraph: {
    title: "Linux Sandbox - Kernel-Level Isolation for AI Agents",
    description:
      "How nono uses Linux Landlock and macOS Seatbelt to create irrevocable, kernel-enforced sandboxes for AI coding agents.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
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
  "meta": {
    "name": "claude-code",
    "version": "1.0.0",
    "description": "Anthropic Claude Code CLI agent"
  },
  "security": {
    "groups": ["node_runtime", "python_runtime", "rust_runtime"]
  },
  "filesystem": {
    "allow": ["$HOME/.claude"],
    "read_file": ["$HOME/.gitconfig"]
  },
  "network": { "block": false },
  "workdir": { "access": "readwrite" },
  "undo": {
    "exclude_patterns": ["node_modules", ".next", "target"]
  },
  "interactive": true
}`;

const bannerCode = `$ nono run --allow-cwd --proxy-allow llmapi -- agent

  ▄█▄   nono v0.7.0
 ▀▄^▄▀  - Halo Nono!

Capabilities:
  Filesystem:
    /Users/user/.claude [read+write] (dir)
    /Users/user/.local/share/claude [read] (dir)
    /Users/user/.claude.json [read+write] (file)
    /Users/user/.gitconfig [read] (file)
    /Users/user/dev/myproject [read+write] (dir)
    + 45 system/group paths (use -v to show)
  Network:
    outbound: proxy (localhost:0)

Supervised mode: child sandboxed, parent manages network proxy.

Applying Kernel sandbox protections.`;

const landlockCode = `use landlock::{
    ABI, Access, AccessFs, AccessNet, BitFlags,
    PathBeneath, PathFd, Ruleset, RulesetAttr,
    RulesetCreatedAttr,
};

const TARGET_ABI: ABI = ABI::V5;

pub fn apply_sandbox(caps: &CapabilitySet) -> Result<()> {
    let mut ruleset = Ruleset::default()
        .handle_access(AccessFs::from_all(TARGET_ABI))?
        .create()?;

    for (path, access_mode) in caps.paths() {
        let flags = access_to_landlock(access_mode);
        let fd = PathFd::new(path)?;
        ruleset = ruleset.add_rule(
            PathBeneath::new(fd, flags)
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
            profiles. Built-in security groups cover language runtimes, cache
            directories, and editor integrations. Profiles are
            version-controlled alongside your code.
          </p>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:text-accent-hover transition-colors"
          >
            See profile reference &rarr;
          </a>
        </GlassCard>

        {/* Live output */}
        <InfraCodeBlock
          code={bannerCode}
          language="bash"
          filename="terminal"
          className="md:col-span-1"
        />

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
          filename="crates/nono/src/sandbox/linux.rs"
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
