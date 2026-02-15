export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          How it works
        </h2>
        <p className="text-muted text-center mb-16 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Grant explicit capabilities. The OS enforces them at the kernel level.
          Restrictions are irreversible for the sandboxed process.
        </p>

        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-mono text-muted">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Define capabilities</h3>
              <div className="bg-code-bg rounded-lg p-4 font-mono text-sm">
                <span className="text-green-400">$</span>
                <span className="text-code-text ml-2">
                  nono --profile bespoke --allow ./project agent
                </span>
              </div>
              <p className="text-sm text-muted mt-3 leading-relaxed">
                Specify which paths and network hosts the process can access.
                Everything else is denied by default.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-mono text-muted">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Kernel locks down</h3>
              <div className="bg-code-bg rounded-lg p-4 font-mono text-sm text-green-400">
                Sandbox active. Restrictions are now in effect.
              </div>
              <p className="text-sm text-muted mt-3 leading-relaxed">
                OS security primitives (Landlock on Linux, Seatbelt on macOS)
                enforce restrictions at the kernel level.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-mono text-muted">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">
                Unauthorized access blocked
              </h3>
              <div className="bg-code-bg rounded-lg p-4 font-mono text-sm text-red-400">
                cat: .ssh/id_rsa: Operation not permitted
              </div>
              <p className="text-sm text-muted mt-3 leading-relaxed">
                The kernel denies operations outside granted capabilities. No
                interception, no filtering &mdash; structurally impossible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
