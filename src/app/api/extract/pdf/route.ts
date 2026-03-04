import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  // pdf-parse is CJS; import via default interop
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdf = require("pdf-parse");

  const data = (await pdf(buf)) as { text?: string };
  const text = (data.text ?? "").trim();

  return NextResponse.json({ ok: true, text });
}
