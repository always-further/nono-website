"use client";

import { Highlight, themes } from "prism-react-renderer";

function PythonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 255" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="py-a" x1="12.959%" x2="79.639%" y1="12.039%" y2="78.201%">
          <stop offset="0%" stopColor="#387EB8" />
          <stop offset="100%" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="py-b" x1="19.128%" x2="90.742%" y1="20.579%" y2="88.429%">
          <stop offset="0%" stopColor="#FFE052" />
          <stop offset="100%" stopColor="#FFC331" />
        </linearGradient>
      </defs>
      <path fill="url(#py-a)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" />
      <path fill="url(#py-b)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" />
    </svg>
  );
}

function TypeScriptLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="20" fill="#3178C6" />
      <path fill="#fff" d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.796 10.669-11.672 2.62-4.876 3.931-10.94 3.931-18.191 0-5.237-0.81-9.882-2.428-13.935-1.619-4.054-3.931-7.695-6.938-10.924-3.007-3.229-6.622-6.17-10.845-8.823-4.224-2.653-8.943-5.179-14.157-7.578-3.833-1.784-7.225-3.483-10.176-5.096-2.951-1.613-5.441-3.254-7.471-4.921-2.03-1.668-3.572-3.464-4.626-5.389-1.054-1.925-1.581-4.107-1.581-6.546 0-2.266.469-4.303 1.406-6.112.938-1.809 2.285-3.368 4.042-4.677 1.757-1.309 3.892-2.324 6.405-3.046 2.513-.721 5.353-1.082 8.52-1.082 2.221 0 4.576.173 7.064.519 2.488.346 5.003.895 7.543 1.647 2.54.752 4.984 1.726 7.331 2.922 2.347 1.196 4.49 2.633 6.427 4.312v-25.75c-4.14-1.668-8.694-2.904-13.664-3.708-4.97-.804-10.611-1.206-16.921-1.206-6.535 0-12.737.69-18.606 2.072-5.869 1.382-11.051 3.578-15.546 6.588-4.496 3.01-8.058 6.912-10.688 11.708-2.63 4.796-3.945 10.572-3.945 17.326 0 8.604 2.528 15.903 7.585 21.898 5.057 5.994 12.642 11.073 22.756 15.237 3.921 1.612 7.571 3.195 10.952 4.749 3.38 1.554 6.311 3.195 8.793 4.921 2.481 1.726 4.43 3.618 5.846 5.677 1.417 2.059 2.125 4.406 2.125 7.04 0 2.093-.475 3.979-1.424 5.657-.949 1.679-2.325 3.119-4.128 4.321-1.803 1.202-4.012 2.126-6.626 2.774-2.614.648-5.565.972-8.852.972-5.796 0-11.453-1.088-16.971-3.263-5.518-2.176-10.474-5.439-14.868-9.789zM113.009 128.349H143.2V107.6H54.537v20.749h30.106v83.652h28.366V128.349z" />
    </svg>
  );
}

function RustLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 144 144" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="m71.05 23.68c-26.06 0-47.27 21.22-47.27 47.27s21.22 47.27 47.27 47.27 47.27-21.22 47.27-47.27-21.22-47.27-47.27-47.27zm-.07 4.2a3.1 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm7.12 5.12a38.27 38.27 0 0 1 26.2 18.66l-3.67 8.28c-.63 1.43.02 3.11 1.44 3.75l7.06 3.13a38.27 38.27 0 0 1 .08 6.64h-3.93c-.39 0-.55.26-.55.64v1.8c0 4.24-2.39 5.17-4.49 5.4-2 .23-4.21-.84-4.49-2.06-1.18-6.63-3.14-8.04-6.24-10.49 3.85-2.44 7.85-6.05 7.85-10.87 0-5.21-3.57-8.49-6-10.1-3.42-2.25-7.2-2.7-8.22-2.7h-40.6a38.27 38.27 0 0 1 21.41-12.08l4.79 5.02c1.08 1.13 2.87 1.18 4 .09zm-44.2 23.02a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm74.15.14a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm-68.29.5h5.42v24.44h-10.94a38.27 38.27 0 0 1 -1.24-14.61l6.7-2.98c1.43-.64 2.08-2.31 1.44-3.74zm22.62.26h12.91c.67 0 4.71.77 4.71 3.8 0 2.51-3.1 3.41-5.65 3.41h-11.98zm0 17.56h9.89c.9 0 4.83.26 6.08 5.28.39 1.54 1.26 6.56 1.85 8.17.59 1.8 2.98 5.4 5.53 5.4h16.14a38.27 38.27 0 0 1 -3.54 4.1l-6.57-1.41c-1.53-.33-3.04.65-3.37 2.18l-1.56 7.28a38.27 38.27 0 0 1 -31.91-.15l-1.56-7.28c-.33-1.53-1.83-2.51-3.36-2.18l-6.43 1.38a38.27 38.27 0 0 1 -3.32-3.92h31.27c.35 0 .59-.06.59-.39v-11.06c0-.32-.24-.39-.59-.39h-9.15zm-14.43 25.33a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm46.05.14a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11z"/>
      <path fill="#fff" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m115.68 70.95a44.63 44.63 0 0 1 -44.63 44.63 44.63 44.63 0 0 1 -44.63-44.63 44.63 44.63 0 0 1 44.63-44.63 44.63 44.63 0 0 1 44.63 44.63zm-.84-4.31 6.96 4.31-6.96 4.31 5.98 5.59-7.66 2.87 4.78 6.65-8.09 1.32 3.4 7.46-8.19-.29 1.88 7.98-7.98-1.88.29 8.19-7.46-3.4-1.32 8.09-6.65-4.78-2.87 7.66-5.59-5.98-4.31 6.96-4.31-6.96-5.59 5.98-2.87-7.66-6.65 4.78-1.32-8.09-7.46 3.4.29-8.19-7.98 1.88 1.88-7.98-8.19.29 3.4-7.46-8.09-1.32 4.78-6.65-7.66-2.87 5.98-5.59-6.96-4.31 6.96-4.31-5.98-5.59 7.66-2.87-4.78-6.65 8.09-1.32-3.4-7.46 8.19.29-1.88-7.98 7.98 1.88-.29-8.19 7.46 3.4 1.32-8.09 6.65 4.78 2.87-7.66 5.59 5.98 4.31-6.96 4.31 6.96 5.59-5.98 2.87 7.66 6.65-4.78 1.32 8.09 7.46-3.4-.29 8.19 7.98-1.88-1.88 7.98 8.19-.29-3.4 7.46 8.09 1.32-4.78 6.65 7.66 2.87z"/>
    </svg>
  );
}

const snippets = [
  {
    lang: "python" as const,
    label: "Python",
    icon: PythonLogo,
    code: `import nono_py as nono

caps = nono.CapabilitySet()
caps.allow_path("/project", nono.AccessMode.READ_WRITE)
caps.block_network()

nono.apply(caps)`,
  },
  {
    lang: "typescript" as const,
    label: "TypeScript",
    icon: TypeScriptLogo,
    code: `import { CapabilitySet, AccessMode, apply } from 'nono-ts';

const caps = new CapabilitySet();
caps.allowPath('/project', AccessMode.ReadWrite);
caps.blockNetwork();

apply(caps);`,
  },
  {
    lang: "rust" as const,
    label: "Rust",
    icon: RustLogo,
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
              key={snippet.label}
              className="bg-code-bg rounded-xl overflow-hidden border border-border"
            >
              <div className="px-4 py-2.5 border-b border-gray-700 flex items-center gap-2">
                <snippet.icon className="w-4 h-4" />
                <span className="text-xs font-medium text-muted">
                  {snippet.label}
                </span>
              </div>
              <Highlight
                theme={themes.nightOwl}
                code={snippet.code}
                language={snippet.lang}
              >
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className="p-4 font-mono text-xs leading-relaxed overflow-x-auto"
                    style={{ background: "transparent" }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
