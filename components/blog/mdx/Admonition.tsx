import { Info, AlertTriangle, Lightbulb, AlertOctagon } from "lucide-react";
import type { ReactNode } from "react";

type AdmonitionType = "note" | "warning" | "tip" | "danger";

interface AdmonitionProps {
  type: AdmonitionType;
  title?: string;
  children: ReactNode;
}

const config: Record<
  AdmonitionType,
  {
    icon: typeof Info;
    label: string;
  }
> = {
  note: { icon: Info, label: "Note" },
  warning: { icon: AlertTriangle, label: "Warning" },
  tip: { icon: Lightbulb, label: "Tip" },
  danger: { icon: AlertOctagon, label: "Danger" },
};

export function Admonition({ type, title, children }: AdmonitionProps) {
  const { icon: Icon, label } = config[type];

  return (
    <div className="my-6 border border-border p-5">
      <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider text-foreground">
        <Icon size={14} strokeWidth={1.5} />
        <span>{title ?? label}</span>
      </div>
      <div className="text-sm text-muted leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}
