import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateArt } from "@/components/certificate-art";
import { PrintButton } from "@/components/print-button";
import { getCertificate } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return { title: `Sertifikat ${code}` };
}

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getCertificate(decodeURIComponent(code));
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/wakif" className="text-sm font-semibold text-leaf">
          ← Portal wakif
        </Link>
        <PrintButton />
      </div>
      <CertificateArt transaction={data.transaction} project={data.project} />
      <p className="no-print mt-6 text-center text-sm text-muted">
        Kode ini dapat diverifikasi secara publik. Simpan atau cetak sebagai bukti wakaf.
      </p>
    </main>
  );
}
