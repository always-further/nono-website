import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedPage {
  href: string;
  label: string;
  description: string;
}

interface RelatedInfraPagesProps {
  pages: RelatedPage[];
}

export function RelatedInfraPages({ pages }: RelatedInfraPagesProps) {
  return (
    <div>
      <h2 className="text-sm font-mono uppercase tracking-[0.15em] text-foreground mb-6">
        Related Infrastructure
      </h2>
      <div className="border border-border divide-y divide-border">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="flex items-center justify-between px-6 py-4 hover:bg-surface transition-colors group"
          >
            <div>
              <h3 className="text-sm font-mono font-medium text-foreground">{page.label}</h3>
              <p className="text-xs text-muted mt-0.5">{page.description}</p>
            </div>
            <ArrowRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
