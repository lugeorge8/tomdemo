function normalize(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

export function cheapSummary(text: string) {
  const t = normalize(text);
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
  const bullets = lines
    .filter((l) => l.length >= 20)
    .slice(0, 8)
    .map((l) => (l.length > 140 ? l.slice(0, 140) + "…" : l));

  return {
    headline: lines[0]?.slice(0, 90) ?? "Summary",
    bullets: bullets.length ? bullets : [t.slice(0, 220) + (t.length > 220 ? "…" : "")],
  };
}

export function compareText(a: string, b: string) {
  // super-light diff: line overlap + new lines
  const A = new Set(normalize(a).split("\n").map((x) => x.trim()).filter(Boolean));
  const B = new Set(normalize(b).split("\n").map((x) => x.trim()).filter(Boolean));

  const added: string[] = [];
  const removed: string[] = [];

  for (const l of B) if (!A.has(l)) added.push(l);
  for (const l of A) if (!B.has(l)) removed.push(l);

  return {
    added: added.slice(0, 12),
    removed: removed.slice(0, 12),
  };
}
