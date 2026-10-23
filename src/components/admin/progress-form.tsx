"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploadField } from "@/components/image-upload-field";
import { progressSchema } from "@/lib/validations";
import { formatDateTime } from "@/lib/format";
import type { Milestone, ProgressUpdate } from "@/db/schema";

const inputClass =
  "w-full rounded-2xl border border-forest/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold";

export function ProgressForm({
  projectId,
  milestones,
  updates,
  physicalProgress,
}: {
  projectId: number;
  milestones: Milestone[];
  updates: ProgressUpdate[];
  physicalProgress: number;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneId, setMilestoneId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [physical, setPhysical] = useState(String(physicalProgress));
  const [milestoneStatus, setMilestoneStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = progressSchema.safeParse({
      projectId,
      milestoneId: milestoneId ? Number(milestoneId) : null,
      title,
      description,
      imageUrls: imageUrl ? [imageUrl] : [],
      physicalProgress: Number(physical),
      milestoneStatus: milestoneStatus || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa formulir");
      return;
    }
    setPending(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal mengirim update");
        return;
      }
      setTitle("");
      setDescription("");
      setImageUrl("");
      setInfo(
        `Laporan terkirim. Notifikasi ke ${json.notified ?? 0} wakif${json.email?.dryRun ? " (email dry-run / Resend siap)" : ""}.`,
      );
      router.refresh();
    } catch {
      setError("Gagal mengirim update");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={onSubmit} className="h-fit space-y-3 rounded-3xl border border-forest/10 bg-white p-5">
        <h3 className="font-display text-2xl text-forest">Logger progres lapangan</h3>
        <p className="text-sm text-muted">Unggah bukti, perbarui milestone, dan siarkan notifikasi ke wakif.</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Judul laporan" required />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-28`}
          placeholder="Ringkasan kondisi lapangan"
          required
        />
        <select value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)} className={inputClass}>
          <option value="">Tanpa milestone</option>
          {milestones.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <select value={milestoneStatus} onChange={(e) => setMilestoneStatus(e.target.value)} className={inputClass}>
          <option value="">Status milestone (opsional)</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">Berjalan</option>
          <option value="COMPLETED">Selesai</option>
        </select>
        <input
          inputMode="numeric"
          value={physical}
          onChange={(e) => setPhysical(e.target.value.replace(/\D/g, ""))}
          className={inputClass}
          placeholder="Progres fisik 0-100"
        />
        <ImageUploadField label="Foto bukti lapangan" value={imageUrl} onChange={setImageUrl} />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {info ? <p className="text-sm text-leaf">{info}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-forest py-2.5 text-sm font-semibold text-ivory disabled:opacity-60"
        >
          {pending ? "Menyiarkan…" : "Kirim update & notifikasi"}
        </button>
      </form>
      <div className="space-y-3">
        {updates.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
            {item.imageUrls?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrls[0]} alt="" className="h-40 w-full object-cover" />
            ) : null}
            <div className="p-4">
              <p className="text-xs text-muted">{formatDateTime(item.createdAt)}</p>
              <h4 className="font-display text-xl text-forest">{item.title}</h4>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
