"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Project } from "@/db/schema";
import { ProjectCard } from "@/components/project-card";
import { CATEGORIES, PROJECT_STATUS_LABEL } from "@/lib/constants";

export function ProjectCatalog({ projects }: { projects: Project[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const hay = `${project.title} ${project.location} ${project.description}`.toLowerCase();
      const matchQ = !q.trim() || hay.includes(q.toLowerCase());
      const matchCat = category === "Semua" || project.category === category;
      const matchStatus = status === "Semua" || project.status === status;
      return matchQ && matchCat && matchStatus;
    });
  }, [projects, q, category, status]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-3xl border border-forest/10 bg-white p-4 sm:p-5">
        <label className="relative block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari masjid, sumur, sekolah..."
            className="w-full rounded-2xl border border-forest/10 bg-ivory py-3 pr-4 pl-10 text-sm outline-none focus:border-gold"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {["Semua", ...CATEGORIES].map((item) => (
            <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
              {item}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["Semua", ...Object.keys(PROJECT_STATUS_LABEL)].map((item) => (
            <Chip key={item} active={status === item} onClick={() => setStatus(item)}>
              {item === "Semua" ? "Semua status" : PROJECT_STATUS_LABEL[item]}
            </Chip>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">{filtered.length} proyek ditampilkan</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-muted">Tidak ada proyek yang cocok dengan filter.</p>
      ) : null}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        active ? "bg-forest text-ivory" : "bg-ivory text-muted hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}
