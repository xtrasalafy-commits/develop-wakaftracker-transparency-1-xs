import type { Metadata } from "next";
import Link from "next/link";
import { ProjectStatusBadge } from "@/components/status-badge";
import { formatCompactRupiah, formatRupiah } from "@/lib/format";
import { getDashboardStats, listProjects } from "@/lib/queries";
import { fundingPercent } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard Nazhir" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [stats, projects] = await Promise.all([getDashboardStats(), listProjects()]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Dana masuk" value={formatCompactRupiah(stats.collected)} />
        <Kpi label="Pengeluaran" value={formatCompactRupiah(stats.expenseTotal)} />
        <Kpi label="Saldo kas" value={formatCompactRupiah(stats.collected - stats.expenseTotal)} />
        <Kpi label="Jumlah proyek" value={String(stats.projectCount)} />
      </div>
      <div className="mt-10 overflow-hidden rounded-3xl border border-forest/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs uppercase tracking-wider text-leaf">
            <tr>
              <th className="px-4 py-3">Proyek</th>
              <th className="px-4 py-3">Dana</th>
              <th className="px-4 py-3">Fisik</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-sand">
                <td className="px-4 py-3">
                  <p className="font-semibold text-forest">{project.title}</p>
                  <p className="text-xs text-muted">{project.location}</p>
                </td>
                <td className="px-4 py-3 tabular">
                  {fundingPercent(project.collectedAmount, project.targetAmount)}%
                  <p className="text-xs text-muted">{formatRupiah(project.collectedAmount)}</p>
                </td>
                <td className="px-4 py-3 tabular">{project.physicalProgress}%</td>
                <td className="px-4 py-3">
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/proyek/${project.id}`} className="font-semibold text-leaf">
                    Kelola
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl tabular text-forest">{value}</p>
    </div>
  );
}
