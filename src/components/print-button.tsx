"use client";

export function PrintButton({ label = "Unduh / cetak" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-ivory"
    >
      {label}
    </button>
  );
}
