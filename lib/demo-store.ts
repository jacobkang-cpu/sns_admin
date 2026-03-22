import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createSeedDatabase } from "@/data/demo-seed";
import type { DemoDatabase } from "@/types/domain";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "demo-db.json");

async function ensureDemoFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(
      dataFile,
      JSON.stringify(createSeedDatabase(), null, 2),
      "utf8",
    );
  }
}

export async function readDemoDatabase(): Promise<DemoDatabase> {
  await ensureDemoFile();
  const raw = await readFile(dataFile, "utf8");
  return JSON.parse(raw) as DemoDatabase;
}

export async function writeDemoDatabase(payload: DemoDatabase) {
  await ensureDemoFile();
  await writeFile(dataFile, JSON.stringify(payload, null, 2), "utf8");
}

