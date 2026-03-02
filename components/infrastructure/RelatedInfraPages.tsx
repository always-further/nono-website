import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

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
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        Related Infrastructure
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pages.map((page) => (
          <Link key={page.href} href={page.href}>
            <GlassCard hoverable className="p-6 h-full">
              <h3 className="font-semibold mb-1">{page.label}</h3>
              <p className="text-sm text-muted mb-3">{page.description}</p>
              <span className="text-xs text-accent flex items-center gap-1">
                Learn more <ArrowRight size={12} />
              </span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
