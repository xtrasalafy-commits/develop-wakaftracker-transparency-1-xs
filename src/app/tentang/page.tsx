import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tentang WakafTracker" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Manifesto transparansi</p>
      <h1 className="mt-3 font-display text-5xl text-forest">Amanah yang bisa diaudit.</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        WakafTracker dibangun untuk nazhir yang ingin membuka buku, dan wakif yang ingin melihat batu demi batu.
        Bukan sekadar penggalangan dana — ini adalah sistem pelaporan proyek wakaf.
      </p>
      <div className="mt-10 overflow-hidden rounded-[2rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-mosque.jpg" alt="" className="h-72 w-full object-cover" />
      </div>
      <div className="mt-10 space-y-8 text-muted">
        <section>
          <h2 className="font-display text-3xl text-forest">Dual progress</h2>
          <p className="mt-2 leading-relaxed">
            Pendanaan dan progres fisik adalah dua kurva yang berbeda. Proyek bisa 90% terdanai namun baru 20%
            terbangun. Keduanya ditampilkan berdampingan di setiap kartu dan halaman detail.
          </p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-forest">Arus kas bernota</h2>
          <p className="mt-2 leading-relaxed">
            Nazhir mencatat setiap pengeluaran beserta foto kuitansi. Publik melihat dana masuk, belanja, dan saldo
            tanpa menunggu laporan tahunan.
          </p>
        </section>
        <section>
          <h2 className="font-display text-3xl text-forest">Siaran ke wakif</h2>
          <p className="mt-2 leading-relaxed">
            Saat logger lapangan diisi, sistem membuat notifikasi ke seluruh wakif proyek tersebut. Integrasi Resend
            siap diaktifkan lewat <code className="text-forest">RESEND_API_KEY</code>. Unggah foto siap Cloudinary
            melalui <code className="text-forest">CLOUDINARY_CLOUD_NAME</code>.
          </p>
        </section>
      </div>
      <Link
        href="/proyek"
        className="mt-10 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory"
      >
        Mulai dari katalog
      </Link>
    </main>
  );
}
