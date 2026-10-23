import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db, users, type User } from "@/db";

const COOKIE = "wakaf_session";

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function setSession(userId: number) {
  const jar = await cookies();
  jar.set(COOKIE, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function isNazhir(user: User | null) {
  return user?.role === "ADMIN_NAZHIR";
}
