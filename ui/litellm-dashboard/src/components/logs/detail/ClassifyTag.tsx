"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cva.config";
import { useTranslations } from "next-intl";

export const AUTOROUTER_CLASSIFIER_ORIGIN = "autorouter_classifier";

export function ClassifyTag({ origin, className }: { origin?: string | null; className?: string }) {
  const t = useTranslations("logs");

  if (origin !== AUTOROUTER_CLASSIFIER_ORIGIN) return null;
  return (
    <Badge
      variant="secondary"
      title={t("drawer.classifyTooltip")}
      className={cn("px-2 py-0 text-[10px] font-normal", className)}
    >
      {t("drawer.classify")}
    </Badge>
  );
}
