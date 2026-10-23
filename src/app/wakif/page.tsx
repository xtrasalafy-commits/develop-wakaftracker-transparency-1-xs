import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, Bell, HeartHandshake } from "lucide-react";
import { DualProgress } from "@/components/dual-progress";
import { getCurrentUser } from "@/lib/auth";
import { displayDonorName } from "@/lib/certificates";
import { formatDate, formatDateTime, formatRupiah } from "@/lib/format";
import { getWakifPortal, markNotificationsRead } from "@/lib/queries";

export const metadata: Metadata = { title: "Portal Wakif" };
export const dynamic = "force-dynamic";

export default async function WakifPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=/wakif");
  if (user.role === "ADMIN_NAZHIR") redirect("/admin");

  const portal = await getWakifPortal(user.id);
  await markNotificationsRead(user.id);

  const projectMap = Object.fromEntries(portal.fundedProjects.map((p) => [p.id, p]));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Portal wakif</p>
      <h1 className="mt-2 font-display text-5xl text-forest">Assalamu&apos;alaikum, {user.name.split(" ")[0]}</h1>
      <p className="mt-2 text-muted">Riwayat wakaf, e-sertifikat, dan umpan progres dari proyek yang Anda danai.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Mini icon={HeartHandshake} label="Total wakaf" value={formatRupiah(portal.totalGiven)} />
        <Mini icon={Award} label="E-sertifikat" value={String(portal.certificateCount)} />
        <Mini icon={Bell} label="Notifikasi" value={String(portal.notifications.length)} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-4xl text-forest">Galeri e-sertifikat</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portal.transactions.map((tx) => (
            <Link
              key={tx.id}
              href={`/sertifikat/${tx.certificateCode}`}
              className="rounded-3xl border border-gold/40 bg-white p-5 hover:border-gold"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold">Sertifikat wakaf</p>
              <p className="mt-2 font-display text-2xl text-forest">{formatRupiah(tx.amount)}</p>
              <p className="mt-1 text-sm text-muted">{projectMap[tx.projectId]?.title ?? "Proyek"}</p>
              <p className="mt-4 font-mono text-xs text-forest">{tx.certificateCode}</p>
              <p className="mt-1 text-xs text-muted">{formatDate(tx.createdAt)}</p>
            </Link>
          ))}
          {portal.transactions.length === 0 ? (
            <p className="text-sm text-muted">Belum ada wakaf. Mulai dari katalog proyek.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-4xl text-forest">Riwayat wakaf</h2>
          <div className="mt-4 overflow-hidden rounded-3xl border border-forest/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-mint text-left text-xs uppercase tracking-wider text-leaf">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Proyek</th>
                  <th className="px-4 py-3">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {portal.transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-sand">
                    <td className="px-4 py-3 text-muted">{formatDate(tx.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/proyek/${tx.projectId}`} className="font-medium text-forest hover:text-leaf">
                        {projectMap[tx.projectId]?.title ?? "Proyek"}
                      </Link>
                      <p className="text-xs text-muted">{displayDonorName(tx.donorName, tx.isAnonymous)}</p>
                    </td>
                    <td className="px-4 py-3 tabular font-semibold">{formatRupiah(tx.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="font-display text-4xl text-forest">Umpan progres</h2>
          <div className="mt-4 space-y-3">
            {portal.feed.map((item) => (
              <article key={item.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                <p className="text-xs text-muted">
                  {projectMap[item.projectId]?.title} · {formatDateTime(item.createdAt)}
                </p>
                <h3 className="mt-1 font-semibold text-forest">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </article>
            ))}
            {portal.feed.length === 0 ? <p className="text-sm text-muted">Belum ada update dari proyek Anda.</p> : null}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-4xl text-forest">Proyek yang Anda danai</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {portal.fundedProjects.map((project) => (
            <Link key={project.id} href={`/proyek/${project.id}`} className="rounded-3xl border border-forest/10 bg-white p-5">
              <p className="text-xs text-muted">{project.location}</p>
              <h3 className="font-display text-2xl text-forest">{project.title}</h3>
              <div className="mt-4">
                <DualProgress
                  collected={project.collectedAmount}
                  target={project.targetAmount}
                  physical={project.physicalProgress}
                  compact
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Mini({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-5">
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl tabular text-forest">{value}</p>
    </div>
  );
}
