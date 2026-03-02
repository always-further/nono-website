import { InfraPageLayout } from "@/components/infrastructure/InfraPageLayout";
import { InfraCodeBlock } from "@/components/infrastructure/InfraCodeBlock";
import { GlassCard } from "@/components/ui/GlassCard";
import { Undo2, Database, GitCompare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Undo & Rollback - Atomic Filesystem Snapshots | nono",
  description:
    "SHA-256 content-addressed snapshots capture filesystem state before and after AI agent execution. Restore any session with a single command.",
  alternates: { canonical: "/undo" },
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
  {
    href: "/guides/undo-for-ai-agents",
    label: "Guide: Undo for AI Agents",
    description: "Practical workflows for agent rollbacks",
  },
];

const snapshotCode = `$ nono run --rollback --allow ~/projects/myapp -- claude

# Agent makes changes...
# nono captures before/after snapshots automatically

$ nono rollback list
SESSION ID                  COMMAND   FILES CHANGED
20260228-143201-48291       claude    12
20260228-101544-31072       claude    3

$ nono rollback restore 20260228-143201-48291
Restored 12 files to pre-session state.`;

const diffCode = `$ nono rollback show 20260228-143201-48291 --diff

--- a/src/auth/middleware.ts
+++ b/src/auth/middleware.ts
@@ -12,6 +12,18 @@
+export async function validateToken(token: string) {
+  // Agent-generated code
+  const decoded = jwt.verify(token, process.env.JWT_SECRET);
+  return decoded;
+}

--- a/package.json
+++ b/package.json
@@ -8,6 +8,7 @@
+    "jsonwebtoken": "^9.0.0",`;

export default function UndoPage() {
  return (
    <InfraPageLayout
      title="Atomic Filesystem Snapshots"
      tagline="Undo & Rollback"
      description="SHA-256 content-addressed snapshots capture filesystem state before and after every agent session. Restore any session with a single command."
      relatedPages={relatedPages}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Every change is reversible
          </h2>
          <div className="text-muted leading-relaxed space-y-4">
            <p>
              AI agents modify files at scale. A single coding session can touch
              dozens of files across your project. When something goes wrong &mdash;
              a broken refactor, an incorrect dependency change, or unwanted
              modifications to configuration files &mdash; you need a reliable way
              to undo everything.
            </p>
            <p>
              nono captures a content-addressed snapshot of every file in the
              sandbox scope before the agent starts. Each file is hashed with
              SHA-256 and stored in a deduplicating content store. After the
              session ends, a second snapshot records the final state. The diff
              between snapshots tells you exactly what changed, and{" "}
              <code className="px-1.5 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
                nono rollback restore
              </code>{" "}
              restores the original state atomically.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="purple" hoverable>
          <Database size={20} className="text-accent mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Content-Addressed Storage
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Files are stored by their SHA-256 hash, not by path. Identical files
            across sessions share storage. The snapshot database grows only by
            the size of unique content, making frequent snapshots practical even
            for large projects.
          </p>
        </GlassCard>

        <GlassCard className="p-6" glowColor="blue" hoverable>
          <GitCompare
            size={20}
            className="text-accent-blue mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold mb-2 tracking-tight">
            Session Diffs
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Review exactly what an agent changed before deciding to keep or
            revert. The diff output shows file-level and line-level changes,
            including new files, modified files, and deleted files. Pipe to{" "}
            <code className="px-1 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
              jq
            </code>{" "}
            or{" "}
            <code className="px-1 py-0.5 rounded bg-code-bg border border-border font-mono text-xs">
              diff
            </code>{" "}
            for integration with existing workflows.
          </p>
        </GlassCard>

        <InfraCodeBlock
          code={snapshotCode}
          language="bash"
          filename="terminal"
        />
        <InfraCodeBlock code={diffCode} language="diff" filename="nono diff" />

        <GlassCard className="md:col-span-2 p-8">
          <h2 className="text-xl font-bold tracking-tight mb-4">
            Use Cases
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Undo2,
                title: "Agent Recovery",
                desc: "Undo a broken refactor or incorrect dependency changes. One command restores the entire project to its pre-session state.",
              },
              {
                icon: Undo2,
                title: "Experiment Safely",
                desc: "Let agents attempt ambitious changes knowing you can always roll back. Run multiple experimental sessions and keep only the best result.",
              },
              {
                icon: Undo2,
                title: "CI Integration",
                desc: "Capture snapshots in CI pipelines. If agent-generated changes fail tests, automatically revert and report the failure with full diff context.",
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
