"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Milestone } from "@/db/schema";
import { MilestoneStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";

const inputClass =
  "w-full rounded-2xl border border-forest/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold";

type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export function MilestoneManager({
  projectId,
  milestones,
}: {
  projectId: number;
  milestones: Milestone[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [status, setStatus] = useState<Status>("PENDING");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function addMilestone(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title,
          description,
          status,
          targetCompletionDate,
          sortOrder: milestones.length + 1,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal menambah milestone");
        return;
      }
      setTitle("");
      setDescription("");
      router.refresh();
    } catch {
      setError("Gagal menambah milestone");
    } finally {
      setPending(false);
    }
  }

  async function patchStatus(id: number, next: Status) {
    await fetch("/api/milestones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    router.refresh();
  }

  async function remove(id: number) {
    await fetch(`/api/milestones?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        {milestones.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-forest/10 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted">Tahap {index + 1}</p>
                <p className="font-display text-xl text-forest">{item.title}</p>
                <p className="text-xs text-muted">Target {formatDate(item.targetCompletionDate)}</p>
              </div>
              <MilestoneStatusBadge status={item.status} />
            </div>
            {item.description ? <p className="mt-2 text-sm text-muted">{item.description}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {(["PENDING", "IN_PROGRESS", "COMPLETED"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void patchStatus(item.id, s)}
                  className="rounded-full border border-forest/10 px-3 py-1 text-[11px] font-semibold text-forest hover:bg-mint"
                >
                  {s === "PENDING" ? "Pending" : s === "IN_PROGRESS" ? "Berjalan" : "Selesai"}
                </button>
              ))}
              <button type="button" onClick={() => void remove(item.id)} className="text-[11px] text-red-700">
                Hapus
              </button>
            </div>
          </div>
        ))}
        {milestones.length === 0 ? <p className="text-sm text-muted">Belum ada tahapan. Susun dari formulir.</p> : null}
      </div>
      <form onSubmit={addMilestone} className="h-fit space-y-3 rounded-3xl border border-forest/10 bg-white p-5">
        <h3 className="font-display text-2xl text-forest">Tambah tahapan</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Judul tahap"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-24`}
          placeholder="Uraian pekerjaan"
        />
        <input
          type="date"
          value={targetCompletionDate}
          onChange={(e) => setTargetCompletionDate(e.target.value)}
          className={inputClass}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={inputClass}>
          <option value="PENDING">Belum dimulai</option>
          <option value="IN_PROGRESS">Berjalan</option>
          <option value="COMPLETED">Selesai</option>
        </select>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-forest py-2.5 text-sm font-semibold text-ivory disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Tambah milestone"}
        </button>
      </form>
    </div>
  );
}
