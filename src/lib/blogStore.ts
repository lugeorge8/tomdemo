import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type BlogPost = {
  id: string;
  title: string;
  createdAt: string;
  body: string;
};

type Row = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

export async function listPosts(): Promise<BlogPost[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];

  const { data, error } = await sb
    .from("blog_posts")
    .select("id,title,body,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  return (data as Row[]).map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    createdAt: r.created_at,
  }));
}

export async function addPost(input: { title: string; body: string }): Promise<BlogPost> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Missing SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY");

  const title = input.title.trim() || "Untitled";
  const body = input.body;

  const { data, error } = await sb
    .from("blog_posts")
    .insert({ title, body })
    .select("id,title,body,created_at")
    .single();

  if (error) throw new Error(error.message);

  const r = data as Row;
  return { id: r.id, title: r.title, body: r.body, createdAt: r.created_at };
}
