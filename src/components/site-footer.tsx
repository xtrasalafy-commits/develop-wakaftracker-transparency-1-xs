import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="no-print mt-20 border-t border-forest/10 bg-forest-deep text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/75">
            Dashboard transparansi wakaf untuk nazhir dan wakif. Setiap dana, setiap batu, setiap laporan — terbuka
            untuk diaudit.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Jelajah</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
            <Link href="/proyek">Katalog proyek</Link>
            <Link href="/tentang">Model transparansi</Link>
            <Link href="/masuk">Masuk portal</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Nazhir</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">
            Yayasan Wakaf Al-Amanah
            <br />
            Jl. Kemang Raya No. 12, Jakarta
            <br />
            nazhir@wakaftracker.id
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} WakafTracker · Laporan terbuka, amanah terjaga
      </div>
    </footer>
  );
}
