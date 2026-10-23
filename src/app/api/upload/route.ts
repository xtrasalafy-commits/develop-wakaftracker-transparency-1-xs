import { requireNazhir } from "@/lib/api-guard";
import { saveUploadedImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const guard = await requireNazhir();
  if (guard.response) return guard.response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Berkas tidak ditemukan" }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(file);
    return Response.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unggah gagal";
    return Response.json({ error: message }, { status: 400 });
  }
}
