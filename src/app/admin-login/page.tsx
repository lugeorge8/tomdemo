import Link from "next/link";

import { AdminLoginForm } from "./ui";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto w-full max-w-lg px-5 py-16">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            tomdemo
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin login</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Passcode-only login.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>

          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-teal-300 underline">
              ← Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
