import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="mt-3 font-display text-5xl text-forest">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-muted">Proyek atau sertifikat yang Anda cari tidak ada dalam buku wakaf.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory">
        Kembali ke beranda
      </Link>
    </main>
  );
}
