import Link from "next/link";
import { ArrowRight, BadgeCheck, Landmark, Leaf, ShieldCheck } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { DualProgress } from "@/components/dual-progress";
import { formatCompactRupiah, formatDate } from "@/lib/format";
import { getDashboardStats, listProjects, listRecentUpdates } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, projects, updates] = await Promise.all([
    getDashboardStats(),
    listProjects(),
    listRecentUpdates(3),
  ]);
  const featured = projects.slice(0, 3);
  const highlight = projects.find((p) => p.status === "IN_PROGRESS") ?? projects[0];

  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-mosque.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-deep/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/70 to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(/pattern.svg)", backgroundSize: "72px" }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 py-20 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Nazhir · Wakif · Publik</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] text-ivory sm:text-7xl">
            Setiap rupiah wakaf, setiap batu, terlihat.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
            WakafTracker adalah dashboard transparansi proyek wakaf. Dual progress pendanaan dan fisik, arus kas
            bernota, serta e-sertifikat yang bisa diverifikasi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/proyek"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest-deep hover:bg-gold-soft"
            >
              Lihat katalog proyek <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/masuk"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-6 py-3 text-sm font-semibold text-ivory hover:bg-white/10"
            >
              Masuk portal
            </Link>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-4 border-t border-white/15 pt-8 sm:grid-cols-4">
            <Stat k="Dana terkumpul" v={formatCompactRupiah(stats.collected)} />
            <Stat k="Proyek aktif" v={String(stats.projectCount)} />
            <Stat k="Wakif terdaftar" v={String(stats.wakifCount)} />
            <Stat k="Transaksi tercatat" v={String(stats.transactionCount)} />
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Katalog</p>
            <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">Proyek yang sedang diamanahkan</h2>
          </div>
          <Link href="/proyek" className="text-sm font-semibold text-leaf hover:text-forest">
            Semua proyek →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {highlight ? (
        <section className="bg-forest-deep py-20 text-ivory">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Dual progress</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Dana terkumpul belum tentu bangunan jadi.</h2>
              <p className="mt-4 text-ivory/75">
                WakafTracker memisahkan dua metrik yang sering dicampuradukkan: persentase pendanaan dan persentase
                progres fisik. Wakif melihat keduanya secara real-time.
              </p>
              <div className="mt-8 rounded-3xl bg-white p-6 text-ink">
                <p className="text-sm font-semibold text-forest">{highlight.title}</p>
                <div className="mt-4">
                  <DualProgress
                    collected={highlight.collectedAmount}
                    target={highlight.targetAmount}
                    physical={highlight.physicalProgress}
                  />
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/progress-construction.jpg" alt="Progres konstruksi" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Cara kerja</p>
        <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">Tiga langkah, satu amanah</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Step n="01" title="Pilih proyek" body="Saring katalog berdasarkan kategori, lokasi, dan status. Lihat galeri serta timeline milestone." />
          <Step n="02" title="Tunaikan wakaf" body="Nominal divalidasi, nama bisa disembunyikan, e-sertifikat unik terbit otomatis." />
          <Step n="03" title="Pantau & audit" body="Terima siaran progres lapangan, unduh sertifikat, dan telusuri nota pengeluaran." />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 md:grid-cols-3">
        <Trust icon={ShieldCheck} title="Arus kas bernota" body="Setiap pengeluaran dilampiri foto kuitansi. Saldo proyek dihitung dari dana masuk dikurangi belanja." />
        <Trust icon={BadgeCheck} title="E-sertifikat unik" body="Kode WKF-TAHUN-PROYEK-XXXXXX bisa diverifikasi publik dan dicetak." />
        <Trust icon={Landmark} title="Siap nazhir" body="Dashboard admin untuk milestone, logger lapangan, dan siaran notifikasi ke wakif." />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl text-forest">Laporan lapangan terbaru</h2>
          <Leaf className="h-6 w-6 text-gold" />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {updates.map((item) => (
            <Link
              key={item.id}
              href={`/proyek/${item.projectId}`}
              className="overflow-hidden rounded-3xl border border-forest/10 bg-white hover:border-gold/50"
            >
              {item.imageUrls?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrls[0]} alt="" className="h-40 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <p className="text-xs text-muted">
                  {item.projectTitle} · {formatDate(item.createdAt)}
                </p>
                <h3 className="mt-1 font-display text-2xl text-forest">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ivory/60">{k}</dt>
      <dd className="mt-1 font-display text-3xl tabular text-ivory">{v}</dd>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-forest/10 bg-white p-6">
      <p className="font-display text-4xl text-gold">{n}</p>
      <h3 className="mt-3 font-display text-2xl text-forest">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}

function Trust({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-3xl bg-mint p-6">
      <Icon className="h-6 w-6 text-leaf" />
      <h3 className="mt-4 font-display text-2xl text-forest">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}
