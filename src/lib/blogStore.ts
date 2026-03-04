import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export type BlogPost = {
  id: string;
  title: string;
  createdAt: string;
  body: string;
};

const DATA_PATH = path.join(process.cwd(), "src", "data", "blog.json");

let memory: BlogPost[] | null = null;

async function readAll(): Promise<BlogPost[]> {
  if (memory) return memory;
  try {
    const s = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(s) as { posts?: BlogPost[] };
    memory = parsed.posts ?? [];
    return memory;
  } catch {
    memory = [];
    return memory;
  }
}

export async function listPosts(): Promise<BlogPost[]> {
  return readAll();
}

export async function addPost(input: { title: string; body: string }): Promise<BlogPost> {
  const posts = await readAll();
  const post: BlogPost = {
    id: crypto.randomBytes(12).toString("hex"),
    title: input.title.trim() || "Untitled",
    body: input.body,
    createdAt: new Date().toISOString(),
  };
  const next = [post, ...posts].slice(0, 200);
  memory = next;

  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify({ posts: next }, null, 2) + "\n", "utf8");
  } catch {
    // ignore EROFS on serverless; memory keeps it for warm instance
  }

  return post;
}
