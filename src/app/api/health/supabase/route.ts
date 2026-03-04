import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 500 }
    );
  }

  const { count, error } = await sb
    .from("blog_posts")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, blog_posts: count ?? 0 });
}
