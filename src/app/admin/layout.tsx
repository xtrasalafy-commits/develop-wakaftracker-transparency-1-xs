import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=/admin");
  if (user.role !== "ADMIN_NAZHIR") redirect("/wakif");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Dashboard nazhir</p>
      <h1 className="mt-2 font-display text-4xl text-forest">Kendali amanah · {user.name}</h1>
      <div className="mt-6">
        <AdminNav />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
