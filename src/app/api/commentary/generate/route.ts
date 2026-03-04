import { NextResponse } from "next/server";

import { getOpenAI } from "@/lib/openai";
import { cheapSummary, compareText } from "@/lib/summarize";

export const runtime = "nodejs";

type Req = {
  currentText: string;
  previousText?: string;
};

type Out = {
  current: { headline: string; bullets: string[] };
  previous: { headline: string; bullets: string[] } | null;
  diff: { added: string[]; removed: string[] } | null;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Req | null;
  const currentText = body?.currentText ?? "";
  const previousText = body?.previousText ?? "";

  if (!currentText.trim()) {
    return NextResponse.json({ error: "Missing currentText" }, { status: 400 });
  }

  const openai = getOpenAI();

  // If OpenAI key is configured, use it. Otherwise fall back to deterministic mode.
  if (openai) {
    try {
      const prompt = `You are helping a PWM advisor write portfolio commentary.

TASK:
- Extract ONLY INVESTMENT THEMES from the CURRENT report.
- Output 6-10 crisp bullets that are client-ready.
- If a PREVIOUS report is provided, also summarize it into 4-8 bullets and compute a simple changes list.

RULES:
- Focus on investment themes (rates, inflation, equities, credit, USD/FX, commodities, real estate, volatility, positioning, outlook).
- Avoid operational/admin content.
- Avoid compliance-ish promissory language (no guarantees).
- Keep the tone: concise, confident, neutral.

OUTPUT:
Return ONLY valid JSON (no markdown) with this shape:
{
  "current": {"headline": string, "bullets": string[]},
  "previous": null | {"headline": string, "bullets": string[]},
  "diff": null | {"added": string[], "removed": string[]}
}

CURRENT REPORT:
"""
${currentText}
"""

PREVIOUS REPORT (optional):
"""
${previousText}
"""`;

      const resp = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a careful assistant. Return ONLY valid JSON. No markdown. No extra keys.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const outText = resp.choices[0]?.message?.content ?? "";
      const parsed = JSON.parse(outText) as Out;

      return NextResponse.json(parsed);
    } catch (e) {
      // fall back below
      console.error(e);
    }
  }

  const current = cheapSummary(currentText);
  const previous = previousText.trim() ? cheapSummary(previousText) : null;
  const diff = previousText.trim() ? compareText(previousText, currentText) : null;

  const out: Out = { current, previous, diff };
  return NextResponse.json(out);
}
