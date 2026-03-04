import Link from "next/link";

import { tools } from "@/lib/tools";

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
            View all tools
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-12">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-7">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Demo
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            Show how an assistant speeds up high-volume client work
          </div>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
            <li>Fast, repeatable workflows for a high-volume producer</li>
            <li>Simple UI, clean outputs, and easy handoff</li>
          </ul>
        </div>

        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Tools
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 hover:bg-zinc-900/55"
              >
                <div className="text-lg font-semibold tracking-tight">{t.title}</div>
                <div className="mt-2 text-sm leading-6 text-zinc-300">{t.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
