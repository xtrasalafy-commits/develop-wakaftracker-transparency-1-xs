import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPanel } from "@/components/login-panel";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Portal</p>
        <h1 className="mt-3 font-display text-5xl text-forest">Satu atap untuk nazhir dan wakif.</h1>
        <p className="mt-4 max-w-md text-muted">
          Nazhir mengelola proyek, milestone, dan arus kas. Wakif meninjau riwayat, e-sertifikat, dan umpan progres
          lapangan.
        </p>
        <div className="mt-8 overflow-hidden rounded-[2rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/community-prayer.jpg" alt="" className="h-64 w-full object-cover" />
        </div>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-white" />}>
        <LoginPanel />
      </Suspense>
    </main>
  );
}
