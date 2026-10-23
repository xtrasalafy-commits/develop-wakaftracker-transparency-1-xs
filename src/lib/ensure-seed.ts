import { sql } from "drizzle-orm";
import { db, users } from "@/db";
import { seedDatabase } from "@/db/seed";

const globalSeed = globalThis as typeof globalThis & {
  __wakafSeedPromise?: Promise<void>;
  __wakafSeeded?: boolean;
};

export async function ensureSeed() {
  if (globalSeed.__wakafSeeded) return;
  if (!globalSeed.__wakafSeedPromise) {
    globalSeed.__wakafSeedPromise = (async () => {
      const existing = await db.select({ id: users.id }).from(users).limit(1);
      if (existing.length === 0) {
        await seedDatabase();
      }
      globalSeed.__wakafSeeded = true;
    })().catch(async (error) => {
      globalSeed.__wakafSeedPromise = undefined;
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("does not exist") || message.includes("relation")) {
        return;
      }
      throw error;
    });
  }
  await globalSeed.__wakafSeedPromise;
}

export async function tablesReady() {
  try {
    await db.execute(sql`select 1 from users limit 1`);
    return true;
  } catch {
    return false;
  }
}
