import { FileText, Lock, Eye } from "lucide-react";

const steps = [
  {
    icon: FileText,
    label: "Define",
    title: "Policy",
    description:
      "JSON profiles declare filesystem paths, network hosts, and denied commands. Groups compose into profiles that match your agent's runtime.",
  },
  {
    icon: Lock,
    label: "Enforce",
    title: "Kernel Sandbox",
    description:
      "Landlock on Linux and Seatbelt on macOS create an irrevocable allow-list. No API can widen permissions after the sandbox is applied.",
  },
  {
    icon: Eye,
    label: "Supervise",
    title: "Runtime Proxy",
    description:
      "An unsandboxed supervisor handles approval prompts, credential injection, and network filtering. The agent only reaches localhost.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          How nono works
        </h2>
        <p className="text-muted text-center mb-16 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Three layers between your agent and the operating system.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.label} className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-muted" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-muted">
                  {index + 1}. {step.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
