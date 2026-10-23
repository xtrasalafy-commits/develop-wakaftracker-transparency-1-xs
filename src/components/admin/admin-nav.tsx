"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutDashboard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/proyek", label: "Proyek", icon: FolderKanban },
  { href: "/admin/proyek/baru", label: "Proyek baru", icon: Plus },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap",
              active ? "bg-forest text-ivory" : "bg-white text-muted hover:bg-mint",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
