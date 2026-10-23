import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExpenseForm } from "@/components/admin/expense-form";
import { MilestoneManager } from "@/components/admin/milestone-manager";
import { ProgressForm } from "@/components/admin/progress-form";
import { ProjectForm } from "@/components/admin/project-form";
import { DualProgress } from "@/components/dual-progress";
import { formatRupiah } from "@/lib/format";
import { getProjectDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(Number(id));
  return { title: detail ? `Kelola ${detail.project.title}` : "Kelola proyek" };
}

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getProjectDetail(Number(id));
  if (!detail) notFound();
  const { project, milestones, financialLogs, progressUpdates, expenseTotal, transactions } = detail;

  return (
    <div className="space-y-12">
      <div className="rounded-3xl border border-forest/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted">{project.category}</p>
            <h2 className="font-display text-4xl text-forest">{project.title}</h2>
            <Link href={`/proyek/${project.id}`} className="text-sm font-semibold text-leaf">
              Lihat halaman publik →
            </Link>
          </div>
          <p className="text-sm text-muted">
            {transactions.length} wakif · pengeluaran {formatRupiah(expenseTotal)}
          </p>
        </div>
        <div className="mt-6 max-w-xl">
          <DualProgress
            collected={project.collectedAmount}
            target={project.targetAmount}
            physical={project.physicalProgress}
          />
        </div>
      </div>

      <section>
        <h3 className="mb-4 font-display text-3xl text-forest">Data proyek</h3>
        <ProjectForm project={project} />
      </section>

      <section>
        <h3 className="mb-4 font-display text-3xl text-forest">Milestone fisik</h3>
        <MilestoneManager projectId={project.id} milestones={milestones} />
      </section>

      <section>
        <h3 className="mb-4 font-display text-3xl text-forest">Log pengeluaran</h3>
        <ExpenseForm projectId={project.id} logs={financialLogs} />
      </section>

      <section>
        <h3 className="mb-4 font-display text-3xl text-forest">Logger progres & siaran wakif</h3>
        <ProgressForm
          projectId={project.id}
          milestones={milestones}
          updates={progressUpdates}
          physicalProgress={project.physicalProgress}
        />
      </section>
    </div>
  );
}
