import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FloatingTrakteerWidget } from "@/components/trakteer/floating-widget";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/ensure-seed";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WakafTracker — Transparansi Wakaf, Amanah Terjaga",
    template: "%s · WakafTracker",
  },
  description:
    "Dashboard transparansi dan laporan proyek wakaf untuk nazhir dan wakif. Dual progress pendanaan dan fisik, arus kas bernota, e-sertifikat digital.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureSeed();
  const user = await getCurrentUser();

  return (
    <html lang="id">
      <body className="antialiased">
        <SiteHeader user={user} />
        {children}
        <FloatingTrakteerWidget />
        <SiteFooter />
      </body>
    </html>
  );
}
