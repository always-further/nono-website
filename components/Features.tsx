import { ShieldBan, Code, Cpu, KeyRound } from "lucide-react";

const features = [
  {
    icon: ShieldBan,
    title: "Destruction-proof",
    description:
      "Destructive commands are blocked. No more accidental rm -rf ~/, no more reboot trolling. No more rogue agents wreaking havoc on your system.",
  },
  {
    icon: Code,
    title: "Native SDKs",
    badge: "Coming soon",
    description:
      "A Rust library at its core, with native SDKs for Python, TypeScript, and any language with C FFI. Embed sandboxing directly in your agent code.",
  },
  {
    icon: Cpu,
    title: "OS-Level Enforcement",
    description:
      "Kernel denies unauthorized operations directly. No interception, no filtering - operations are structurally impossible.",
  },
  {
    icon: KeyRound,
    title: "Keys and credentials protected",
    description:
      "Keys and secrets stored within hardware-backed keychains remain protected and zeroised on termination.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          Security without compromise
        </h2>
        <p className="text-muted text-center mb-16 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Unlike policy-based sandboxes that intercept and filter operations,
          nono leverages OS security primitives to create an environment where
          unauthorized operations are structurally impossible.
        </p>

        <div className="grid md:grid-cols-2 border border-border rounded-xl overflow-hidden">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`p-8 md:p-10 hover:bg-white/[0.02] transition-colors ${
                index < 2 ? "border-b border-border" : ""
              } ${index % 2 === 0 ? "md:border-r md:border-border" : ""}`}
            >
              <feature.icon
                className="w-5 h-5 text-muted mb-5"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold mb-2 tracking-tight flex items-center gap-2">
                {feature.title}
                {"badge" in feature && feature.badge && (
                  <span className="text-[0.65rem] font-medium uppercase tracking-widest text-accent">
                    {feature.badge}
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
