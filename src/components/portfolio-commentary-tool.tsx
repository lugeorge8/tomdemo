"use client";

import { useMemo, useState } from "react";

type Summary = { headline: string; bullets: string[] };

type Resp = {
  current: Summary;
  previous: Summary | null;
  diff: { added: string[]; removed: string[] } | null;
};

async function readFileText(file: File) {
  const buf = await file.arrayBuffer();
  return new TextDecoder().decode(buf);
}

export function PortfolioCommentaryTool() {
  const [currentText, setCurrentText] = useState("");
  const [previousText, setPreviousText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canRun = useMemo(() => currentText.trim().length > 0, [currentText]);

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/commentary/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentText, previousText }),
      });
      const text = await res.text();
      const json = text ? (JSON.parse(text) as Resp & { error?: string }) : null;
      if (!res.ok) throw new Error(json?.error ?? `Failed (${res.status})`);
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
          Current report
        </div>

        <div className="mt-4 space-y-3">
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Paste the current report here…"
            className="h-72 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-zinc-50 outline-none focus:border-teal-400/60"
          />

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10">
              Upload .txt
              <input
                type="file"
                accept="text/plain,.txt"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setCurrentText(await readFileText(f));
                }}
              />
            </label>

            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10">
              Upload PDF
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const form = new FormData();
                  form.append("file", f);
                  const res = await fetch("/api/extract/pdf", {
                    method: "POST",
                    body: form,
                  });
                  const text = await res.text();
                  const json = text ? (JSON.parse(text) as { text?: string; error?: string }) : null;
                  if (!res.ok) throw new Error(json?.error ?? `PDF extract failed (${res.status})`);
                  setCurrentText(json?.text ?? "");
                }}
              />
            </label>

            <button
              disabled={!canRun || loading}
              onClick={generate}
              className="inline-flex items-center justify-center rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
          Previous report (optional)
        </div>

        <div className="mt-4 space-y-3">
          <textarea
            value={previousText}
            onChange={(e) => setPreviousText(e.target.value)}
            placeholder="Paste a previous report here to compare…"
            className="h-72 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-zinc-50 outline-none focus:border-teal-400/60"
          />

          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10">
            Upload .txt
            <input
              type="file"
              accept="text/plain,.txt"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setPreviousText(await readFileText(f));
              }}
            />
          </label>
        </div>
      </div>

      <div className="lg:col-span-2">
        {result ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm font-semibold">Summary</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {result.current.headline}
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-200">
                {result.current.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm font-semibold">Previous summary</div>
              {result.previous ? (
                <>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {result.previous.headline}
                  </div>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-200">
                    {result.previous.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="mt-3 text-sm text-zinc-300">No previous report provided.</div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm font-semibold">Changes (rough)</div>
              {result.diff ? (
                <>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Added
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                    {result.diff.added.length ? (
                      result.diff.added.map((x) => <li key={x}>{x}</li>)
                    ) : (
                      <li>—</li>
                    )}
                  </ul>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Removed
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                    {result.diff.removed.length ? (
                      result.diff.removed.map((x) => <li key={x}>{x}</li>)
                    ) : (
                      <li>—</li>
                    )}
                  </ul>
                </>
              ) : (
                <div className="mt-3 text-sm text-zinc-300">No previous report provided.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-6 text-sm text-zinc-300">
            Run “Generate” to see the summary + comparison.
          </div>
        )}
      </div>
    </div>
  );
}
