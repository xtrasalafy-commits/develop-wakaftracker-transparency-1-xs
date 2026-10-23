import { eq } from "drizzle-orm";
import { db, financialLogs } from "@/db";
import { requireNazhir, zodError } from "@/lib/api-guard";
import { ensureSeed } from "@/lib/ensure-seed";
import { expenseSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = expenseSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const [row] = await db
    .insert(financialLogs)
    .values({
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      amount: parsed.data.amount,
      expenseDate: new Date(parsed.data.expenseDate),
      receiptUrl: parsed.data.receiptUrl || null,
    })
    .returning();

  return Response.json({ log: row }, { status: 201 });
}

export async function DELETE(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return Response.json({ error: "ID wajib" }, { status: 400 });
  await db.delete(financialLogs).where(eq(financialLogs.id, id));
  return Response.json({ ok: true });
}
