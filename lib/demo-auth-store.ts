import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { env } from "@/lib/env";

export interface DemoAuthUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), "data");
const authFile = path.join(dataDir, "demo-auth.json");

function createDefaultUsers(): DemoAuthUser[] {
  return [
    {
      id: "demo-admin",
      email: env.demoAdminEmail.toLowerCase(),
      fullName: "Hospital SNS Admin",
      password: env.demoAdminPassword,
      createdAt: new Date().toISOString(),
    },
  ];
}

async function ensureDemoAuthFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(authFile, "utf8");
  } catch {
    await writeFile(
      authFile,
      JSON.stringify(createDefaultUsers(), null, 2),
      "utf8",
    );
  }
}

async function readDemoAuthUsers() {
  await ensureDemoAuthFile();
  const raw = await readFile(authFile, "utf8");
  return JSON.parse(raw) as DemoAuthUser[];
}

async function writeDemoAuthUsers(users: DemoAuthUser[]) {
  await ensureDemoAuthFile();
  await writeFile(authFile, JSON.stringify(users, null, 2), "utf8");
}

export async function getDemoAuthUserByEmail(email: string) {
  const users = await readDemoAuthUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email === normalized) ?? null;
}

export async function createDemoAuthUser(input: {
  email: string;
  fullName: string;
  password: string;
}) {
  const users = await readDemoAuthUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const nextUser: DemoAuthUser = {
    id: randomUUID(),
    email: normalizedEmail,
    fullName: input.fullName.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  users.unshift(nextUser);
  await writeDemoAuthUsers(users);
  return nextUser;
}

