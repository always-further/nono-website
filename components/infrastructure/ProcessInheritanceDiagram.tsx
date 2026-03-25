"use client";

import { Lock, GitFork } from "lucide-react";

/**
 * Visual diagram showing how sandbox restrictions inherit across the
 * process tree. Used on python-sandbox and node-sandbox pages.
 */
export function ProcessInheritanceDiagram({
  runtime,
}: {
  runtime: "python" | "node";
}) {
  const labels =
    runtime === "python"
      ? {
          parent: "nono run -- python agent.py",
          child: "python agent.py",
          childSub: "Sandboxed Python interpreter",
          grandchild1: "subprocess.run([\"bash\", ...])",
          grandchild1Sub: "Inherits all restrictions",
          grandchild2: "pip install ...",
          grandchild2Sub: "Inherits all restrictions",
          note: "ctypes, C extensions, os.system — all restricted by the same kernel rules. No escape through any code path.",
        }
      : {
          parent: "nono run -- node agent.js",
          child: "node agent.js",
          childSub: "Sandboxed Node.js process",
          grandchild1: "child_process.exec(\"bash ...\")",
          grandchild1Sub: "Inherits all restrictions",
          grandchild2: "npm install (postinstall scripts)",
          grandchild2Sub: "Inherits all restrictions",
          note: "N-API addons, worker threads, spawned binaries — all restricted by the same kernel rules. No escape through any code path.",
        };

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-6 md:p-8">
      <h3 className="text-sm font-mono font-medium uppercase tracking-[0.15em] text-foreground/60 mb-8">
        Sandbox inheritance
      </h3>

      <div className="max-w-lg mx-auto space-y-2">
        {/* nono parent */}
        <ProcessBox
          icon={<Lock size={13} strokeWidth={2} />}
          label={labels.parent}
          sublabel="Applies Landlock / Seatbelt, then execs child"
          depth={0}
        />

        <VerticalConnector />

        {/* Agent process */}
        <ProcessBox
          icon={<Lock size={13} strokeWidth={2} />}
          label={labels.child}
          sublabel={labels.childSub}
          depth={1}
        />

        {/* Fork into two children */}
        <div className="pl-10">
          <div className="flex items-stretch gap-4 ml-4">
            {/* Left branch line */}
            <div className="flex flex-col items-center pt-1">
              <div className="w-px flex-1 bg-[rgba(255,255,255,0.15)]" />
            </div>

            <div className="flex-1 space-y-2 py-2">
              <ProcessBox
                icon={<GitFork size={13} strokeWidth={2} />}
                label={labels.grandchild1}
                sublabel={labels.grandchild1Sub}
                depth={2}
              />
              <ProcessBox
                icon={<GitFork size={13} strokeWidth={2} />}
                label={labels.grandchild2}
                sublabel={labels.grandchild2Sub}
                depth={2}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)]">
        <p className="text-xs text-muted leading-relaxed">
          {labels.note}
        </p>
      </div>
    </div>
  );
}

function ProcessBox({
  icon,
  label,
  sublabel,
  depth,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  depth: number;
}) {
  const indent = depth > 0 ? "ml-10" : "";
  const bg =
    depth === 0
      ? "bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.2)]"
      : depth === 1
      ? "bg-[rgba(255,255,255,0.07)] border-[rgba(255,255,255,0.15)]"
      : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.12)]";

  return (
    <div className={`rounded-lg border px-4 py-3 ${bg} ${indent}`}>
      <div className="flex items-center gap-2">
        <span className="text-foreground/50 shrink-0">{icon}</span>
        <span className="text-[11px] font-mono text-foreground/80 truncate">
          {label}
        </span>
      </div>
      <span className="text-[11px] text-muted block mt-1 pl-[22px]">
        {sublabel}
      </span>
    </div>
  );
}

function VerticalConnector() {
  return (
    <div className="pl-14 py-0.5">
      <div className="flex flex-col items-center">
        <div className="w-px h-5 bg-[rgba(255,255,255,0.2)]" />
        <svg width="8" height="6" viewBox="0 0 8 6" className="text-foreground/25">
          <path d="M4 6L0 0h8z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
