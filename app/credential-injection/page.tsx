import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { DOCS_URL } from "@/lib/site";
import { KeyRound, ShieldCheck, Plug, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credential Injection - Proxy-Based Secret Management for AI Agents",
  description:
    "Inject API keys via a reverse proxy so credentials never enter the sandbox. Supports macOS Keychain, Linux Secret Service, 1Password, and Apple Passwords.",
  alternates: { canonical: "/credential-injection" },
  openGraph: {
    title: "Credential Injection - Proxy-Based Secret Management for AI Agents",
    description:
      "Inject API keys via a reverse proxy so credentials never enter the sandbox. Supports macOS Keychain, Linux Secret Service, 1Password, and Apple Passwords.",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "nono" }],
  },
};

const relatedPages = [
  {
    href: "/network-filtering",
    label: "Network Filtering",
    description: "Domain-level access control",
  },
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
];

const quickStartCode = `# Proxy injection — agent never sees the API key
nono run --allow-cwd --network-profile claude-code \\
  --credential openai -- my-agent

# Environment variable injection — simpler but less secure
nono run --allow-cwd --env-credential openai_api_key -- my-agent

# Multiple credentials
nono run --allow-cwd \\
  --env-credential openai_api_key,anthropic_api_key -- claude`;

const keychainCode = `# macOS Keychain — store credentials
security add-generic-password -s "nono" -a "openai_api_key" -w
security add-generic-password -s "nono" -a "anthropic_api_key" -w

# Update existing
security add-generic-password -s "nono" -a "openai_api_key" -w "new-value" -U

# Delete
security delete-generic-password -s "nono" -a "openai_api_key"

# List all nono secrets
security dump-keychain | grep -A5 "nono"`;

const linuxCode = `# Linux Secret Service — store credentials
echo -n "sk-..." | secret-tool store \\
  --label="nono: openai_api_key" \\
  service nono username openai_api_key target default

# Look up
secret-tool lookup service nono username openai_api_key target default

# Delete
secret-tool clear service nono username openai_api_key target default`;

const proxyProfileCode = `{
  "meta": { "name": "my-agent-secure" },
  "network": {
    "custom_credentials": {
      "openai": {
        "upstream": "https://api.openai.com/v1",
        "credential_key": "op://Development/OpenAI API Key/credential",
        "env_var": "OPENAI_API_KEY",
        "inject_header": "Authorization",
        "credential_format": "Bearer {}"
      }
    },
    "credentials": ["openai"]
  }
}`;

const customCredentialCode = `{
  "network": {
    "custom_credentials": {
      "telegram": {
        "upstream": "https://api.telegram.org",
        "credential_key": "telegram_bot_token",
        "inject_mode": "url_path",
        "path_pattern": "/bot{}/",
        "path_replacement": "/bot{}/"
      },
      "google_maps": {
        "upstream": "https://maps.googleapis.com",
        "credential_key": "google_maps_api_key",
        "inject_mode": "query_param",
        "query_param_name": "key"
      },
      "private_api": {
        "upstream": "https://api.example.com",
        "credential_key": "example_basic_auth",
        "inject_mode": "basic_auth"
      }
    }
  }
}`;

const envProfileCode = `{
  "meta": { "name": "my-agent" },
  "env_credentials": {
    "openai_api_key": "OPENAI_API_KEY",
    "anthropic_api_key": "ANTHROPIC_API_KEY",
    "custom_token": "MY_CUSTOM_TOKEN"
  }
}`;

const mixedCode = `{
  "meta": { "name": "mixed-example" },
  "env_credentials": {
    "op://Infrastructure/Database/password": "DATABASE_PASSWORD"
  },
  "network": {
    "custom_credentials": {
      "openai": {
        "upstream": "https://api.openai.com/v1",
        "credential_key": "op://Development/OpenAI/credential",
        "env_var": "OPENAI_API_KEY",
        "inject_header": "Authorization",
        "credential_format": "Bearer {}"
      }
    },
    "credentials": ["openai"]
  }
}`;

const onePasswordCode = `# 1Password — URI format: op://<vault>/<item>/<field>
nono run --allow . \\
  --env-credential-map 'op://Development/OpenAI/credential' \\
  OPENAI_API_KEY -- my-agent

# Apple Passwords (macOS) — URI format: apple-password://<server>/<account>
nono run --allow . \\
  --env-credential-map \\
  'apple-password://github.com/alice@example.com' \\
  GITHUB_PASSWORD -- my-agent`;

const auditCode = `ALLOW REVERSE openai POST /v1/chat/completions -> 200
ALLOW REVERSE anthropic POST /v1/messages -> 200`;

