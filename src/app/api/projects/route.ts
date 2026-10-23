import { desc } from "drizzle-orm";
import { db, projects } from "@/db";
import { requireNazhir, zodError } from "@/lib/api-guard";
import { ensureSeed } from "@/lib/ensure-seed";
import { projectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return Response.json({ projects: rows });
}

export async function POST(req: Request) {
  await ensureSeed();
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const gallery = parsed.data.gallery?.length ? parsed.data.gallery : [parsed.data.coverImage];
  const [project] = await db
    .insert(projects)
    .values({
      title: parsed.data.title,
      category: parsed.data.category,
      targetAmount: parsed.data.targetAmount,
      status: parsed.data.status,
      location: parsed.data.location,
      description: parsed.data.description,
      coverImage: parsed.data.coverImage,
      gallery,
      nazhirOrg: parsed.data.nazhirOrg,
      physicalProgress: parsed.data.physicalProgress ?? 0,
      collectedAmount: 0,
    })
    .returning();

  return Response.json({ project }, { status: 201 });
}
