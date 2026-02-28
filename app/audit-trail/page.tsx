import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollText, ShieldCheck, FileJson } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cryptographic Audit Trail - Immutable Session Logs | nono",
  description:
    "Merkle tree commitments over every agent operation. Cryptographically verify that no file was altered outside the sandbox. Tamper-evident by construction.",
  alternates: { canonical: "/audit-trail" },
};

const relatedPages = [
  {
    href: "/provenance",
    label: "Provenance",
    description: "Sigstore supply chain signing",
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

const auditCode = `$ nono audit --session a1b2c3d4

SESSION: a1b2c3d4
STARTED: 2026-02-28T14:32:01Z
AGENT:   claude (pid 48291)
PROFILE: claude-code

OPERATIONS:
  14:32:03  FILE_READ    src/auth/middleware.ts
  14:32:04  FILE_READ    package.json
  14:32:05  FILE_WRITE   src/auth/middleware.ts
  14:32:06  FILE_WRITE   package.json
  14:32:07  NET_CONNECT  registry.npmjs.org:443  ALLOWED
  14:32:08  NET_CONNECT  evil.example.com:443    DENIED
  14:32:10  CMD_EXEC     npm install             ALLOWED
  14:32:15  CMD_EXEC     curl http://...         DENIED

MERKLE ROOT: 7d8f3e2a1b4c5d6e...
OPERATIONS:  8
VIOLATIONS:  2`;

const jsonCode = `$ nono audit --session a1b2c3d4 --format json | jq '.operations[]'

{
  "timestamp": "2026-02-28T14:32:08Z",
  "type": "NET_CONNECT",
  "target": "evil.example.com:443",
  "disposition": "DENIED",
  "rule": "network.allow whitelist",
  "hash": "a3f2e1d0..."
}`;

export default function AuditTrailPage() {
  return (
    <InfraPageLayout
      title="Cryptographic Audit Trail"
      tagline="Immutable Session Logs"
      description="Every filesystem operation, network connection, and command execution is recorded in a Merkle tree. Cryptographically verify session integrity after the fact."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Tamper-evident by construction
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              Every operation an AI agent performs inside nono is recorded as a
              leaf in a Merkle tree rooted in SHA-256 hashes. Each leaf contains
              the operation type, target, timestamp, and disposition
              (allowed/denied). The Merkle root is committed at session end,
              creating a cryptographic commitment over the entire session history.
            </p>
            <p>
              This means you can verify after the fact that the audit log has not
              been tampered with. If any operation is modified, added, or removed,
              the Merkle root changes and verification fails. This is the same
              construction used by Git, certificate transparency logs, and
              blockchain systems.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <ScrollText
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            What Gets Recorded
          </h3>
          <ul className="text-sm text-muted leading-relaxed space-y-1.5">
            <li>File reads, writes, creates, and deletes</li>
            <li>Network connection attempts (allowed and denied)</li>
            <li>Command executions (allowed and denied)</li>
            <li>Supervisor approval prompts and responses</li>
            <li>Sandbox policy violations</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <FileJson
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Filtering and Export
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Filter audit logs by date range, operation type, or disposition.
            Export to JSON for integration with SIEM systems, compliance tools,
            or custom dashboards. The structured format makes it easy to build
            automated alerting on violation patterns.
          </p>
        </GlassCard>

        <InfraCodeBlock code={auditCode} language="bash" filename="terminal" />
        <InfraCodeBlock
          code={jsonCode}
          language="bash"
          filename="JSON export"
        />

        <GlassCard className="md:col-span-2 p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck
              size={24}
              className="text-accent-teal shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                Verification guarantees
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                The Merkle root is computed from the ordered sequence of all
                operation hashes. Verification recomputes the root from the raw
                log and compares against the committed root. Any modification
                &mdash; even changing a single byte of a single operation &mdash;
                produces a different root and fails verification. The audit trail
                is append-only during a session and sealed with the Merkle
                commitment at session end.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </InfraPageLayout>
  );
}
