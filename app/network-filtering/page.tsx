import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { DOCS_URL } from "@/lib/site";
import { Globe, ShieldCheck, Server, Ban } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Filtering - Domain-Level Access Control for AI Agents",
  description:
    "Block all network access, allow specific domains, filter API endpoints, and route through upstream proxies. Built into the nono CLI with kernel-enforced port restrictions.",
  alternates: { canonical: "/network-filtering" },
  openGraph: {
    title: "Network Filtering - Domain-Level Access Control for AI Agents",
    description:
      "Block all network access, allow specific domains, filter API endpoints, and route through upstream proxies. Built into the nono CLI with kernel-enforced port restrictions.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

const relatedPages = [
  {
    href: "/credential-injection",
    label: "Credential Injection",
    description: "Proxy-based secret management",
  },
  {
    href: "/os-sandbox",
    label: "OS Sandbox",
    description: "Kernel-level filesystem isolation",
  },
  {
    href: "/runtime-supervisor",
    label: "Runtime Supervisor",
    description: "Dynamic permission expansion via IPC",
  },
];

const quickStartCode = `# Block all network access
nono run --allow-cwd --block-net -- cargo build

# Allow specific domains only
nono run --allow-cwd --allow-domain api.openai.com \\
  --allow-domain api.anthropic.com -- my-agent

# Use a built-in network profile
nono run --allow-cwd --network-profile claude-code -- claude

# Add custom domains to a profile
nono run --allow-cwd --network-profile developer \\
  --allow-domain my-internal-api.example.com -- my-agent`;

const profileCode = `{
  "network": {
    "network_profile": "developer",
    "allow_domain": ["my-internal-api.example.com"]
  }
}`;

const upstreamProxyCode = `# Route through corporate proxy
nono run --allow-cwd --network-profile enterprise \\
  --upstream-proxy squid.corp:3128 -- my-agent

# Bypass proxy for internal hosts
nono run --allow-cwd --network-profile enterprise \\
  --upstream-proxy squid.corp:3128 \\
  --upstream-bypass git.internal.corp \\
  --upstream-bypass "*.dev.local" \\
  -- my-agent`;

const upstreamProfileCode = `{
  "network": {
    "network_profile": "enterprise",
    "upstream_proxy": "squid.corp:3128",
    "upstream_bypass": [
      "git.internal.corp",
      "*.dev.local"
    ]
  }
}`;

const endpointCode = `# Allow only chat completions on OpenAI
nono run --allow-cwd --credential openai \\
  --allow-endpoint 'openai:POST:/v1/chat/completions' \\
  -- my-agent

# Fine-grained GitHub API access
nono run --allow-cwd --credential github \\
  --allow-endpoint 'github:GET:/repos/*/issues/**' \\
  --allow-endpoint 'github:POST:/repos/*/issues/*/comments' \\
  -- my-agent`;

const endpointProfileCode = `{
  "network": {
    "custom_credentials": {
      "gitlab": {
        "upstream": "https://gitlab.example.com",
        "credential_key": "gitlab_token",
        "endpoint_rules": [
          {
            "method": "GET",
            "path": "/api/v4/projects/*/merge_requests/**"
          },
          {
            "method": "POST",
            "path": "/api/v4/projects/*/merge_requests/*/notes"
          }
        ]
      }
    }
  }
}`;

const localhostCode = `# Bidirectional localhost IPC on port 3000
nono run --block-net --open-port 3000 \\
  --allow ./mcp-server -- node server.js

# Combine with domain filtering
nono run --network-profile claude-code \\
  --open-port 3000 --allow-cwd -- claude

# Listen-only port for dev servers
nono run --allow-cwd --network-profile developer \\
  --listen-port 3000 -- npm run dev`;

const auditCode = `$ nono run -vv --network-profile claude-code --allow-cwd -- my-agent

ALLOW CONNECT api.openai.com:443
ALLOW CONNECT github.com:443
DENY  CONNECT 169.254.169.254:80 reason=denied_cidr
ALLOW REVERSE openai POST /v1/chat/completions -> 200`;

export default function NetworkFilteringPage() {
  return (
    <InfraPageLayout
      title="Network Filtering"
      tagline="Domain-Level Access Control"
      description="Block all network access, allow specific domains, filter individual API endpoints, and route through upstream proxies. The proxy starts on a random localhost port and the kernel sandbox restricts the child to that port only."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              By default, sandboxed processes have unrestricted network access.
              When you enable domain filtering via{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                --network-profile
              </code>
              ,{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                --allow-domain
              </code>
              , or{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                --credential
              </code>
              , an HTTP proxy starts on a random localhost port (or a fixed port
              via{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                --proxy-port
              </code>
              ). The child sandbox is restricted to that port only, and a
              256-bit session token authenticates every request.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={quickStartCode}
          language="bash"
          filename="terminal"
          className="md:col-span-2"
        />

        <GlassCard className="p-6" hoverable>
          <Globe
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Built-in Network Profiles
          </h3>
          <div className="text-sm text-muted leading-relaxed space-y-2">
            <p>Pre-configured domain sets for common workflows:</p>
            <ul className="space-y-1.5">
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">minimal</code>
                {" "}&mdash; LLM API access only
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">developer</code>
                {" "}&mdash; General development
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">claude-code</code>
                {" "}&mdash; Claude Code agent
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">codex</code>
                {" "}&mdash; Codex agent with OpenAI credential
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">enterprise</code>
                {" "}&mdash; Corporate environments
              </li>
            </ul>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hoverable>
          <Ban
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Always-Denied Destinations
          </h3>
          <div className="text-sm text-muted leading-relaxed space-y-2">
            <p>
              These destinations are blocked regardless of configuration and
              cannot be overridden:
            </p>
            <ul className="space-y-1.5">
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">169.254.169.254</code>
                {" "}&mdash; AWS/GCP/Azure metadata
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">metadata.google.internal</code>
                {" "}&mdash; GCP metadata
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">169.254.0.0/16</code>
                {" "}&mdash; IPv4 link-local
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">fe80::/10</code>
                {" "}&mdash; IPv6 link-local
              </li>
            </ul>
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Domain group profiles
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Network profiles are composed from domain groups. Key groups
              include{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">llm_apis</code>
              {" "}(OpenAI, Anthropic, Google),{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">package_registries</code>
              {" "}(npm, PyPI, crates.io),{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">github</code>
              ,{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">sigstore</code>
              , and cloud platform groups for{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">google_cloud</code>
              ,{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">azure</code>
              , and{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">aws_bedrock</code>
              . You can extend any profile with additional domains via CLI
              flags or profile configuration.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={profileCode}
          language="json"
          filename="profiles/my-agent.json"
        />

        <InfraCodeBlock
          code={auditCode}
          language="bash"
          filename="audit log (verbose)"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Endpoint filtering
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Beyond domain-level control, you can restrict access to specific
              API endpoints. Patterns support exact paths, single-segment
              wildcards (
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">*</code>
              ), and multi-segment wildcards (
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">**</code>
              ). Method can be a specific HTTP verb or{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">*</code>
              {" "}for any.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={endpointCode}
          language="bash"
          filename="terminal"
        />

        <InfraCodeBlock
          code={endpointProfileCode}
          language="json"
          filename="profiles/gitlab-read.json"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Upstream proxy
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              For corporate environments, route all filtered traffic through an
              upstream proxy. Bypass rules let internal hosts skip the upstream
              proxy while still being subject to nono domain filtering.
              Configuration also works via{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">NONO_UPSTREAM_PROXY</code>
              {" "}and{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">NONO_UPSTREAM_BYPASS</code>
              {" "}environment variables.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={upstreamProxyCode}
          language="bash"
          filename="terminal"
        />

        <InfraCodeBlock
          code={upstreamProfileCode}
          language="json"
          filename="profiles/enterprise.json"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Localhost IPC
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Open specific localhost ports for inter-process communication,
              even when all external network access is blocked. Use{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">--open-port</code>
              {" "}for bidirectional access or{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">--listen-port</code>
              {" "}for listen-only. Both can be combined with domain filtering.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={localhostCode}
          language="bash"
          filename="terminal"
          className="md:col-span-2"
        />

        <GlassCard className="md:col-span-2 p-8">
          <div className="flex items-start gap-4">
            <Server
              size={24}
              className="text-accent shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                Platform behaviour
              </h3>
              <div className="text-sm text-muted leading-relaxed space-y-2">
                <p>
                  <strong className="text-foreground">Linux:</strong> Requires
                  Landlock ABI v4+ (Linux 6.7+). Uses per-port TCP rules for
                  full enforcement.
                </p>
                <p>
                  <strong className="text-foreground">macOS:</strong> Uses
                  Seatbelt rules limiting the child to{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">localhost:PORT</code>
                  {" "}only. No per-port destination filtering.
                </p>
                <p>
                  <strong className="text-foreground">WSL2:</strong>{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">--block-net</code>
                  {" "}works; domain filtering is disabled by default due to
                  kernel limitations. Enable with{" "}
                  <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">wsl2_proxy_policy: &quot;insecure_proxy&quot;</code>
                  {" "}in profile security config.
                </p>
                <p className="pt-2">
                  See the{" "}
                  <a
                    href={`${DOCS_URL}/cli/features/networking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    networking docs
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
