import { eq } from "drizzle-orm";
import { db, projects } from "@/db";
import { requireNazhir, zodError } from "@/lib/api-guard";
import { ensureSeed } from "@/lib/ensure-seed";
import { getProjectDetail } from "@/lib/queries";
import { projectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureSeed();
  const { id } = await params;
  const detail = await getProjectDetail(Number(id));
  if (!detail) return Response.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
  return Response.json(detail);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const { id } = await params;
  const projectId = Number(id);
  const body = await req.json().catch(() => null);
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!existing) return Response.json({ error: "Proyek tidak ditemukan" }, { status: 404 });

  const [project] = await db
    .update(projects)
    .set({
      title: parsed.data.title ?? existing.title,
      category: parsed.data.category ?? existing.category,
      targetAmount: parsed.data.targetAmount ?? existing.targetAmount,
      status: parsed.data.status ?? existing.status,
      location: parsed.data.location ?? existing.location,
      description: parsed.data.description ?? existing.description,
      coverImage: parsed.data.coverImage ?? existing.coverImage,
      gallery: parsed.data.gallery ?? existing.gallery,
      nazhirOrg: parsed.data.nazhirOrg ?? existing.nazhirOrg,
      physicalProgress: parsed.data.physicalProgress ?? existing.physicalProgress,
    })
    .where(eq(projects.id, projectId))
    .returning();

  return Response.json({ project });
}
