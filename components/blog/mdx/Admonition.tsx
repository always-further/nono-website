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
    border: string;
    iconColor: string;
    bg: string;
  }
> = {
  note: {
    icon: Info,
    label: "Note",
    border: "border-blue-800",
    iconColor: "text-blue-400",
    bg: "bg-blue-950/20",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    border: "border-yellow-800",
    iconColor: "text-yellow-400",
    bg: "bg-yellow-950/20",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    border: "border-green-800",
    iconColor: "text-green-400",
    bg: "bg-green-950/20",
  },
  danger: {
    icon: AlertOctagon,
    label: "Danger",
    border: "border-accent",
    iconColor: "text-accent",
    bg: "bg-red-950/20",
  },
};

export function Admonition({ type, title, children }: AdmonitionProps) {
  const {
    icon: Icon,
    label,
    border,
    iconColor,
    bg,
  } = config[type];

  return (
    <div className={`my-6 rounded-xl border ${border} ${bg} p-5`}>
      <div
        className={`flex items-center gap-2 mb-2 font-semibold text-sm ${iconColor}`}
      >
        <Icon size={16} strokeWidth={2} />
        <span>{title ?? label}</span>
      </div>
      <div className="text-sm text-muted leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}
