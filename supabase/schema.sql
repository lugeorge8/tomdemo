-- Minimal schema for tomdemo blog

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS, but allow public read; writes should be via service role (server-side).
alter table public.blog_posts enable row level security;

do $$ begin
  create policy "blog_posts_read" on public.blog_posts
    for select
    using (true);
exception when duplicate_object then null;
end $$;
