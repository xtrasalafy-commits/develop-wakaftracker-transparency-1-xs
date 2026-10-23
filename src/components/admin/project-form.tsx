"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploadField } from "@/components/image-upload-field";
import { CATEGORIES } from "@/lib/constants";
import { projectSchema } from "@/lib/validations";
import type { Project } from "@/db/schema";

const inputClass =
  "w-full rounded-2xl border border-forest/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold";

type Status = "FUNDRAISING" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? "");
  const [category, setCategory] = useState(project?.category ?? "Masjid");
  const [targetAmount, setTargetAmount] = useState(String(project?.targetAmount ?? 100000000));
  const [status, setStatus] = useState<Status>(project?.status ?? "FUNDRAISING");
  const [location, setLocation] = useState(project?.location ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "/images/hero-mosque.jpg");
  const [nazhirOrg, setNazhirOrg] = useState(project?.nazhirOrg ?? "Yayasan Wakaf Al-Amanah");
  const [physicalProgress, setPhysicalProgress] = useState(String(project?.physicalProgress ?? 0));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = projectSchema.safeParse({
      title,
      category,
      targetAmount: Number(targetAmount),
      status,
      location,
      description,
      coverImage,
      nazhirOrg,
      physicalProgress: Number(physicalProgress),
      gallery: project?.gallery ?? [coverImage],
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa formulir");
      return;
    }
    setPending(true);
    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const res = await fetch(url, {
        method: project ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal menyimpan");
        return;
      }
      router.push(`/admin/proyek/${json.project.id}`);
      router.refresh();
    } catch {
      setError("Gagal menyimpan proyek");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-forest/10 bg-white p-5 sm:p-6">
      <Field label="Judul proyek">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kategori">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={inputClass}>
            <option value="FUNDRAISING">Penggalangan Dana</option>
            <option value="IN_PROGRESS">Pembangunan</option>
            <option value="COMPLETED">Selesai</option>
            <option value="PAUSED">Ditunda</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Target dana (Rp)">
          <input
            inputMode="numeric"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value.replace(/\D/g, ""))}
            className={inputClass}
            required
          />
        </Field>
        <Field label="Progres fisik (%)">
          <input
            inputMode="numeric"
            value={physicalProgress}
            onChange={(e) => setPhysicalProgress(e.target.value.replace(/\D/g, ""))}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Lokasi">
        <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} required />
      </Field>
      <Field label="Nazhir / lembaga">
        <input value={nazhirOrg} onChange={(e) => setNazhirOrg(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Deskripsi">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-32`}
          required
        />
      </Field>
      <ImageUploadField label="Foto sampul" value={coverImage} onChange={setCoverImage} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : project ? "Simpan perubahan" : "Terbitkan proyek"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
