import { Apple, Monitor } from "lucide-react";

const platforms = [
  {
    icon: Apple,
    name: "macOS",
    mechanism: "Seatbelt",
    status: "Supported",
    statusColor: "text-green-600",
  },
  {
    icon: Monitor,
    name: "Linux",
    mechanism: "Landlock",
    status: "Supported",
    statusColor: "text-green-600",
  },
];

export default function Platforms() {
  return (
    <section className="py-24 px-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Platform support
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          nono uses native OS security primitives for maximum reliability and
          performance.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center gap-4 p-6 bg-gray-900 border border-border rounded-xl hover:border-accent/50 transition-all"
            >
              <platform.icon className="w-12 h-12 text-muted" />
              <div>
                <h3 className="font-semibold text-lg">{platform.name}</h3>
                <p className="text-muted text-sm">via {platform.mechanism}</p>
                <p className={`text-sm font-medium ${platform.statusColor}`}>
                  {platform.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-muted text-center mt-8 text-sm">
          Windows support is planned for a future release.
        </p>
      </div>
    </section>
  );
}
