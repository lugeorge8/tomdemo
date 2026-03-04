"use client";

import { useState } from "react";

async function readFileText(file: File) {
  const buf = await file.arrayBuffer();
  return new TextDecoder().decode(buf);
}

export function BlogAdminForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch("/api/blog/add", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const text = await res.text();
      const json = text ? (JSON.parse(text) as { error?: string }) : null;
      if (!res.ok) throw new Error(json?.error ?? `Failed (${res.status})`);
      setMsg("Posted. Go to /blog to view.");
      setTitle("");
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
          New post
        </div>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-50 outline-none focus:border-teal-400/60"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste content here…"
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
                  setBody(await readFileText(f));
                }}
              />
            </label>

            <button
              disabled={loading || !body.trim()}
              onClick={submit}
              className="inline-flex items-center justify-center rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>

          {msg ? (
            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">
              {msg}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-6 text-sm text-zinc-300">
        Blog posts are stored in <code className="text-zinc-100">src/data/blog.json</code>.
        <div className="mt-2 text-xs text-zinc-400">
          On serverless deployments this may not persist (read-only filesystem). For the
          demo, it&apos;s fine.
        </div>
      </div>
    </div>
  );
}
