"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploadField } from "@/components/image-upload-field";
import { expenseSchema } from "@/lib/validations";
import { formatDateShort, formatRupiah } from "@/lib/format";
import type { FinancialLog } from "@/db/schema";

const inputClass =
  "w-full rounded-2xl border border-forest/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold";

export function ExpenseForm({
  projectId,
  logs,
}: {
  projectId: number;
  logs: FinancialLog[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptUrl, setReceiptUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = expenseSchema.safeParse({
      projectId,
      title,
      amount: Number(amount),
      expenseDate,
      receiptUrl: receiptUrl || null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa formulir");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/financial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal mencatat");
        return;
      }
      setTitle("");
      setAmount("");
      setReceiptUrl("");
      router.refresh();
    } catch {
      setError("Gagal mencatat pengeluaran");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: number) {
    await fetch(`/api/financial?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={onSubmit} className="h-fit space-y-3 rounded-3xl border border-forest/10 bg-white p-5">
        <h3 className="font-display text-2xl text-forest">Catat pengeluaran</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Uraian belanja" required />
        <input
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          className={inputClass}
          placeholder="Nominal (Rp)"
          required
        />
        <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className={inputClass} />
        <ImageUploadField label="Foto kuitansi / nota" value={receiptUrl} onChange={setReceiptUrl} />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-forest py-2.5 text-sm font-semibold text-ivory disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan arus kas"}
        </button>
      </form>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 rounded-2xl border border-forest/10 bg-white p-3">
            {log.receiptUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={log.receiptUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-mint text-xs text-leaf">Nota</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-forest">{log.title}</p>
              <p className="text-xs text-muted">{formatDateShort(log.expenseDate)}</p>
              <p className="tabular text-sm font-semibold text-leaf">{formatRupiah(log.amount)}</p>
            </div>
            <button type="button" onClick={() => void remove(log.id)} className="text-xs text-red-700">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
