import { SdkPageLayout } from "@/components/sdk/SdkPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Shield, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Python SDK - Runtime Safety for Python AI Agents",
  description:
    "Enforce kernel-level filesystem isolation from Python with nono-py. Landlock on Linux, Seatbelt on macOS.",
  alternates: { canonical: "/python-sdk" },
  openGraph: {
    title: "Python SDK - Runtime Safety for Python AI Agents",
    description:
      "Enforce kernel-level filesystem isolation from Python with nono-py. Landlock on Linux, Seatbelt on macOS.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

const quickStart = `import nono_py as nono

# Define capabilities
caps = nono.CapabilitySet()
caps.allow_path("/project", nono.AccessMode.READ_WRITE)
caps.allow_file("/home/user/.gitconfig", nono.AccessMode.READ)
caps.block_network()  # deny all outbound connections

# Apply sandbox (irrevocable)
nono.apply(caps)

# Your agent code runs here, fully sandboxed
agent.run()`;

const queryCode = `import nono_py as nono

# Check platform support
info = nono.support_info()
print(info.platform, info.details)

# Build capabilities and dry-run check
caps = nono.CapabilitySet()
caps.allow_path("/project", nono.AccessMode.READ_WRITE)

ctx = nono.QueryContext(caps)
result = ctx.query_path("/etc/passwd", nono.AccessMode.READ)
print(result.status)  # "denied"
print(result.reason)  # explains why`;

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
              operate within the defined capability set. Filesystem access is
              constrained at the kernel level, not by application-level checks
              that can be bypassed. Use{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
                QueryContext
              </code>{" "}
              to dry-run permission checks and{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
                SandboxState
              </code>{" "}
              to serialize capability sets.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Lock size={20} className="text-accent mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Filesystem Isolation
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Define per-path access modes (read, write, read-write) with
            fine-grained control. Only explicitly allowed paths are accessible
            &mdash; everything else is denied by default at the kernel level.
          </p>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <Shield
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Network Blocking
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Block all outbound network connections at the kernel level with{" "}
            <code className="px-1 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
              block_network()
            </code>
            . The block is enforced by Landlock (Linux) or Seatbelt (macOS) and
            applies to all child processes.
          </p>
        </GlassCard>

        <InfraCodeBlock
          code={quickStart}
          language="python"
          filename="sandbox.py"
        />
        <InfraCodeBlock
          code={queryCode}
          language="python"
          filename="query.py"
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
                desc: "Builder pattern for defining filesystem access, network blocking, and command rules. Irrevocable after apply().",
              },
              {
                icon: Search,
                title: "QueryContext",
                desc: "Dry-run permission checks against a capability set. Test whether a path or network access would be allowed before applying.",
              },
              {
                icon: Shield,
                title: "SandboxState",
                desc: "Serialize and deserialize capability sets to JSON. Persist sandbox configurations or transfer them between processes.",
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
