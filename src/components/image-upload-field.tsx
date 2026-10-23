"use client";

import { useState } from "react";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unggah gagal");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unggah gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-forest/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
        placeholder="/images/... atau URL Cloudinary"
      />
      <div className="mt-2 flex items-center gap-3">
        <label className="cursor-pointer rounded-full border border-forest/15 px-3 py-1.5 text-xs font-semibold text-forest">
          {busy ? "Mengunggah…" : "Pilih berkas"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </label>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-10 w-10 rounded-lg object-cover" />
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
