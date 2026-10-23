import { MILESTONE_STATUS_LABEL, PROJECT_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ProjectStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-semibold",
        status === "COMPLETED" && "bg-mint text-leaf",
        status === "IN_PROGRESS" && "bg-gold/20 text-forest",
        status === "FUNDRAISING" && "bg-sand text-forest",
        status === "PAUSED" && "bg-stone-200 text-muted",
      )}
    >
      {PROJECT_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function MilestoneStatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-mint px-2.5 py-0.5 text-[11px] font-semibold text-leaf">
      {MILESTONE_STATUS_LABEL[status] ?? status}
    </span>
  );
}
