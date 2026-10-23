import { desc, eq } from "drizzle-orm";
import { db, projects, transactions } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { generateCertificateCode } from "@/lib/certificates";
import { ensureSeed } from "@/lib/ensure-seed";
import { refreshCollectedAmount } from "@/lib/queries";
import { wakafSchema } from "@/lib/validations";
import { zodError } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await ensureSeed();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const mine = searchParams.get("mine");
  const user = await getCurrentUser();

  if (mine === "1") {
    if (!user) return Response.json({ error: "Masuk terlebih dahulu" }, { status: 401 });
    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt));
    return Response.json({ transactions: rows });
  }

  if (projectId) {
    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.projectId, Number(projectId)))
      .orderBy(desc(transactions.createdAt));
    return Response.json({ transactions: rows });
  }

  const rows = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(50);
  return Response.json({ transactions: rows });
}

export async function POST(req: Request) {
  await ensureSeed();
  const body = await req.json().catch(() => null);
  const parsed = wakafSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, parsed.data.projectId))
    .limit(1);
  if (!project) return Response.json({ error: "Proyek tidak ditemukan" }, { status: 404 });

  const user = await getCurrentUser();
  const certificateCode = generateCertificateCode(project.title);

  const [tx] = await db
    .insert(transactions)
    .values({
      projectId: parsed.data.projectId,
      userId: user?.role === "WAKIF" ? user.id : user?.id ?? null,
      donorName: parsed.data.donorName,
      amount: parsed.data.amount,
      isAnonymous: parsed.data.isAnonymous,
      certificateCode,
    })
    .returning();

  await refreshCollectedAmount(parsed.data.projectId);

  return Response.json({ transaction: tx, certificateCode }, { status: 201 });
}
