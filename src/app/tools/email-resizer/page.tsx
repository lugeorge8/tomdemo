import { EmailResizerTool } from "@/components/email-resizer-tool";

export default function EmailResizerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            tomdemo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Email resizer</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Paste an email and resize it shorter/longer while keeping tone.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <EmailResizerTool />
      </main>
    </div>
  );
}
