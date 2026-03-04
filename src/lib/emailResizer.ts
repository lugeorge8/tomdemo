function normalize(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

export function heuristicResize(
  email: string,
  direction: "shorter" | "longer"
): { subject?: string; body: string } {
  const t = normalize(email);

  // naive subject line support: if first line starts with "Subject:"
  let subject: string | undefined;
  let body = t;
  const m = t.match(/^Subject:\s*(.+)\n([\s\S]*)$/i);
  if (m) {
    subject = m[1]?.trim();
    body = (m[2] ?? "").trim();
  }

  if (direction === "shorter") {
    // keep first paragraph and the ask
    const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const first = paras[0] ?? body;
    const last = paras.length > 1 ? paras[paras.length - 1] : "";
    const compact = [first, last]
      .filter(Boolean)
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n");

    return { subject, body: compact };
  }

  // longer: iterative expansion.
  // Strategy: keep any signature/thanks at the bottom, and insert one extra
  // paragraph per click.
  const parts = body.split(/\n\nThanks,\n?/i);
  const main = parts[0]?.trim() ?? body;
  const hasThanks = parts.length > 1 || /\n\nThanks,\n?/i.test(body);

  const baseParas = main.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const existingExtraCount = baseParas.filter((p) => /^Additional detail \(\d+\):/i.test(p)).length;

  const insert: string[] = [];

  // Ensure we have the first context paragraph.
  if (!baseParas.some((p) => /^Quick context:/i.test(p))) {
    insert.push(
      "Quick context: I’m reaching out to make sure we’re aligned and to keep things moving on your timeline."
    );
  }

  // Add one new detail paragraph each click.
  const nextN = existingExtraCount + 1;
  insert.push(
    `Additional detail (${nextN}): Here are a couple more specifics and the key takeaway, so it’s easy to decide next steps.`
  );

  const expandedMain = [...baseParas, ...insert].join("\n\n");
  const expanded = hasThanks ? `${expandedMain}\n\nThanks,\n` : `${expandedMain}\n\nThanks,\n`;

  return { subject, body: expanded };
}
