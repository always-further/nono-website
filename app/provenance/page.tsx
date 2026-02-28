import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Fingerprint, ShieldAlert, Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supply Chain Provenance - Sigstore Signing for AI Agents | nono",
  description:
    "Sigstore-based signing and verification of AI agent instruction files. Unsigned instruction files are blocked at the kernel level.",
  alternates: { canonical: "/provenance" },
};

const relatedPages = [
  {
    href: "/audit-trail",
    label: "Audit Trail",
    description: "Cryptographic session logging",
  },
  {
    href: "/linux-sandbox",
    label: "Linux Sandbox",
    description: "Kernel-level filesystem isolation",
  },
];

const signCode = `# Sign instruction files with Sigstore
$ nono sign CLAUDE.md AGENT.md

Signing CLAUDE.md...
  Identity: luke@alwaysfurther.ai (OIDC)
  Signed with Fulcio ephemeral certificate
  Uploaded to Rekor transparency log
  Entry: rekor.sigstore.dev/api/v1/log/entries/...

Signing AGENT.md...
  Identity: luke@alwaysfurther.ai (OIDC)
  Signed with Fulcio ephemeral certificate
  Uploaded to Rekor transparency log

2 files signed successfully.`;

const verifyCode = `# nono automatically verifies at runtime
$ nono run --profile claude-code -- claude

Verifying instruction files...
  CLAUDE.md: VERIFIED (luke@alwaysfurther.ai)
  AGENT.md:  VERIFIED (luke@alwaysfurther.ai)
  SKILLS.md: UNSIGNED - BLOCKED

Error: SKILLS.md is not signed by a trusted identity.
  Expected signers: luke@alwaysfurther.ai
  Run 'nono sign SKILLS.md' to sign, or add
  --trust-unsigned to bypass (not recommended).`;

export default function ProvenancePage() {
  return (
    <InfraPageLayout
      title="Supply Chain Provenance"
      tagline="Sigstore Integration"
      description="Sigstore-based signing and verification of AI agent instruction files. Verify that CLAUDE.md, AGENT.md, and SKILLS.md files were authored by trusted identities before agents execute them."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            The problem: unsigned instructions
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              AI coding agents follow instructions from files like CLAUDE.md,
              AGENT.md, and SKILLS.md. These files define the agent&apos;s behavior
              &mdash; what it can do, how it should approach problems, and what
              tools it has access to. But there is no standard mechanism to verify
              who authored these files or whether they have been tampered with.
            </p>
            <p>
              A compromised instruction file is a prompt injection vector. An
              attacker who can modify CLAUDE.md in a repository can instruct the
              agent to exfiltrate secrets, install backdoors, or modify code in
              subtle ways. Without provenance verification, there is no way to
              distinguish legitimate instructions from injected ones.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Fingerprint
            size={20}
            className="text-accent mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Sigstore Signing
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            nono uses Sigstore&apos;s keyless signing workflow. Authors authenticate
            via OIDC (GitHub, Google, or Microsoft identity), receive an
            ephemeral Fulcio certificate, and sign instruction files. The
            signature and certificate are recorded in the Rekor transparency log,
            creating a permanent, publicly auditable record.
          </p>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <Eye
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Rekor Transparency Log
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Every signature is recorded in the Rekor transparency log, an
            append-only, publicly auditable ledger. This means you can verify not
            just that a file was signed, but exactly when it was signed and by
            whom. Signed entries cannot be removed or altered after publication.
          </p>
        </GlassCard>

        <InfraCodeBlock code={signCode} language="bash" filename="terminal" />
        <InfraCodeBlock
          code={verifyCode}
          language="bash"
          filename="runtime verification"
        />

        <GlassCard className="md:col-span-2 p-8">
          <div className="flex items-start gap-4">
            <ShieldAlert
              size={24}
              className="text-accent shrink-0 mt-1"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                Trust policy
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                nono&apos;s trust policy defines which OIDC identities are authorized
                to sign instruction files. This is configured per-profile and
                supports exact email matches, domain wildcards, and GitHub
                organization constraints. Unsigned files or files signed by
                untrusted identities are blocked before the agent process starts.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </InfraPageLayout>
  );
}
