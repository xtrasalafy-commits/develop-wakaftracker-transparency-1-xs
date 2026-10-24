"use client";

import { useState } from "react";
import { Coffee, X, ExternalLink } from "lucide-react";
import { TrakteerModal } from "./trakteer-modal";

export function FloatingTrakteerWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-semibold text-forest-deep hover:bg-gold-soft transition shadow-[0_10px_30px_rgba(196,163,90,0.35)]"
        aria-label="Traktir kopi"
      >
        <Coffee className="h-4 w-4" />
        <span>Traktir Kopi</span>
      </button>
      {open && (
        <TrakteerModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}
