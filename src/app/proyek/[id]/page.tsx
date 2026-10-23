import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { CashflowPanel } from "@/components/cashflow-panel";
import { DualProgress } from "@/components/dual-progress";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { PhotoGallery } from "@/components/photo-gallery";
import { ProjectStatusBadge } from "@/components/status-badge";
import { WakafForm } from "@/components/wakaf-form";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatRupiah } from "@/lib/format";
import { getProjectDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(Number(id));
  return { title: detail?.project.title ?? "Proyek" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(Number(id));
  if (!detail) notFound();
  const user = await getCurrentUser();
  const { project, milestones, transactions, financialLogs, progressUpdates, expenseTotal } = detail;
  const gallery = [project.coverImage, ...(project.gallery || [])].filter(
    (src, index, arr) => arr.indexOf(src) === index,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-muted">
        <Link href="/proyek" className="hover:text-forest">
          Katalog
        </Link>{" "}
        / {project.category}
      </p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <ProjectStatusBadge status={project.status} />
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <MapPin className="h-4 w-4" /> {project.location}
            </span>
          </div>
          <h1 className="mt-3 font-display text-4xl text-forest sm:text-6xl">{project.title}</h1>
          <p className="mt-2 text-sm text-muted">Nazhir: {project.nazhirOrg}</p>
          <div className="mt-6">
            <PhotoGallery images={gallery} title={project.title} />
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted">{project.description}</p>
        </div>
        <aside className="h-fit rounded-[2rem] border border-forest/10 bg-white p-6 shadow-[0_20px_50px_rgba(6,36,28,0.08)] lg:sticky lg:top-24">
          <DualProgress
            collected={project.collectedAmount}
            target={project.targetAmount}
            physical={project.physicalProgress}
          />
          <p className="mt-4 text-sm text-muted">
            Sisa kebutuhan{" "}
            <span className="tabular font-semibold text-forest">
              {formatRupiah(Math.max(0, project.targetAmount - project.collectedAmount))}
            </span>
          </p>
          <div className="gold-line my-6" />
          <h2 className="font-display text-3xl text-forest">Formulir wakaf</h2>
          <p className="mb-4 text-sm text-muted">Minimal Rp 10.000. Sertifikat terbit otomatis.</p>
          <WakafForm projectId={project.id} defaultName={user?.name} />
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-4xl text-forest">Timeline milestone</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Ketuk setiap tahap untuk melihat laporan lapangan terkait. Status: pending, berjalan, atau selesai.
        </p>
        <div className="mt-8">
          <MilestoneTimeline milestones={milestones} updates={progressUpdates} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-4xl text-forest">Transparansi arus kas</h2>
        <p className="mt-2 text-sm text-muted">Dana masuk dari wakif versus pengeluaran bernota nazhir.</p>
        <div className="mt-6">
          <CashflowPanel
            collected={project.collectedAmount}
            expenses={expenseTotal}
            transactions={transactions}
            logs={financialLogs}
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl text-forest">Jurnal progres</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {progressUpdates.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-forest/10 bg-white">
              {item.imageUrls?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrls[0]} alt="" className="h-48 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <p className="text-xs text-muted">{formatDate(item.createdAt)}</p>
                <h3 className="mt-1 font-display text-2xl text-forest">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
