import { SdkPageLayout } from "@/components/sdk/SdkPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Globe, Undo2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Python SDK - Runtime Safety for Python AI Agents | nono",
  description:
    "Enforce kernel-level isolation, network filtering, and atomic rollbacks from Python with nono-py.",
  alternates: { canonical: "/python-sdk" },
};

const quickStart = `import nono_py as nono

# Define capabilities
caps = nono.CapabilitySet()
caps.allow_path("/project", nono.AccessMode.READ_WRITE)
caps.allow_network("registry.npmjs.org")
caps.block_network()  # deny all other network

# Apply sandbox (irrevocable)
nono.apply(caps)

# Your agent code runs here, fully sandboxed
agent.run()`;

const snapshotCode = `import nono_py as nono

# Create a pre-execution snapshot
snapshot_id = nono.snapshot.create("/project")

# Run the agent
agent.run()

# Review changes
diff = nono.snapshot.diff(snapshot_id)
print(f"Files changed: {len(diff.files)}")

# Undo if needed
nono.snapshot.restore(snapshot_id)`;

export default function PythonSdkPage() {
  return (
    <SdkPageLayout
      language="Python"
      packageName="nono-py"
      installCommand="pip install nono-py"
      registryUrl="https://pypi.org/project/nono-py/"
      registryName="PyPI"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Secure execution model
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              The Python SDK provides a thin wrapper around nono&apos;s core Rust
              library via PyO3 bindings. When you call{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
                nono.apply(caps)
              </code>
              , the SDK applies kernel-level Landlock rules (Linux) or Seatbelt
              profiles (macOS) to the current process. The sandbox is irrevocable
              &mdash; it cannot be loosened after application.
            </p>
            <p>
              This means your Python AI agent and every subprocess it spawns
              operate within the defined capability set. File access, network
              connections, and command execution are all constrained at the kernel
              level, not by application-level checks that can be bypassed.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Lock size={20} className="text-accent mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Filesystem Isolation
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Define per-path access modes (read, write, execute) with fine-grained
            control. Deny-lists prevent access to sensitive directories like
            ~/.ssh, ~/.aws, and ~/.config regardless of the allow-list.
          </p>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <Globe
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Network Filtering
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Allowlist specific domains for network access. All other outbound
            connections are blocked, including private IP ranges for SSRF
            protection. Works with any HTTP library &mdash; requests, httpx, aiohttp.
          </p>
        </GlassCard>

        <InfraCodeBlock
          code={quickStart}
          language="python"
          filename="sandbox.py"
        />
        <InfraCodeBlock
          code={snapshotCode}
          language="python"
          filename="snapshots.py"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-xl font-bold tracking-tight mb-6">
            SDK Capabilities
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: "CapabilitySet",
                desc: "Define filesystem, network, and command access rules. Composable and immutable once applied.",
              },
              {
                icon: Undo2,
                title: "Snapshots",
                desc: "Create and restore SHA-256 content-addressed filesystem snapshots. Review diffs programmatically.",
              },
              {
                icon: Globe,
                title: "Audit API",
                desc: "Query the session audit trail from Python. Filter by operation type, timestamp, or disposition.",
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
    </SdkPageLayout>
  );
}
