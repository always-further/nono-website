import { ShieldOff, Bot, Cpu, Monitor } from "lucide-react";

const features = [
  {
    icon: ShieldOff,
    title: "No Escape Hatch",
    description:
      "Once inside nono, there is no mechanism to bypass restrictions. The agent cannot request more permissions because the mechanism doesn't exist.",
  },
  {
    icon: Bot,
    title: "Agent Agnostic",
    description:
      "Works with Claude, GPT, opencode, openclaw, or any AI agent. Actually, it works with any process you want to sandbox.",
  },
  {
    icon: Cpu,
    title: "OS-Level Enforcement",
    description:
      "Kernel denies unauthorized operations directly. No interception, no filtering - operations are structurally impossible.",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    description:
      "Linux support via Landlock and macOS support via Seatbelt. Native OS security primitives for maximum reliability.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Security without compromise
        </h2>
        <p className="text-muted text-center mb-16 max-w-2xl mx-auto">
          Unlike policy-based sandboxes that intercept and filter operations,
          NONO leverages OS security primitives to create an environment where
          unauthorized operations are structurally impossible.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 p-8 rounded-xl border border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all"
            >
              <feature.icon className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
