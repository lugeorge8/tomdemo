import Link from "next/link";

import { listPosts } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            tomdemo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Internal updates for the team.
          </p>
          <div className="mt-5 flex gap-2">
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/blog/admin"
              className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <div className="space-y-4">
          {posts.length ? (
            posts.map((p) => (
              <div key={p.id} className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  {new Date(p.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight">
                  {p.title}
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                  {p.body}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-6 text-sm text-zinc-300">
              No posts yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
