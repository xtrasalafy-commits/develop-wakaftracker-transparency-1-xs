import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full border",
          light
            ? "border-gold/70 bg-forest-deep text-gold-soft"
            : "border-gold bg-forest text-gold-soft",
        )}
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path
            d="M16 4c3.2 4.2 8 6.4 8 11.2A8 8 0 1 1 8 15.2C8 10.4 12.8 8.2 16 4Z"
            fill="currentColor"
            opacity="0.9"
          />
          <rect x="15" y="18" width="2" height="9" rx="1" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={cn("block font-display text-lg font-semibold tracking-tight", light ? "text-ivory" : "text-forest")}>
          WakafTracker
        </span>
        <span className={cn("block text-[10px] uppercase tracking-[0.22em]", light ? "text-gold-soft" : "text-muted")}>
          Amanah · Transparan
        </span>
      </span>
    </span>
  );
}
