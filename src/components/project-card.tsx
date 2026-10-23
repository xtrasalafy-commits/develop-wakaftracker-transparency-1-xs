import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Project } from "@/db/schema";
import { DualProgress } from "@/components/dual-progress";
import { PROJECT_STATUS_LABEL } from "@/lib/constants";
import { formatCompactRupiah } from "@/lib/format";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_18px_40px_rgba(6,36,28,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(6,36,28,0.12)]">
      <Link href={`/proyek/${project.id}`} className="relative block aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-forest-deep/70 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-semibold tracking-wide text-forest">
          {project.category}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-forest/80 px-3 py-1 text-[11px] font-medium text-gold-soft">
          {PROJECT_STATUS_LABEL[project.status] ?? project.status}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="inline-flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {project.location}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-forest">
          <Link href={`/proyek/${project.id}`} className="hover:text-leaf">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
        <div className="mt-5">
          <DualProgress
            collected={project.collectedAmount}
            target={project.targetAmount}
            physical={project.physicalProgress}
            compact
          />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-sand pt-4 text-sm">
          <span className="text-muted">
            Target <span className="tabular font-semibold text-forest">{formatCompactRupiah(project.targetAmount)}</span>
          </span>
          <Link href={`/proyek/${project.id}`} className="font-semibold text-leaf hover:text-forest">
            Lihat detail →
          </Link>
        </div>
      </div>
    </article>
  );
}
