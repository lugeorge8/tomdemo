import Link from "next/link";

import { BlogAdminForm } from "./ui";

export const dynamic = "force-dynamic";

export default function BlogAdminPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            tomdemo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Blog admin</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Upload or paste blog content.
          </p>
          <div className="mt-5 flex gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
            >
              ← Blog
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <BlogAdminForm />
      </main>
    </div>
  );
}
