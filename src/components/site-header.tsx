"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import type { User } from "@/db/schema";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/proyek", label: "Katalog Proyek" },
  { href: "/tentang", label: "Tentang" },
];

export function SiteHeader({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const portalHref = user?.role === "ADMIN_NAZHIR" ? "/admin" : "/wakif";
  const portalLabel = user?.role === "ADMIN_NAZHIR" ? "Dashboard Nazhir" : "Portal Wakif";

  return (
    <header className="no-print sticky top-0 z-40 border-b border-forest/10 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition",
                pathname === link.href ? "text-forest" : "text-muted hover:text-forest",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={portalHref}
                className="rounded-full border border-forest/15 px-4 py-2 text-sm font-semibold text-forest hover:bg-mint"
              >
                {portalLabel}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="text-sm text-muted hover:text-forest" type="submit">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/masuk"
              className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-ivory hover:bg-forest-deep"
            >
              Masuk
            </Link>
          )}
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-forest/10 bg-ivory px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={portalHref} onClick={() => setOpen(false)} className="text-sm font-semibold text-leaf">
                  {portalLabel}
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="text-sm text-muted" type="submit">
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <Link href="/masuk" onClick={() => setOpen(false)} className="font-semibold text-leaf">
                Masuk
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
