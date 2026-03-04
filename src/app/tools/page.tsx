import Link from "next/link";

const tools = [
  {
    title: "Portfolio commentary",
    href: "/tools/portfolio-commentary",
    desc: "Paste/upload a report, summarize it, compare to a prior report.",
  },
  {
    title: "Email resizer",
    href: "/tools/email-resizer",
    desc: "Make an email shorter/longer while keeping the same tone.",
  },
  {
    title: "RMD calculator",
    href: "/tools/rmd",
    desc: "Uniform Lifetime Table + compute RMD from age and assets.",
  },
  {
    title: "Team blog",
    href: "/blog",
    desc: "Internal updates with admin upload.",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            tomdemo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tools</h1>
          <p className="mt-2 text-sm text-zinc-300">Producer wrapper demos.</p>
          <div className="mt-5">
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
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
      </main>
    </div>
  );
}
