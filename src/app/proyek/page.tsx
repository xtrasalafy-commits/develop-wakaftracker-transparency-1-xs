import type { Metadata } from "next";
import { ProjectCatalog } from "@/components/project-catalog";
import { listProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "Katalog Proyek Wakaf" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Katalog</p>
      <h1 className="mt-2 font-display text-5xl text-forest">Proyek wakaf terbuka</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Dual progress bar pada setiap kartu: kiri-atas pendanaan, bawahnya progres fisik. Pilih proyek, telusuri
        milestone, lalu tunaikan wakaf.
      </p>
      <div className="mt-8">
        <ProjectCatalog projects={projects} />
      </div>
    </main>
  );
}
