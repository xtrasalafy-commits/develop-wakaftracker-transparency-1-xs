import { formatRupiah } from "@/lib/format";
import { clampPercent, fundingPercent } from "@/lib/utils";

export function DualProgress({
  collected,
  target,
  physical,
  compact = false,
}: {
  collected: number;
  target: number;
  physical: number;
  compact?: boolean;
}) {
  const fund = fundingPercent(collected, target);
  const phys = clampPercent(physical);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <ProgressRow
        label="Pendanaan"
        value={fund}
        tone="gold"
        hint={compact ? undefined : `${formatRupiah(collected)} dari ${formatRupiah(target)}`}
      />
      <ProgressRow
        label="Progres fisik"
        value={phys}
        tone="leaf"
        hint={compact ? undefined : "Berdasarkan milestone lapangan"}
      />
    </div>
  );
}

function ProgressRow({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: number;
  tone: "gold" | "leaf";
  hint?: string;
}) {
  const fill = tone === "gold" ? "bg-gold" : "bg-leaf";

  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
          {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
        </div>
        <p className="font-display text-xl tabular text-forest">{value}%</p>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${fill}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
