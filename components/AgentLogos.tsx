import Image from "next/image";
import TerminalDemo from "./TerminalDemo";

const agents = [
  { name: "Claude Code", logo: "/claude.svg", width: 120, height: 40 },
  { name: "Codex", logo: "/openai.svg", width: 100, height: 40 },
  { name: "Gemini", logo: "/gemini.png", width: 100, height: 40 },
  { name: "OpenClaw", logo: "/openclaw.png", width: 100, height: 40 },
  { name: "OpenCode", logo: "/opencode.svg", width: 120, height: 40 },
];

export default function AgentLogos() {
  return (
    <section className="py-24 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Use anywhere.
        </h2>

        <TerminalDemo />

        <div className="flex flex-wrap justify-center gap-6 mt-16">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="inline-flex items-center gap-4 px-8 py-5 bg-gray-900 border border-border rounded-full hover:border-accent/50 transition-all group"
            >
              <Image
                src={agent.logo}
                alt={agent.name}
                width={agent.width}
                height={agent.height}
                className="h-7 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-lg font-medium text-muted group-hover:text-white transition-colors">
                {agent.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
