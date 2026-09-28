import { formatBudgetReset } from "@/utils/budgetUtils";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useMyTeamMember } from "./useMyTeamMember";

interface MyUserTabProps {
  teamId: string;
}

const labelWithTooltip = (label: string, tooltip: string, ariaLabel: string) => (
  <span className="flex items-center gap-1 text-muted-foreground">
    {label}
    <SimpleTooltip content={tooltip}>
      <CircleHelp className="size-4" aria-label={ariaLabel} />
    </SimpleTooltip>
  </span>
);

const formatNumber = (value: number | null | undefined, digits = 4): string => {
  if (value === null || value === undefined) return "0";
  return formatNumberWithCommas(value, digits);
};

const formatRateLimit = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "Unlimited";
  return formatNumberWithCommas(value, 0);
};

export default function MyUserTab({ teamId }: MyUserTabProps) {
  const t = useTranslations("teams");
  const { data, isLoading, error } = useMyTeamMember(teamId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-muted-foreground">{t("member.loadingMembership")}</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-destructive">
          {error instanceof Error ? error.message : t("member.membershipLoadFailed")}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-muted-foreground">{t("member.noMembership")}</CardContent>
      </Card>
    );
  }

  const budgetTable = data.litellm_budget_table ?? null;
  const maxBudget = budgetTable?.max_budget ?? null;
  const spend = data.spend ?? 0;
  const totalSpend = data.total_spend ?? 0;
  const tpmLimit = budgetTable?.tpm_limit ?? null;
  const rpmLimit = budgetTable?.rpm_limit ?? null;
  const budgetReset = formatBudgetReset(budgetTable?.budget_reset_at);
  const allowedModels = budgetTable?.allowed_models ?? null;

  return (
    <div className="flex w-full flex-col gap-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <span className="text-muted-foreground">{t("member.user")}</span>
              <div className="mt-1 font-semibold">{data.user_email || data.user_id}</div>
              <span className="font-mono text-xs text-muted-foreground">{data.user_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("member.teamRole")}</span>
              <div className="mt-1">
                <Badge variant={data.role === "admin" ? "default" : "secondary"}>{data.role || "user"}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            {labelWithTooltip(
              t("member.currentCycleSpend"),
              t("member.myCurrentCycleSpendTooltip"),
              t("member.myCurrentCycleSpendInfoAria"),
            )}
            <div className="mt-2">
              <h3 className="text-2xl font-semibold">${formatNumber(spend, 4)}</h3>
              <span className="text-muted-foreground">
                {t("member.ofAmount", {
                  amount: maxBudget === null ? t("member.unlimited") : `$${formatNumber(maxBudget, 4)}`,
                })}
              </span>
            </div>
            {budgetReset && (
              <div className="mt-1 text-muted-foreground">{t("member.resetsAt", { date: budgetReset })}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {labelWithTooltip(
              t("member.rateLimits"),
              t("member.myRateLimitsTooltip"),
              t("member.myRateLimitsInfoAria"),
            )}
            <div className="mt-2">
              <span>TPM: {formatRateLimit(tpmLimit)}</span>
              <br />
              <span>RPM: {formatRateLimit(rpmLimit)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {labelWithTooltip(
              t("member.totalSpend"),
              t("member.myTotalSpendTooltip"),
              t("member.myTotalSpendInfoAria"),
            )}
            <h4 className="mt-2 text-xl font-semibold">${formatNumber(totalSpend, 4)}</h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {labelWithTooltip(
              t("member.modelScope"),
              t("member.myModelScopeTooltip"),
              t("member.myModelScopeInfoAria"),
            )}
            <div className="mt-2">
              {allowedModels && allowedModels.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {allowedModels.map((m) => (
                    <Badge key={m} variant="secondary">
                      {m}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span>{t("member.allTeamModels")}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
