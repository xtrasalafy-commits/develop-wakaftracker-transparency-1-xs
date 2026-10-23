import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "Proyek Baru" };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-3xl text-forest">Tambah proyek wakaf</h2>
      <p className="mt-1 mb-6 text-sm text-muted">Lengkapi data publik. Milestone dan arus kas bisa disusun setelah proyek terbit.</p>
      <ProjectForm />
    </div>
  );
}
