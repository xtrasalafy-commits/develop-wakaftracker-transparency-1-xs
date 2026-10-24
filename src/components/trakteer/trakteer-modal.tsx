"use client";

import { useState } from "react";
import { X, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

const NOMINALS = [6000, 12000, 18000, 24000, 30000];

const TRAKTEER_URL = "https://trakteer.id/perpus_opera/";

export function TrakteerModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState(false);

  const amount = selected ?? (custom ? Number(custom.replace(/\D/g, "")) : 0);
  const isValid = amount >= 6000 && amount % 6000 === 0;

  function handleSelect(nominal: number) {
    setSelected(nominal);
    setCustom("");
  }

  function handleCopy() {
    navigator.clipboard.writeText(TRAKTEER_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Traktir kopi"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-display text-2xl text-forest">
            Traktir Kopi
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-forest/10"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-muted mb-6 leading-relaxed">
          Web app ini gratis &amp; bebas iklan. Traktir kopi untuk bantu biaya server?
        </p>

        <div className="space-y-3 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Pilih nominal
          </p>
          <div className="grid grid-cols-3 gap-2">
            {NOMINALS.map((nominal) => (
              <button
                key={nominal}
                type="button"
                onClick={() => handleSelect(nominal)}
                className={`rounded-xl border px-3 py-2 text-sm tabular font-semibold transition ${
                  selected === nominal
                    ? "border-gold bg-gold/15 text-forest"
                    : "border-forest/10 bg-white text-muted hover:border-gold/50"
                }`}
              >
                Rp {nominal.toLocaleString("id-ID")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setSelected(null); }}
              className="rounded-xl border border-forest/10 px-3 py-2 text-sm text-muted hover:border-gold/50"
            >
              Lainnya
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
              placeholder="Masukkan nominal"
              className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm text-mono outline-none focus:border-gold"
              disabled={selected !== null}
            />
          </div>
        </div>

        {amount > 0 && (
          <div className="mb-6 p-3 rounded-2xl border border-gold/30 bg-gold/5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Total traktiran
            </p>
            <p className="font-display text-xl tabular text-forest">
              Rp {amount.toLocaleString("id-ID")}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            QR Code
          </p>
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(TRAKTEER_URL)}`}
              alt="QR Code Trakteer"
              className="rounded-xl border border-forest/10 bg-white p-2 shadow-sm"
              loading="lazy"
            />
            <p className="text-[10px] text-muted">
              Scan untuk traktir lewat Trakteer
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={isValid && amount > 0 ? TRAKTEER_URL : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-ivory transition ${!isValid || amount === 0 ? "bg-forest/30 text-forest/50 cursor-not-allowed" : "bg-forest hover:bg-forest-deep"}`}
          >
            {isValid && amount > 0 ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Lanjutkan ke Trakteer
              </>
            ) : (
              "Pilih nominal terlebih dahulu"
            )}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-forest/10 px-4 py-2 text-sm font-semibold text-forest hover:bg-mint transition"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-leaf" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Disalin!" : "Salin tautan trakteer.id"}
          </button>
        </div>
      </div>
    </div>
  );
}
