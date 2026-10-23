import { eq } from "drizzle-orm";
import { db, milestones, notifications, progressUpdates, projects, transactions, users } from "@/db";
import { requireNazhir, zodError } from "@/lib/api-guard";
import { sendProgressBroadcast } from "@/lib/email";
import { ensureSeed } from "@/lib/ensure-seed";
import { progressSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const [project] = await db.select().from(projects).where(eq(projects.id, parsed.data.projectId)).limit(1);
  if (!project) return Response.json({ error: "Proyek tidak ditemukan" }, { status: 404 });

  const [update] = await db
    .insert(progressUpdates)
    .values({
      projectId: parsed.data.projectId,
      milestoneId: parsed.data.milestoneId ?? null,
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrls: parsed.data.imageUrls ?? [],
    })
    .returning();

  if (typeof parsed.data.physicalProgress === "number") {
    await db
      .update(projects)
      .set({ physicalProgress: parsed.data.physicalProgress })
      .where(eq(projects.id, parsed.data.projectId));
  }

  if (parsed.data.milestoneId && parsed.data.milestoneStatus) {
    await db
      .update(milestones)
      .set({ status: parsed.data.milestoneStatus })
      .where(eq(milestones.id, parsed.data.milestoneId));
  }

  const donors = await db
    .select({ userId: transactions.userId })
    .from(transactions)
    .where(eq(transactions.projectId, parsed.data.projectId));

  const uniqueIds = [...new Set(donors.map((d) => d.userId).filter((id): id is number => Boolean(id)))];

  if (uniqueIds.length > 0) {
    await db.insert(notifications).values(
      uniqueIds.map((userId) => ({
        userId,
        projectId: parsed.data.projectId,
        title: `Update: ${project.title}`,
        message: parsed.data.title,
      })),
    );
  }

  const recipientUsers =
    uniqueIds.length > 0
      ? await db.select({ email: users.email, name: users.name }).from(users).where(eq(users.id, uniqueIds[0]))
      : [];

  const emails = (
    await Promise.all(
      uniqueIds.map(async (id) => {
        const [u] = await db.select({ email: users.email }).from(users).where(eq(users.id, id)).limit(1);
        return u?.email;
      }),
    )
  ).filter((email): email is string => Boolean(email));

  const email = await sendProgressBroadcast({
    to: emails,
    subject: `Progres baru: ${project.title}`,
    html: `<p>Assalamu'alaikum ${recipientUsers[0]?.name ?? "Wakif"},</p><p>${parsed.data.title}</p><p>${parsed.data.description}</p>`,
  });

  return Response.json({ update, notified: uniqueIds.length, email }, { status: 201 });
}
