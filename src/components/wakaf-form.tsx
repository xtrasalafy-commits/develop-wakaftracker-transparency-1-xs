"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { wakafSchema } from "@/lib/validations";
import { WAKAF_PRESETS } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

export function WakafForm({
  projectId,
  defaultName,
}: {
  projectId: number;
  defaultName?: string;
}) {
  const router = useRouter();
  const [donorName, setDonorName] = useState(defaultName ?? "");
  const [amount, setAmount] = useState(500_000);
  const [custom, setCustom] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const parsedAmount = useMemo(() => {
    if (custom.trim()) {
      const n = Number(custom.replace(/\D/g, ""));
      return Number.isFinite(n) ? n : 0;
    }
    return amount;
  }, [amount, custom]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = wakafSchema.safeParse({
      projectId,
      donorName,
      amount: parsedAmount,
      isAnonymous,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali formulir");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal menunaikan wakaf");
        return;
      }
      setSuccessCode(json.certificateCode);
      router.refresh();
    } catch {
      setError("Jaringan bermasalah. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  if (successCode) {
    return (
      <div className="rounded-3xl bg-mint p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Alhamdulillah</p>
        <h3 className="mt-2 font-display text-3xl text-forest">Wakaf tercatat</h3>
        <p className="mt-2 text-sm text-muted">Sertifikat digital Anda siap diunduh.</p>
        <p className="mt-4 rounded-xl bg-white px-3 py-2 font-mono text-sm text-forest">{successCode}</p>
        <a
          href={`/sertifikat/${successCode}`}
          className="mt-5 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory"
        >
          Lihat e-Sertifikat
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Nama wakif</label>
        <input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="Nama lengkap"
          required
        />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Nominal</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {WAKAF_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setCustom("");
              }}
              className={cn(
                "rounded-xl border px-2 py-2 text-sm tabular",
                !custom && amount === preset
                  ? "border-gold bg-gold/15 font-semibold text-forest"
                  : "border-forest/10 bg-white text-muted hover:border-gold/50",
              )}
            >
              {formatRupiah(preset)}
            </button>
          ))}
        </div>
        <input
          inputMode="numeric"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="Atau tulis nominal lain (angka)"
        />
        <p className="mt-1 text-xs text-muted">Akan diwakafkan: {formatRupiah(parsedAmount)}</p>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="accent-leaf"
        />
        Sembunyikan nama saya di daftar publik
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-forest py-3 text-sm font-semibold text-ivory hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "Mencatat wakaf…" : "Tunaikan wakaf"}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-muted">
        Nominal divalidasi Zod. Kode sertifikat unik diterbitkan otomatis setelah transaksi sukses.
      </p>
    </form>
  );
}
