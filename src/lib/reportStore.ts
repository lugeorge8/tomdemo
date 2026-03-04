import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export type StoredReport = {
  id: string;
  title: string;
  createdAt: string;
  text: string;
};

const DATA_PATH = path.join(process.cwd(), "src", "data", "reports.json");

async function readJsonSafe<T>(fallback: T): Promise<T> {
  try {
    const s = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export async function listReports(): Promise<StoredReport[]> {
  const data = await readJsonSafe<{ reports: StoredReport[] }>({ reports: [] });
  return data.reports;
}

export async function getReport(id: string): Promise<StoredReport | null> {
  const reports = await listReports();
  return reports.find((r) => r.id === id) ?? null;
}

export async function saveReport(input: {
  title: string;
  text: string;
}): Promise<StoredReport> {
  const reports = await listReports();
  const report: StoredReport = {
    id: crypto.randomBytes(12).toString("hex"),
    title: input.title.trim() || "Untitled report",
    createdAt: new Date().toISOString(),
    text: input.text,
  };

  const next = { reports: [report, ...reports].slice(0, 50) };

  // Note: on serverless this may be read-only; still works locally for demos.
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");

  return report;
}
