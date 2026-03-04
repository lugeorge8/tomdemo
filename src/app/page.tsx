import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
              tomdemo
            </div>
            <div className="mt-1 text-xl font-semibold tracking-tight">
              Producer wrapper tools
            </div>
          </div>
          <Link
            href="/tools"
            className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
          >
            View tools
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-16">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-7">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Demo
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            Show how an assistant speeds up high-volume client work
          </div>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
            <li>Paste or upload a research report</li>
            <li>Generate a client-ready summary</li>
            <li>Compare against a prior report to see changes</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
