"use client";

import { useMemo, useState } from "react";
import { Check, CircleDot, Clock } from "lucide-react";
import type { Milestone, ProgressUpdate } from "@/db/schema";
import { MILESTONE_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MilestoneTimeline({
  milestones,
  updates,
}: {
  milestones: Milestone[];
  updates: ProgressUpdate[];
}) {
  const [openId, setOpenId] = useState<number | null>(milestones.find((m) => m.status === "IN_PROGRESS")?.id ?? null);

  const grouped = useMemo(() => {
    const map = new Map<number, ProgressUpdate[]>();
    for (const update of updates) {
      if (!update.milestoneId) continue;
      const list = map.get(update.milestoneId) ?? [];
      list.push(update);
      map.set(update.milestoneId, list);
    }
    return map;
  }, [updates]);

  if (milestones.length === 0) {
    return <p className="text-sm text-muted">Belum ada tahapan fisik yang disusun nazhir.</p>;
  }

  return (
    <ol className="relative space-y-0">
      {milestones.map((item, index) => {
        const related = grouped.get(item.id) ?? [];
        const open = openId === item.id;
        return (
          <li key={item.id} className="relative grid grid-cols-[28px_1fr] gap-4 pb-8">
            {index < milestones.length - 1 ? (
              <span className="absolute top-7 left-[13px] h-[calc(100%-12px)] w-px bg-sand" />
            ) : null}
            <span
              className={cn(
                "relative z-10 mt-1 grid h-7 w-7 place-items-center rounded-full border",
                item.status === "COMPLETED" && "border-leaf bg-leaf text-white",
                item.status === "IN_PROGRESS" && "border-gold bg-gold text-forest-deep",
                item.status === "PENDING" && "border-sand bg-ivory text-muted",
              )}
            >
              {item.status === "COMPLETED" ? <Check className="h-3.5 w-3.5" /> : null}
              {item.status === "IN_PROGRESS" ? <CircleDot className="h-3.5 w-3.5" /> : null}
              {item.status === "PENDING" ? <Clock className="h-3.5 w-3.5" /> : null}
            </span>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="rounded-2xl border border-forest/10 bg-white p-4 text-left transition hover:border-gold/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xl text-forest">{item.title}</p>
                <span className="rounded-full bg-mint px-2.5 py-0.5 text-[11px] font-semibold text-leaf">
                  {MILESTONE_STATUS_LABEL[item.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Target: {formatDate(item.targetCompletionDate)}</p>
              {item.description ? <p className="mt-2 text-sm text-muted">{item.description}</p> : null}
              {open && related.length > 0 ? (
                <div className="mt-4 space-y-3 border-t border-sand pt-3">
                  {related.map((update) => (
                    <div key={update.id}>
                      <p className="text-sm font-semibold text-forest">{update.title}</p>
                      <p className="text-sm text-muted">{update.description}</p>
                    </div>
                  ))}
                </div>
              ) : related.length > 0 ? (
                <p className="mt-3 text-xs font-medium text-leaf">{related.length} laporan terkait — ketuk untuk buka</p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
