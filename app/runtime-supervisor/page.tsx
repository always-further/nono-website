import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, KeyRound, Workflow } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runtime Supervisor - Dynamic Permission Expansion | nono",
  description:
    "Dynamic permission expansion via Unix socket IPC and seccomp-notify. Approve, deny, or inject credentials at runtime without restarting the agent.",
  alternates: { canonical: "/runtime-supervisor" },
};

const relatedPages = [
  {
    href: "/linux-sandbox",
    label: "Linux Sandbox",
    description: "Kernel-level filesystem isolation",
  },
  {
    href: "/undo",
    label: "Undo & Rollback",
    description: "Atomic filesystem snapshots",
  },
  {
    href: "/guides/runtime-governance-ai",
    label: "Guide: Runtime Governance",
    description: "Policy, audit, and compliance",
  },
];

const supervisorCode = `{
  "supervisor": {
    "socket": "/tmp/nono-supervisor.sock",
    "capabilities": {
      "file_expansion": {
        "prompt": "terminal",
        "allow_patterns": ["~/projects/**"],
        "deny_patterns": ["~/.ssh/**", "~/.aws/**"]
      },
      "network_expansion": {
        "prompt": "terminal",
        "allow_patterns": ["*.npmjs.org", "*.github.com"]
      },
      "credential_injection": {
        "source": "keychain",
        "env_prefix": "NONO_SECRET_"
      }
    }
  }
}`;

const ipcCode = `# Agent requests access to a new file
# nono intercepts via seccomp-notify (Linux)
# or Seatbelt extension point (macOS)

[nono supervisor] Agent requests: FILE_WRITE ~/projects/other/config.yaml

  Approve? [y/N/always] y

[nono supervisor] Expanding sandbox to include:
  ~/projects/other/config.yaml (write)
  Session-scoped. Will not persist after session ends.

# On Linux, seccomp-notify passes the file descriptor
# directly - no retry logic needed in the agent.`;

export default function RuntimeSupervisorPage() {
  return (
    <InfraPageLayout
      title="Dynamic Permission Expansion"
      tagline="Runtime Supervisor"
      description="Approve, deny, or inject credentials at runtime via Unix socket IPC. On Linux, seccomp-notify enables transparent file descriptor passing so agents access new resources without retry logic."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Beyond static sandboxes
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              A static sandbox defines permissions upfront: the agent can access
              these files, these network hosts, these commands. But real-world
              agent workflows are dynamic. An agent might discover it needs to
              read a configuration file in a sibling project, or access a new API
              endpoint it was not originally granted.
            </p>
            <p>
              The runtime supervisor sits between the agent and the kernel
              sandbox, intercepting requests that would otherwise be denied. It
              presents the request to the human operator (via terminal prompt,
              webhook, or API) and, if approved, dynamically expands the sandbox
              scope for that session. The expansion is session-scoped and does
              not persist after the agent exits.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Shield size={20} className="text-accent mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            seccomp-notify on Linux
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            On Linux, nono uses seccomp-notify to intercept system calls that
            would violate the sandbox. The supervisor receives the intercepted
            syscall, prompts for approval, and if granted, passes the file
            descriptor directly to the agent process. The agent does not need
            retry logic &mdash; the syscall completes transparently.
          </p>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <KeyRound
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Credential Injection
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Secrets are loaded from the system keystore (macOS Keychain, Linux
            Secret Service) and injected as environment variables or via the
            network proxy. The agent never touches raw API tokens or credentials.
            Secrets are zeroised from memory when the session ends.
          </p>
        </GlassCard>

        <InfraCodeBlock
          code={supervisorCode}
          language="json"
          filename="profiles/supervisor.json"
        />
        <InfraCodeBlock code={ipcCode} language="bash" filename="terminal" />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-xl font-bold tracking-tight mb-6">
            Supervisor Capabilities
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Workflow,
                title: "File Expansion",
                desc: "Dynamically grant access to new files and directories. Pattern-based rules constrain what the supervisor can approve.",
              },
              {
                icon: Workflow,
                title: "Network Expansion",
                desc: "Approve connections to new hosts at runtime. Denied by default, approved per-session with optional domain pattern matching.",
              },
              {
                icon: Workflow,
                title: "Command Approval",
                desc: "Approve execution of commands not in the original allow-list. Session-scoped approval with full audit trail logging.",
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
