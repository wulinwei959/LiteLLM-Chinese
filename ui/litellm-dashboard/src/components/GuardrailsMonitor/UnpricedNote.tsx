import React from "react";
import { useTranslations } from "next-intl";
import { pricingIssueUrl, totalUnits, type UsageUnits } from "./usageUnits";

export function UnpricedNote({ unpriced, provider }: { unpriced: UsageUnits; provider?: string }) {
  const t = useTranslations("guardrailsMonitor");
  const total = totalUnits(unpriced);
  if (total === 0) return null;
  return (
    <p className="text-xs text-warning">
      {t("unpriced.body", { count: total })}{" "}
      <a
        href={pricingIssueUrl(unpriced, provider)}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        {t("unpriced.link")}
      </a>
    </p>
  );
}
