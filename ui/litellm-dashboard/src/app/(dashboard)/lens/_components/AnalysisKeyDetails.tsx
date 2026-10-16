"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { apiClient } from "@/components/networking";
import { Button } from "@/components/ui/button";
import type { LensTranslator } from "@/lib/i18n/translators";
import { runTime } from "./lensData";

const keyInfoFields = {
  key_alias: z.string().nullable().optional(),
  models: z.array(z.string()),
  max_budget: z.number().nullable(),
  budget_duration: z.string().nullable().optional(),
  rpm_limit: z.number().nullable().optional(),
  tpm_limit: z.number().nullable().optional(),
  expires: z.string().nullable().optional(),
  status: z.string().optional(),
};
const keyInfoSchema = z.object({ info: z.object(keyInfoFields) });

function budgetLabel(amount: number | null, duration: string | null | undefined, t: LensTranslator): string {
  if (amount === null) return t("noKeyBudget");
  const periods: Record<string, string> = {
    "1mo": t("periodMonth"),
    "30d": t("periodMonth"),
    "1d": t("periodDay"),
    "24h": t("periodDay"),
    "7d": t("periodWeek"),
    "1h": t("periodHour"),
  };
  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
  return duration
    ? t("budgetPerPeriod", { amount: dollars, period: periods[duration] ?? duration })
    : t("budgetTotal", { amount: dollars });
}

export function useAnalysisKeyInfo(accessToken: string, keyId?: string) {
  return useQuery({
    queryKey: ["lens-key-info", accessToken, keyId],
    enabled: !!keyId,
    queryFn: async () =>
      keyInfoSchema.parse(await apiClient.get("/key/info", { accessToken, query: { key: keyId } })).info,
  });
}

export function AnalysisKeyDetails({
  accessToken,
  keyId,
  showName = false,
}: {
  accessToken: string;
  keyId: string;
  showName?: boolean;
}) {
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const key = useAnalysisKeyInfo(accessToken, keyId);
  if (key.isLoading) return <p className="text-xs text-muted-foreground">{t("loadingKeyPermissions")}</p>;
  if (key.error || !key.data)
    return (
      <div role="alert" className="flex items-center gap-2 text-sm text-destructive">
        {t("couldNotLoadKeyPermissions")}
        <Button variant="ghost" size="sm" onClick={() => void key.refetch()}>
          {commonT("retry")}
        </Button>
      </div>
    );
  const info = key.data;
  return (
    <div className="space-y-2 text-sm">
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2">
        {showName && (
          <>
            <dt className="text-muted-foreground">{t("billingKey")}</dt>
            <dd className="break-words">{info.key_alias || t("assignedVirtualKey")}</dd>
          </>
        )}
        <dt className="text-muted-foreground">{t("models")}</dt>
        <dd className="break-words">{info.models.length ? info.models.join(", ") : t("allModels")}</dd>
        <dt className="text-muted-foreground">{t("keyLimit")}</dt>
        <dd>{budgetLabel(info.max_budget, info.budget_duration, t)}</dd>
      </dl>
      {info.status && info.status !== "active" && (
        <p role="alert" className="text-destructive">
          {t("thisKeyIsStatus", { status: info.status })}
        </p>
      )}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer">{t("otherLimits")}</summary>
        <div className="mt-2 space-y-1 leading-5">
          <p>{t("requestsPerMinute", { value: info.rpm_limit ?? t("noKeyLimit") })}</p>
          <p>{t("tokensPerMinute", { value: info.tpm_limit ?? t("noKeyLimit") })}</p>
          <p>{t("expires", { value: info.expires ? runTime(info.expires) : t("noExpiry") })}</p>
          <p>{t("otherLimitsNote")}</p>
        </div>
      </details>
    </div>
  );
}
