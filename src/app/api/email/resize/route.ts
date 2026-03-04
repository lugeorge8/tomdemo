import { NextResponse } from "next/server";

import { heuristicResize } from "@/lib/emailResizer";

export const runtime = "nodejs";

type Req = {
  email: string;
  direction: "shorter" | "longer";
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Req | null;
  const email = body?.email ?? "";
  const direction = body?.direction;

  if (!email.trim() || (direction !== "shorter" && direction !== "longer")) {
    return NextResponse.json({ error: "Missing email/direction" }, { status: 400 });
  }

  // Scaffold: deterministic heuristic.
  // Upgrade path: if OPENAI_API_KEY is set, call LLM to preserve tone better.
  const resized = heuristicResize(email, direction);

  return NextResponse.json({ ok: true, resized });
}
