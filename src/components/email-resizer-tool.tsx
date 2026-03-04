"use client";

import { useMemo, useState } from "react";

type Resp = {
  ok: true;
  resized: { subject?: string; body: string };
};

export function EmailResizerTool() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRun = useMemo(() => email.trim().length > 0, [email]);

  async function run(direction: "shorter" | "longer") {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/email/resize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, direction }),
      });
      const text = await res.text();
      const json = text ? (JSON.parse(text) as (Resp & { error?: string })) : null;
      if (!res.ok) throw new Error(json?.error ?? `Failed (${res.status})`);

      const subject = json?.resized.subject
        ? `Subject: ${json.resized.subject}\n\n`
        : "";
      setEmail(subject + (json?.resized.body ?? ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
        Email
      </div>
      <textarea
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Paste the email here…\n\nTip: you can include a Subject: line at the top."
        className="mt-4 h-[520px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-zinc-50 outline-none focus:border-teal-400/60"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={!canRun || loading}
          onClick={() => run("shorter")}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10 disabled:opacity-60"
        >
          – Shorter
        </button>
        <button
          disabled={!canRun || loading}
          onClick={() => run("longer")}
          className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90 disabled:opacity-60"
        >
          + Longer
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-3 text-xs text-zinc-400">
        Each click rewrites and replaces the text in this box. Scaffold mode (heuristic).
      </div>
    </div>
  );
}
