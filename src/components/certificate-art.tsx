import { displayDonorName } from "@/lib/certificates";
import { formatDate, formatRupiah } from "@/lib/format";
import type { Project, Transaction } from "@/db/schema";

export function CertificateArt({
  transaction,
  project,
}: {
  transaction: Transaction;
  project: Project | null;
}) {
  return (
    <article className="ornament-border relative overflow-hidden rounded-[28px] bg-ivory px-6 py-10 sm:px-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/certificate-ornament.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
          Bismillahirrahmanirrahim
        </p>
        <h1 className="mt-3 text-center font-display text-4xl text-forest sm:text-5xl">Sertifikat Wakaf</h1>
        <p className="mt-2 text-center text-sm text-muted">WakafTracker · Yayasan Wakaf Al-Amanah</p>
        <div className="gold-line mx-auto my-6 max-w-md" />
        <p className="text-center text-sm text-muted">Diberikan kepada</p>
        <p className="mt-1 text-center font-display text-3xl text-forest">
          {displayDonorName(transaction.donorName, transaction.isAnonymous)}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-muted">
          atas wakaf sebesar <strong className="text-forest">{formatRupiah(transaction.amount)}</strong> untuk proyek
          <strong className="text-forest"> {project?.title ?? "Proyek Wakaf"}</strong>
          {project ? ` di ${project.location}` : ""}. Semoga menjadi amal jariyah yang terus mengalir pahalanya.
        </p>
        <div className="mx-auto mt-8 grid max-w-lg gap-4 rounded-2xl border border-gold/40 bg-white/70 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Kode sertifikat</p>
            <p className="mt-1 font-mono text-forest">{transaction.certificateCode}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Tanggal</p>
            <p className="mt-1 text-forest">{formatDate(transaction.createdAt)}</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted">
          Nazhir: {project?.nazhirOrg ?? "Yayasan Wakaf Al-Amanah"} · Verifikasi publik melalui kode unik
        </p>
      </div>
    </article>
  );
}
