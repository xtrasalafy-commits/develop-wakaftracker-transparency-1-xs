"use client";

import { useState } from "react";

export function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const photos = images.filter(Boolean);
  const [active, setActive] = useState(photos[0] || "");

  if (photos.length === 0) return null;

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-forest-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active} alt={title} className="aspect-[16/9] w-full object-cover" />
      </div>
      {photos.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(src)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${
                active === src ? "border-gold" : "border-transparent opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
