const snippets = [
  {
    lang: "Python",
    code: `import nono_py as nono

caps = nono.CapabilitySet()
caps.allow_path("/project", nono.AccessMode.READ_WRITE)
caps.block_network()

nono.apply(caps)`,
  },
  {
    lang: "TypeScript",
    code: `import { CapabilitySet, AccessMode, apply } from 'nono-ts';

const caps = new CapabilitySet();
caps.allowPath('/project', AccessMode.ReadWrite);
caps.blockNetwork();

apply(caps);`,
  },
  {
    lang: "Rust",
    code: `use nono::{CapabilitySet, AccessMode, Sandbox};

let caps = CapabilitySet::new()
    .allow_path("/project", AccessMode::ReadWrite)?
    .block_network();

Sandbox::apply(&caps)?;`,
  },
];

export default function SdkPreview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          Embed in your agent
        </h2>
        <p className="text-muted text-center max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          nono is a library, not just a CLI. Drop kernel-enforced sandboxing
          into your agent code in three lines.
        </p>
        <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mt-3 mb-16">
          Coming soon
        </span>

        <div className="grid md:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <div
              key={snippet.lang}
              className="bg-code-bg rounded-xl overflow-hidden border border-border"
            >
              <div className="px-4 py-2.5 border-b border-gray-700">
                <span className="text-xs font-medium text-muted">
                  {snippet.lang}
                </span>
              </div>
              <pre className="p-4 text-code-text font-mono text-xs leading-relaxed overflow-x-auto">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
