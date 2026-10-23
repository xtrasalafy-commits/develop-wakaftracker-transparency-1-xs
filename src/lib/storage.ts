import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;

export async function saveUploadedImage(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format file harus JPG, PNG, WEBP, atau GIF");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran file maksimal 4 MB");
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (cloudName && uploadPreset) {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body,
    });
    if (!res.ok) {
      throw new Error("Gagal mengunggah ke Cloudinary");
    }
    const json = (await res.json()) as { secure_url?: string };
    if (!json.secure_url) throw new Error("Cloudinary tidak mengembalikan URL");
    return json.secure_url;
  }

  const ext = file.type.split("/")[1] || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), bytes);
  return `/uploads/${safeName}`;
}
