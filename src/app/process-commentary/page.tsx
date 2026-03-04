import { PortfolioCommentaryTool } from "@/components/portfolio-commentary-tool";

export default function ProcessCommentaryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            tomdemo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Portfolio commentary
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Paste or upload a report → generate a summarized client-ready version
            and compare against a previous report.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <PortfolioCommentaryTool />
      </main>
    </div>
  );
}
