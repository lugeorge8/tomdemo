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

  // longer: add a small context paragraph + friendly close
  const extra =
    "\n\nQuick context: I’m reaching out to make sure we’re aligned and to keep things moving on your timeline.";

  let expanded = body;
  if (!expanded.includes("Quick context:")) expanded += extra;

  if (!/\b(thanks|thank you)\b/i.test(expanded)) {
    expanded += "\n\nThanks,\n";
  }

  return { subject, body: expanded };
}
