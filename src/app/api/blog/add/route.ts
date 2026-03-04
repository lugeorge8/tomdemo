import { NextResponse } from "next/server";

import { addPost } from "@/lib/blogStore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { title?: string; body?: string }
    | null;

  const title = body?.title ?? "";
  const text = body?.body ?? "";

  if (!text.trim()) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }

  try {
    const post = await addPost({ title, body: text });
    return NextResponse.json({ ok: true, id: post.id });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