export default function CredentialInjectionPage() {
  return (
    <InfraPageLayout
      title="Credential Injection"
      tagline="Proxy-Based Secret Management"
      description="The proxy acts as a reverse proxy for configured credential routes. The agent sends plain HTTP to localhost, and the proxy strips the service prefix, injects credentials as HTTP headers, forwards over TLS, and streams responses back. The agent never sees the API key."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Two approaches
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              <strong className="text-foreground">Proxy injection</strong>{" "}
              (recommended for API keys): the proxy automatically sets
              environment variables like{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                OPENAI_BASE_URL=http://127.0.0.1:PORT/openai
              </code>
              {" "}in the child environment. Even if the agent is compromised, it
              cannot extract credentials from its own environment or memory.
            </p>
            <p>
              <strong className="text-foreground">
                Environment variable injection
              </strong>{" "}
              (simpler but less secure): nono loads secrets from the keystore
              before the sandbox is applied, injects them as environment
              variables, then zeroises them from memory after the call to exec().
              The sandbox blocks keystore access so the child cannot read
              additional secrets.
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
          <KeyRound
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Built-in Credential Routes
          </h3>
          <div className="text-sm text-muted leading-relaxed">
            <table className="w-full mt-2">
              <thead>
                <tr>
                  <th className="text-left pr-4">Service</th>
                  <th className="text-left pr-4">Header</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                <tr>
                  <td className="pr-4 py-1">openai</td>
                  <td className="pr-4 py-1">
                    Authorization: Bearer &#123;&#125;
                  </td>
                </tr>
                <tr>
                  <td className="pr-4 py-1">anthropic</td>
                  <td className="pr-4 py-1">x-api-key: &#123;&#125;</td>
                </tr>
                <tr>
                  <td className="pr-4 py-1">gemini</td>
                  <td className="pr-4 py-1">x-goog-api-key: &#123;&#125;</td>
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
            Security Properties
          </h3>
          <ul className="text-sm text-muted leading-relaxed space-y-1.5">
            <li>Credentials never enter the sandbox</li>
            <li>Session token isolation via X-Nono-Token header</li>
            <li>Keystore-backed storage (Keychain/Secret Service)</li>
            <li>Credential values stored in zeroising memory</li>
            <li>Proxy strips existing auth headers before injection</li>
            <li>Invalid tokens receive 407 Proxy Authentication Required</li>
          </ul>
        </GlassCard>

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Credential storage
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              nono reads credentials from your platform keystore. On macOS, use
              the Keychain. On Linux, use the Secret Service API (gnome-keyring
              or similar). The{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                target default
              </code>
              {" "}attribute is required on Linux for the keyring crate to find
              the entry.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={keychainCode}
          language="bash"
          filename="macOS Keychain"
        />

        <InfraCodeBlock
          code={linuxCode}
          language="bash"
          filename="Linux Secret Service"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            1Password and Apple Passwords
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              nono integrates with 1Password via{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                op://
              </code>
              {" "}URIs and Apple Passwords (macOS) via{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                apple-password://
              </code>
              {" "}URIs. Both work with proxy injection and environment variable
              injection.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={onePasswordCode}
          language="bash"
          filename="terminal"
          className="md:col-span-2"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Custom credential routes
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Define custom credential routes for any API. Four injection modes
              are supported:{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                header
              </code>
              {" "}(default),{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                url_path
              </code>
              ,{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                query_param
              </code>
              , and{" "}
              <code className="px-1.5 py-0.5 bg-code-bg border border-code-border font-mono text-xs text-code-text">
                basic_auth
              </code>
              . Use underscores, not hyphens, in credential names as they are
              used to generate environment variables.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={customCredentialCode}
          language="json"
          filename="profiles/custom-credentials.json"
        />

        <InfraCodeBlock
          code={proxyProfileCode}
          language="json"
          filename="profiles/1password-proxy.json"
        />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Profile-based configuration
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Both proxy and environment variable credentials can be configured
              in profiles. You can mix both approaches in a single profile
              &mdash; use proxy injection for LLM API keys and environment
              variable injection for things like database passwords.
            </p>
          </div>
        </GlassCard>

        <InfraCodeBlock
          code={envProfileCode}
          language="json"
          filename="profiles/env-credentials.json"
        />

        <InfraCodeBlock
          code={mixedCode}
          language="json"
          filename="profiles/mixed-mode.json"
        />

        <GlassCard className="md:col-span-2 p-8">
          <div className="flex items-start gap-4">
            <Plug
              size={24}
              className="text-accent shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                Audit logging
              </h3>
              <div className="text-sm text-muted leading-relaxed space-y-2">
                <p>
                  Reverse proxy requests are logged with the service name and
                  status code, but credential values are never logged:
                </p>
                <InfraCodeBlock
                  code={auditCode}
                  language="text"
                  filename="audit log"
                />
                <p className="pt-2">
                  See the{" "}
                  <a
                    href={`${DOCS_URL}/cli/features/credential-injection`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    credential injection docs
                  </a>
                  {" "}for full details including headless Linux setups and WSL2
                  limitations.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </InfraPageLayout>
  );
}
