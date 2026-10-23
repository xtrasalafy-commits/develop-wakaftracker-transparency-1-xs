import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { setSession } from "@/lib/auth";
import { ensureSeed } from "@/lib/ensure-seed";
import { loginSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await ensureSeed();
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Email tidak valid" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return Response.json({ error: "Akun tidak ditemukan. Gunakan email demo yang tersedia." }, { status: 404 });
  }

  await setSession(user.id);
  return Response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
