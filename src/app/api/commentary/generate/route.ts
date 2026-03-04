import { NextResponse } from "next/server";

import { cheapSummary, compareText } from "@/lib/summarize";

export const runtime = "nodejs";

type Req = {
  currentText: string;
  previousText?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Req | null;
  const currentText = body?.currentText ?? "";
  const previousText = body?.previousText ?? "";

  if (!currentText.trim()) {
    return NextResponse.json({ error: "Missing currentText" }, { status: 400 });
  }

  // For now: deterministic summary (no external API required)
  // Later: if OPENAI_API_KEY is set, we can swap to a real LLM summary.
  const current = cheapSummary(currentText);
  const previous = previousText.trim() ? cheapSummary(previousText) : null;
  const diff = previousText.trim() ? compareText(previousText, currentText) : null;

  return NextResponse.json({
    current,
    previous,
    diff,
  });
}
