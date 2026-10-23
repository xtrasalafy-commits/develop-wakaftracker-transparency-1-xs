import type { Metadata } from "next";
import Link from "next/link";
import { ProjectStatusBadge } from "@/components/status-badge";
import { formatCompactRupiah } from "@/lib/format";
import { listProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "Manajemen Proyek" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/admin/proyek/${project.id}`}
          className="flex flex-col gap-3 rounded-3xl border border-forest/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <span className="text-xs text-muted">{project.category}</span>
            </div>
            <h2 className="mt-2 font-display text-2xl text-forest">{project.title}</h2>
            <p className="text-sm text-muted">{project.location}</p>
          </div>
          <div className="text-sm text-muted">
            <p>
              Target <span className="tabular font-semibold text-forest">{formatCompactRupiah(project.targetAmount)}</span>
            </p>
            <p>
              Fisik <span className="tabular font-semibold text-forest">{project.physicalProgress}%</span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
