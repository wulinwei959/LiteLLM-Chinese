"use client";

import { useNow } from "../../../../hooks/useNow";
import { durationLabel, money, scopeLabel, sourceLabels } from "../../model/format";
import { nextCheckStatus } from "../../model/status";
import { type Lens } from "../../model/types";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export function InvestigationSummary({ lens }: { lens: Lens }) {
  const t = useLensTranslate();
  const now = useNow(15000);
  const { settings } = lens;
  const month = new Date(now).toISOString().slice(0, 7);
  const spent = lens.budget_month === month ? lens.spent ?? 0 : 0;
  const reserved = (lens.reservations ?? [])
    .filter((hold) => hold.month === month)
    .filter((hold) => !hold.expires_at || Date.parse(hold.expires_at) > now)
    .reduce((sum, hold) => sum + hold.amount, 0);
  const parts = [
    scopeLabel(settings),
    settings.enabled ? t("investigations.everyValue0", { value0: durationLabel(settings.interval_minutes) }) : t("investigations.oneOff"),
    nextCheckStatus(lens, now),
    t("investigations.value0Value1Month", { value0: money(spent), value1: money(settings.monthly_budget ?? 100) }),
    reserved > 0 &&
      t("investigations.value0ReservedActiveRequests", { value0: money(reserved), value1: money(Math.max(0, settings.monthly_budget - spent - reserved)) }),
  ].filter(Boolean);
  return (
    <p className="mt-1 text-xs text-muted-foreground">
      {sourceLabels[settings.source ?? "traces"]}
      {parts.map((part) => ` · ${part}`)}
    </p>
  );
}
