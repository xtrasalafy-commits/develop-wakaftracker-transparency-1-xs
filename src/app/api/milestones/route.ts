import { eq } from "drizzle-orm";
import { db, milestones } from "@/db";
import { requireNazhir, zodError } from "@/lib/api-guard";
import { ensureSeed } from "@/lib/ensure-seed";
import { milestonePatchSchema, milestoneSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = milestoneSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const [row] = await db
    .insert(milestones)
    .values({
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      status: parsed.data.status,
      sortOrder: parsed.data.sortOrder ?? 0,
      targetCompletionDate: parsed.data.targetCompletionDate
        ? new Date(parsed.data.targetCompletionDate)
        : null,
    })
    .returning();

  return Response.json({ milestone: row }, { status: 201 });
}

export async function PATCH(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = milestonePatchSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const [existing] = await db.select().from(milestones).where(eq(milestones.id, parsed.data.id)).limit(1);
  if (!existing) return Response.json({ error: "Milestone tidak ditemukan" }, { status: 404 });

  const [row] = await db
    .update(milestones)
    .set({
      title: parsed.data.title ?? existing.title,
      description: parsed.data.description ?? existing.description,
      status: parsed.data.status ?? existing.status,
      sortOrder: parsed.data.sortOrder ?? existing.sortOrder,
      targetCompletionDate:
        parsed.data.targetCompletionDate === undefined
          ? existing.targetCompletionDate
          : parsed.data.targetCompletionDate
            ? new Date(parsed.data.targetCompletionDate)
            : null,
    })
    .where(eq(milestones.id, parsed.data.id))
    .returning();

  return Response.json({ milestone: row });
}

export async function DELETE(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return Response.json({ error: "ID wajib" }, { status: 400 });
  await db.delete(milestones).where(eq(milestones.id, id));
  return Response.json({ ok: true });
}
