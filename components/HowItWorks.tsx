import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How it works
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          NONO follows a capability-based security model. You grant explicit
          capabilities, and the OS enforces them at the kernel level.
        </p>

        <div className="rounded-xl overflow-hidden mb-12 max-w-3xl mx-auto">
          <Image
            src="/arch.png"
            alt="NONO architecture diagram"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-accent mb-2">1</div>
            <h3 className="font-semibold mb-2">Enter sandbox</h3>
            <p className="text-muted text-sm">
              You start nono with explicit capabilities for the paths you want
              to allow.
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">2</div>
            <h3 className="font-semibold mb-2">Sandbox applied</h3>
            <p className="text-muted text-sm">
              OS-level restrictions are applied. This is irreversible for the
              process.
            </p>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">3</div>
            <h3 className="font-semibold mb-2">Command executed</h3>
            <p className="text-muted text-sm">
              The command runs with only granted capabilities. All children
              inherit restrictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
