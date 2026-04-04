import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { DOCS_URL } from "@/lib/site";
import { Terminal, Eye, Trash2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ghost Sessions - Detachable Session Lifecycle for AI Agents",
  description:
    "Run AI agents in detached sessions, attach and detach terminals on demand, inspect session metadata, and manage session lifecycle with nono ps, attach, detach, stop, and prune.",
  alternates: { canonical: "/ghost-sessions" },
  openGraph: {
    title: "Ghost Sessions - Detachable Session Lifecycle for AI Agents",
    description:
      "Run AI agents in detached sessions, attach and detach terminals on demand, inspect session metadata, and manage session lifecycle with nono ps, attach, detach, stop, and prune.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

const relatedPages = [
  {
    href: "/os-sandbox",
    label: "OS Sandbox",
    description: "Kernel-level filesystem isolation",
  },
  {
    href: "/audit-trail",
    label: "Audit Trail",
    description: "Cryptographic session logging",
  },
  {
    href: "/undo",
    label: "Undo & Rollback",
    description: "Atomic filesystem snapshots",
  },
];

const startCode = `# Start attached (default)
nono run --profile claude-code --allow-cwd -- claude

# Start detached — runs in background
nono run --detached --profile claude-code --allow-cwd -- claude
# Output: Started detached session [id]. Attach with: nono attach [id]`;

const psCode = `# List running sessions
nono ps

# Include exited sessions
nono ps --all

# JSON output for scripting
nono ps --json`;

const attachDetachCode = `# Attach to a running session
nono attach a3f7c2

# Detach from CLI
nono detach a3f7c2

# Detach from inside the terminal
# Press: Ctrl-] d (configurable)`;

const inspectCode = `# View session metadata
nono inspect a3f7c2

# JSON output
nono inspect a3f7c2 --json`;

const stopCode = `# Graceful stop
nono stop a3f7c2

# Custom timeout (seconds)
nono stop a3f7c2 --timeout 15

# Force stop
nono stop a3f7c2 --force`;

const pruneCode = `# Preview what would be removed
nono prune --dry-run

# Remove sessions older than 7 days
nono prune --older-than 7

# Keep only the 20 most recent
nono prune --keep 20`;

const configCode = `# ~/.config/nono/config.toml

[ui]
detach_sequence = "ctrl-] d"`;

export default function GhostSessionsPage() {
  return (
    <InfraPageLayout
      title="Ghost Sessions"
      tagline="Detachable Session Lifecycle"
      description="Run AI agents in detached sessions that persist after you close your terminal. Attach and detach on demand, inspect session state, and manage lifecycle with familiar commands."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Session states
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Every nono session has two orthogonal state dimensions: a lifecycle
              state (
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                running
              </code>
              ,{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                paused
              </code>
              , or{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                exited
              </code>
              ) and an attachment state (
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                attached
              </code>
              {" "}or{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                detached
              </code>
              ). A session can be running and detached, meaning the agent
              continues working while no terminal is connected.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hoverable>
          <Terminal
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Core Commands
          </h3>
          <div className="text-sm text-muted leading-relaxed">
            <table className="w-full mt-2">
              <tbody className="text-xs font-mono">
                <tr>
                  <td className="pr-4 py-1.5 text-foreground">nono ps</td>
                  <td className="py-1.5">List sessions</td>
                </tr>
                <tr>
                  <td className="pr-4 py-1.5 text-foreground">
                    nono attach &lt;id&gt;
                  </td>
                  <td className="py-1.5">Connect terminal</td>
                </tr>
                <tr>
                  <td className="pr-4 py-1.5 text-foreground">
                    nono detach &lt;id&gt;
                  </td>
                  <td className="py-1.5">Drop terminal</td>
                </tr>
                <tr>
                  <td className="pr-4 py-1.5 text-foreground">
                    nono stop &lt;id&gt;
                  </td>
                  <td className="py-1.5">Terminate session</td>
                </tr>
                <tr>
                  <td className="pr-4 py-1.5 text-foreground">
                    nono inspect &lt;id&gt;
                  </td>
                  <td className="py-1.5">Session metadata</td>
                </tr>
                <tr>
                  <td className="pr-4 py-1.5 text-foreground">nono prune</td>
                  <td className="py-1.5">Clean old records</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hoverable>
          <ShieldCheck
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Security Model
          </h3>
          <ul className="text-sm text-muted leading-relaxed space-y-1.5">
            <li>Local-only and same-user only access</li>
            <li>Private session registry directory</li>
            <li>Owner-only socket permissions</li>
            <li>Kernel peer-credential checks</li>
          </ul>
        </GlassCard>

        <InfraCodeBlock
          code={startCode}
          language="bash"
          filename="starting sessions"
          className="md:col-span-2"
        />

        <InfraCodeBlock
          code={psCode}
          language="bash"
          filename="listing sessions"
        />

        <InfraCodeBlock
          code={attachDetachCode}
          language="bash"
          filename="attach / detach"
        />

        <InfraCodeBlock
          code={inspectCode}
          language="bash"
          filename="inspecting sessions"
        />

        <InfraCodeBlock
          code={stopCode}
          language="bash"
          filename="stopping sessions"
        />

        <InfraCodeBlock
          code={pruneCode}
          language="bash"
          filename="pruning sessions"
          className="md:col-span-1"
        />

        <InfraCodeBlock
          code={configCode}
          language="toml"
          filename="config.toml"
          className="md:col-span-1"
        />

        <GlassCard className="md:col-span-2 p-8">
          <div className="flex items-start gap-4">
            <Eye
              size={24}
              className="text-accent shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                Detach sequence
              </h3>
              <div className="text-sm text-muted leading-relaxed space-y-2">
                <p>
                  The default detach sequence is{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                    Ctrl-] d
                  </code>
                  , configurable in{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                    ~/.config/nono/config.toml
                  </code>
                  . Supported tokens include single characters, named keys (
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                    esc
                  </code>
                  ,{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                    tab
                  </code>
                  ,{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                    enter
                  </code>
                  ,{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                    space
                  </code>
                  ), and control chords. A minimum of two key presses is
                  required.
                </p>
                <p className="pt-2">
                  See the{" "}
                  <a
                    href={`${DOCS_URL}/cli/features/session-lifecycle`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    session lifecycle docs
                  </a>
                  {" "}for full details.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </InfraPageLayout>
  );
}
