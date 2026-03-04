"use client";

import { useMemo, useState } from "react";

import {
  computeRmd,
  UNIFORM_LIFETIME_TABLE,
  type RmdRow,
} from "@/lib/rmd";

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function RmdTool() {
  const [age, setAge] = useState<number>(72);
  const [assets, setAssets] = useState<number>(500000);

  const calc = useMemo(() => computeRmd(age, assets), [age, assets]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
          Inputs
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Age
            </label>
            <input
              type="number"
              value={age}
              min={0}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-50 outline-none focus:border-teal-400/60"
            />
            <div className="mt-2 text-xs text-zinc-400">Uniform table covers ages 72–120.</div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              IRA balance (12/31 prior year)
            </label>
            <input
              type="number"
              value={assets}
              min={0}
              onChange={(e) => setAssets(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-50 outline-none focus:border-teal-400/60"
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
              Output
            </div>
            <div className="mt-3 grid gap-2 text-sm text-zinc-200">
              <div>
                Divisor: <span className="font-semibold">{calc.divisor ?? "—"}</span>
              </div>
              <div>
                RMD: <span className="font-semibold">{calc.rmd ? usd(calc.rmd) : "—"}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-400">
              Informational only. Actual RMD rules vary (beneficiaries, inherited IRAs, etc.).
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
          Uniform Lifetime Table
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/15">
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-black/40 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Distribution period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-200">
                {UNIFORM_LIFETIME_TABLE.map((r: RmdRow) => (
                  <tr
                    key={r.age}
                    className={r.age === age ? "bg-teal-500/10" : ""}
                  >
                    <td className="px-4 py-3 tabular-nums">{r.age}</td>
                    <td className="px-4 py-3 tabular-nums">{r.distributionPeriod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
