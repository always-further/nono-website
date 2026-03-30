"use client";

import { Lock, Shield, X, Check } from "lucide-react";

/**
 * Visual diagram showing how kernel-level enforcement differs from
 * application-level sandboxing. Used on linux-sandbox, python-sandbox,
 * and node-sandbox pages.
 */
export function KernelEnforcementDiagram() {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-6 md:p-8">
      <h3 className="text-sm font-mono font-medium uppercase tracking-[0.15em] text-foreground/60 mb-8">
        Enforcement architecture
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Application-level (the bad way) */}
        <div>
          <div className="text-xs font-mono text-foreground/50 mb-5 flex items-center gap-2">
            <X size={14} className="text-red-400/70" strokeWidth={2.5} />
            Application-level sandbox
          </div>

          <div className="space-y-2">
            <DiagramBox label="AI Agent" sublabel="open(), exec(), connect()" variant="default" />
            <ConnectorArrow variant="dashed" />
            <DiagramBox
              label="Sandbox interceptor"
              sublabel="Userspace process — can be bypassed"
              variant="weak"
            />
            <ConnectorArrow variant="dashed" />
            <DiagramBox label="Kernel" sublabel="Grants full access — no restrictions" variant="default" />
            <ConnectorArrow />
            <DiagramBox label="Filesystem / Network" sublabel="Fully accessible" variant="muted" />
          </div>

          <p className="text-xs text-muted leading-relaxed mt-4">
            Interception runs in userspace. A bug, race condition, or
            unexpected code path can bypass it.
          </p>
        </div>

        {/* Kernel-level (nono) */}
        <div>
          <div className="text-xs font-mono text-foreground/50 mb-5 flex items-center gap-2">
            <Check size={14} className="text-emerald-400/70" strokeWidth={2.5} />
            Kernel-level enforcement (nono)
          </div>

          <div className="space-y-2">
            <DiagramBox label="AI Agent" sublabel="open(), exec(), connect()" variant="default" />
            <ConnectorArrow />
            <DiagramBox
              label="Kernel + Landlock / Seatbelt / WSL2"
              sublabel="Allow-list enforced at syscall boundary"
              variant="strong"
              icon={<Lock size={13} strokeWidth={2} />}
            />
            <ConnectorArrow variant="blocked" />
            <DiagramBox label="Filesystem / Network" sublabel="Only allowed paths reachable" variant="muted" />
          </div>

          <p className="text-xs text-muted leading-relaxed mt-4">
            No interception layer. The kernel enforces the allow-list
            directly. Irrevocable once applied.
          </p>
        </div>
      </div>
    </div>
  );
}

function DiagramBox({
  label,
  sublabel,
  variant,
  icon,
}: {
  label: string;
  sublabel: string;
  variant: "default" | "strong" | "weak" | "muted";
  icon?: React.ReactNode;
}) {
  const styles = {
    default: "bg-[rgba(255,255,255,0.07)] border-[rgba(255,255,255,0.12)]",
    strong: "bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.25)]",
    weak: "bg-[rgba(255,120,120,0.06)] border-[rgba(255,120,120,0.2)]",
    muted: "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 ${styles[variant]}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-foreground/60">{icon}</span>}
        <span className="text-sm font-semibold text-foreground/90">{label}</span>
      </div>
      {sublabel && (
        <span className="text-[11px] text-muted block mt-1 leading-relaxed">
          {sublabel}
        </span>
      )}
    </div>
  );
}

function ConnectorArrow({ variant }: { variant?: "dashed" | "blocked" }) {
  return (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div
          className={`w-px h-5 ${
            variant === "dashed"
              ? "border-l border-dashed border-[rgba(255,255,255,0.2)]"
              : variant === "blocked"
              ? "border-l-2 border-dashed border-[rgba(255,120,120,0.3)]"
              : "bg-[rgba(255,255,255,0.2)]"
          }`}
        />
        {variant === "blocked" ? (
          <Shield size={14} className="text-foreground/40" strokeWidth={2} />
        ) : (
          <svg width="8" height="6" viewBox="0 0 8 6" className="text-foreground/25">
            <path d="M4 6L0 0h8z" fill="currentColor" />
          </svg>
        )}
      </div>
    </div>
  );
}
