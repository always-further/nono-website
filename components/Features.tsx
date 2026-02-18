import { Users, KeyRound, Undo2, ScrollText } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Profiles and Groups",
    description:
      "Composable JSON profiles define exactly what an agent can access. 22 built-in groups cover runtimes, credential deny-lists, and dangerous commands.",
  },
  {
    icon: KeyRound,
    title: "Secrets Injection",
    description:
      "Secrets load from the system keystore before sandboxing, then get injected as environment variables. Direct keystore access is blocked. Zeroised on exit.",
  },
  {
    icon: Undo2,
    title: "Atomic Rollbacks",
    description:
      "SHA-256 content-addressed snapshots capture filesystem state before and after execution. Restore any session with a single command.",
  },
  {
    icon: ScrollText,
    title: "Provenance and Audit",
    description:
      "Every operation is recorded with a Merkle tree rooted in SHA-256 hashes. Cryptographically verify that no file was altered outside the sandbox.",
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
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                {feature.title}
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
