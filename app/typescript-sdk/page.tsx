import { SdkPageLayout } from "@/components/sdk/SdkPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Globe, Undo2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TypeScript SDK - Runtime Safety for TypeScript AI Agents | nono",
  description:
    "Enforce kernel-level isolation, network filtering, and atomic rollbacks from TypeScript with nono-ts.",
  alternates: { canonical: "/typescript-sdk" },
};

const quickStart = `import { CapabilitySet, AccessMode, apply } from 'nono-ts';

// Define capabilities
const caps = new CapabilitySet();
caps.allowPath('/project', AccessMode.ReadWrite);
caps.allowNetwork('registry.npmjs.org');
caps.blockNetwork(); // deny all other network

// Apply sandbox (irrevocable)
apply(caps);

// Your agent code runs here, fully sandboxed
await agent.run();`;

const snapshotCode = `import { Snapshot } from 'nono-ts';

// Create a pre-execution snapshot
const snapshotId = await Snapshot.create('/project');

// Run the agent
await agent.run();

// Review changes
const diff = await Snapshot.diff(snapshotId);
console.log(\`Files changed: \${diff.files.length}\`);

// Undo if needed
await Snapshot.restore(snapshotId);`;

export default function TypeScriptSdkPage() {
  return (
    <SdkPageLayout
      language="TypeScript"
      packageName="nono-ts"
      installCommand="npm install nono-ts"
      registryUrl="https://www.npmjs.com/package/nono-ts"
      registryName="npm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Secure execution model
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              The TypeScript SDK provides native N-API bindings to nono&apos;s core
              Rust library. When you call{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
                apply(caps)
              </code>
              , the SDK applies kernel-level Landlock rules (Linux) or Seatbelt
              profiles (macOS) to the Node.js process. The sandbox is irrevocable
              and inherited by all child processes.
            </p>
            <p>
              This works with any Node.js runtime &mdash; standard Node, Bun, or
              Deno. The native bindings load the correct platform-specific
              library automatically. Network filtering works at the kernel level,
              so it constrains all HTTP clients including fetch, axios, and
              node-fetch.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Lock size={20} className="text-accent mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Type-Safe API
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Full TypeScript type definitions with strict mode support. The
            CapabilitySet builder pattern catches policy errors at compile time.
            All async operations return properly typed Promises.
          </p>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <Globe
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Runtime Compatibility
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Works with Node.js 18+, Bun, and Deno. The native N-API bindings
            load platform-specific libraries automatically. ESM and CJS module
            formats are both supported.
          </p>
        </GlassCard>

        <InfraCodeBlock
          code={quickStart}
          language="typescript"
          filename="sandbox.ts"
        />
        <InfraCodeBlock
          code={snapshotCode}
          language="typescript"
          filename="snapshots.ts"
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
                desc: "Builder pattern for defining filesystem, network, and command rules. Immutable after apply().",
              },
              {
                icon: Undo2,
                title: "Snapshot",
                desc: "Async API for creating, diffing, and restoring SHA-256 content-addressed snapshots.",
              },
              {
                icon: Globe,
                title: "Audit",
                desc: "Query session audit trails with typed filters. Stream operations in real-time or query after session end.",
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
