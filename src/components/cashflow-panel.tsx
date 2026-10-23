import type { FinancialLog, Transaction } from "@/db/schema";
import { displayDonorName } from "@/lib/certificates";
import { formatDateShort, formatRupiah } from "@/lib/format";

export function CashflowPanel({
  collected,
  expenses,
  transactions,
  logs,
}: {
  collected: number;
  expenses: number;
  transactions: Transaction[];
  logs: FinancialLog[];
}) {
  const saldo = collected - expenses;
  const max = Math.max(collected, expenses, 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Dana masuk" value={formatRupiah(collected)} />
        <MiniStat label="Pengeluaran" value={formatRupiah(expenses)} />
        <MiniStat label="Saldo proyek" value={formatRupiah(saldo)} />
      </div>
      <div className="space-y-2">
        <Bar label="Masuk" value={collected} max={max} className="bg-leaf" />
        <Bar label="Keluar" value={expenses} max={max} className="bg-gold" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="font-display text-xl text-forest">Wakif terbaru</h4>
          <ul className="mt-3 divide-y divide-sand">
            {transactions.slice(0, 6).map((tx) => (
              <li key={tx.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted">{displayDonorName(tx.donorName, tx.isAnonymous)}</span>
                <span className="tabular font-semibold text-forest">{formatRupiah(tx.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl text-forest">Pengeluaran bernota</h4>
          <ul className="mt-3 space-y-3">
            {logs.slice(0, 6).map((log) => (
              <li key={log.id} className="flex gap-3 rounded-2xl border border-forest/10 bg-white p-3">
                {log.receiptUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={log.receiptUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-mint text-xs text-leaf">Nota</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-forest">{log.title}</p>
                  <p className="text-xs text-muted">{formatDateShort(log.expenseDate)}</p>
                </div>
                <p className="tabular text-sm font-semibold text-forest">{formatRupiah(log.amount)}</p>
              </li>
            ))}
            {logs.length === 0 ? <p className="text-sm text-muted">Belum ada pengeluaran.</p> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl tabular text-forest">{value}</p>
    </div>
  );
}

function Bar({ label, value, max, className }: { label: string; value: number; max: number; className: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular">{formatRupiah(value)}</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${className}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}
