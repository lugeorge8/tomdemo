"use client";

import { useState } from "react";

export function AdminLoginForm() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next =
    typeof window === "undefined"
      ? "/blog/admin"
      : new URLSearchParams(window.location.search).get("next") || "/blog/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    const text = await res.text();
    const json = text ? (JSON.parse(text) as { error?: string }) : null;

    if (!res.ok) {
      setError(json?.error ?? "Login failed");
      setLoading(false);
      return;
    }

    window.location.href = next;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Passcode
        </label>
        <input
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          type="password"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-50 outline-none focus:border-teal-400/60"
          required
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        disabled={loading}
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
