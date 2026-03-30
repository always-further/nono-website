import { SdkPageLayout } from "@/components/sdk/SdkPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Shield, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go SDK - Runtime Safety for Go AI Agents",
  description:
    "Enforce kernel-level filesystem isolation from Go with nono-go. Landlock on Linux and Windows, Seatbelt on macOS.",
  alternates: { canonical: "/go-sdk" },
  openGraph: {
    title: "Go SDK - Runtime Safety for Go AI Agents",
    description:
      "Enforce kernel-level filesystem isolation from Go with nono-go. Landlock on Linux and Windows, Seatbelt on macOS.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

const quickStart = `package main

import (
	"github.com/always-further/nono-go"
)

func main() {
	// Define capabilities
	caps := nono.NewCapabilitySet()
	caps.AllowPath("/project", nono.ReadWrite)
	caps.AllowFile("/home/user/.gitconfig", nono.Read)
	caps.BlockNetwork() // deny all outbound connections

	// Apply sandbox (irrevocable)
	if err := nono.Apply(caps); err != nil {
		log.Fatal(err)
	}

	// Your agent code runs here, fully sandboxed
	agent.Run()
}`;

const queryCode = `package main

import (
	"fmt"
	"github.com/always-further/nono-go"
)

func main() {
	// Check platform support
	info := nono.SupportInfo()
	fmt.Println(info.Platform, info.Details)

	// Build capabilities and dry-run check
	caps := nono.NewCapabilitySet()
	caps.AllowPath("/project", nono.ReadWrite)

	ctx := nono.NewQueryContext(caps)
	result := ctx.QueryPath("/etc/passwd", nono.Read)
	fmt.Println(result.Status) // "denied"
	fmt.Println(result.Reason) // explains why
}`;

export default function GoSdkPage() {
  return (
    <SdkPageLayout
      language="Go"
      packageName="nono-go"
      installCommand="go get github.com/always-further/nono-go"
      registryUrl="https://pkg.go.dev/github.com/always-further/nono-go"
      registryName="pkg.go.dev"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Secure execution model
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              The Go SDK provides CGo bindings to nono&apos;s core Rust library.
              When you call{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
                nono.Apply(caps)
              </code>
              , the SDK applies kernel-level Landlock rules (Linux) or Seatbelt
              profiles (macOS) to the current process. The sandbox is irrevocable
              &mdash; it cannot be loosened after application.
            </p>
            <p>
              This means your Go AI agent and every subprocess it spawns operate
              within the defined capability set. Filesystem access is constrained
              at the kernel level, not by application-level checks that can be
              bypassed. Use{" "}
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
            Static Binary Support
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Compiles to a single static binary with CGo bindings to nono&apos;s
            Rust core. No runtime dependencies beyond the kernel. Works with
            standard Go build tooling and cross-compilation.
          </p>
        </GlassCard>

        <InfraCodeBlock
          code={quickStart}
          language="go"
          filename="main.go"
        />
        <InfraCodeBlock
          code={queryCode}
          language="go"
          filename="query.go"
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
                desc: "Builder pattern for defining filesystem access, network blocking, and command rules. Irrevocable after Apply().",
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
