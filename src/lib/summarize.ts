function normalize(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

const THEME_HINTS: Array<{ re: RegExp; tag: string }> = [
  { re: /\b(rate|rates|fed|cpi|inflation|disinflation|yield|duration)\b/i, tag: "Rates" },
  { re: /\b(equity|equities|stocks|s&p|nasdaq|earnings|multiple|valuation)\b/i, tag: "Equities" },
  { re: /\b(credit|spread|spreads|high\s*yield|investment\s*grade|default)\b/i, tag: "Credit" },
  { re: /\b(usd|dollar|fx|currency|yen|euro)\b/i, tag: "FX" },
  { re: /\b(oil|energy|commodit|gold|copper|inflation hedge)\b/i, tag: "Commodities" },
  { re: /\b(real estate|reit|housing|cap rate)\b/i, tag: "Real estate" },
  { re: /\b(volatility|drawdown|risk|hedg|correlation)\b/i, tag: "Risk" },
  { re: /\b(ai|tech|semis|chip|cloud|software)\b/i, tag: "Tech" },
];

function themeTag(line: string) {
  for (const h of THEME_HINTS) if (h.re.test(line)) return h.tag;
  return null;
}

export function cheapSummary(text: string) {
  const t = normalize(text);
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);

  // Focus on investment themes only: pick lines that look like market/portfolio statements.
  const candidates = lines.filter((l) => {
    if (l.length < 20) return false;
    // exclude obvious admin/compliance boilerplate
    if (/\b(disclaimer|not investment advice|past performance)\b/i.test(l)) return false;
    return true;
  });

  // Prefer lines that match theme hints; fall back to the first few candidates.
  const themed = candidates
    .map((l) => ({ l, tag: themeTag(l) }))
    .sort((a, b) => Number(Boolean(b.tag)) - Number(Boolean(a.tag)));

  const picked = themed.slice(0, 8).map(({ l, tag }) => {
    const clipped = l.length > 160 ? l.slice(0, 160) + "…" : l;
    return tag ? `[${tag}] ${clipped}` : clipped;
  });

  return {
    headline: "Investment themes",
    bullets: picked.length ? picked : [t.slice(0, 220) + (t.length > 220 ? "…" : "")],
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
