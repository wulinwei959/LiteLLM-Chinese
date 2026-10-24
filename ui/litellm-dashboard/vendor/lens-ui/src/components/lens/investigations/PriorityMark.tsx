import { cn } from "../../../lib/cva.config";
import type { Priority } from "../model/inbox";
import { useLensTranslate } from "../../../host/useLensTranslate";
import { lensTranslate } from "../../../host/lensTranslate";

export const PRIORITY_ORDER: readonly Priority[] = ["high", "medium", "low"];

export const PRIORITY_LABEL: Readonly<Record<Priority, string>> = {
  get high() { return lensTranslate("investigations.high"); },
  get medium() { return lensTranslate("investigations.medium"); },
  get low() { return lensTranslate("investigations.low"); },
};

const DOT: Readonly<Record<Priority, string>> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/60",
};

const PILL: Readonly<Record<Priority, string>> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/12 text-warning",
  low: "bg-muted text-muted-foreground",
};

export function PriorityDot({ priority, className }: { priority: Priority; className?: string }) {
  return <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", DOT[priority], className)} />;
}

export function PriorityPill({ priority }: { priority: Priority }) {
  const t = useLensTranslate();
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        PILL[priority],
      )}
    >
      <PriorityDot priority={priority} />
      {t("investigations.value0Priority", { value0: PRIORITY_LABEL[priority] })}</span>
  );
}
