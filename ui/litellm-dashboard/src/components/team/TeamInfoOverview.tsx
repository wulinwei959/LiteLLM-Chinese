"use client";

import { formatNumberWithCommas } from "@/utils/dataUtils";
import { modelGroupHref, modelOrAccessGroupHref } from "@/utils/entityLinks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { StatusBadge, type StatusTone } from "@/components/shared/table_cells/status_badge";
import React from "react";
import { useTranslations } from "next-intl";

import { ObjectPermissionsView } from "../object_permissions_view";
import { GuardrailSettingsView } from "../GuardrailSettingsView";
import { LoggingSettingsView } from "../logging_settings_view";
import { computeTeamModelBadges } from "./teamModelAccess";

interface TeamInfoOverviewProps {
  readonly info: any;
  readonly teamData: any;
  readonly t: ReturnType<typeof useTranslations>;
  readonly canViewPolicies: boolean;
  readonly globalGuardrailNames: ReadonlySet<string>;
  readonly initialKillSwitchOn: boolean;
  readonly inheritedMcpServers: any[];
  readonly inheritedAgents: any[];
  readonly inheritedSkills: any[];
  readonly policiesList: string[];
  readonly policyGuardrails: Record<string, string[]>;
  readonly loadingPolicies: boolean;
  readonly accessGroupNames: ReadonlySet<string> | undefined;
  readonly accessToken: string | null;
}

const TEAM_MODEL_BADGE_TONES: Record<string, StatusTone> = {
  "all-proxy": "error",
  "no-default": "neutral",
  direct: "info",
  "access-group": "success",
};

const teamModelBadgeHref = (
  badge: { kind: string; label: string; tooltip: string },
  accessGroupNames: ReadonlySet<string> | undefined,
): string | undefined => {
  if (badge.kind === "direct") return modelOrAccessGroupHref(badge.label, accessGroupNames);
  if (badge.kind === "access-group") return modelGroupHref(badge.label);
  return undefined;
};

function ModelBadgesRow(props: {
  models: string[];
  accessGroupModels: string[];
  accessGroupDetails: any[];
  t: ReturnType<typeof useTranslations>;
  accessGroupNames: ReadonlySet<string> | undefined;
}) {
  const badges = computeTeamModelBadges(props.models, props.accessGroupModels, props.accessGroupDetails, props.t);
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <SimpleTooltip key={`${badge.kind}-${badge.label}-${index}`} content={badge.tooltip}>
          <span>
            <StatusBadge
              tone={TEAM_MODEL_BADGE_TONES[badge.kind as keyof typeof TEAM_MODEL_BADGE_TONES]}
              label={badge.label}
              href={teamModelBadgeHref(badge, props.accessGroupNames)}
            />
          </span>
        </SimpleTooltip>
      ))}
    </div>
  );
}

function BudgetCard(props: { info: any; t: ReturnType<typeof useTranslations> }) {
  const { info, t } = props;
  return (
    <Card className="block p-6">
      <p>{t("infoBudgetStatus")}</p>
      <div className="mt-2">
        <h3 className="text-lg font-medium">{`$${formatNumberWithCommas(info.spend, 2)}`}</h3>
        <p>
          {t("infoOfBudget", {
            amount: info.max_budget === null ? t("infoUnlimited") : `$${formatNumberWithCommas(info.max_budget, 2)}`,
          })}
        </p>
        {info.budget_duration && (
          <p className="text-muted-foreground">{t("infoBudgetReset", { duration: info.budget_duration })}</p>
        )}
        <br />
        {info.team_member_budget_table && (
          <p className="text-muted-foreground">
            {t("infoTeamMemberBudgetValue", {
              amount: `$${formatNumberWithCommas(info.team_member_budget_table.max_budget, 2)}`,
            })}
          </p>
        )}
      </div>
    </Card>
  );
}

function RateLimitsCard(props: {
  info: any;
  t: ReturnType<typeof useTranslations>;
  accessGroupNames: ReadonlySet<string> | undefined;
}) {
  const { info, t, accessGroupNames } = props;
  return (
    <Card className="block p-6">
      <p>{t("infoRateLimits")}</p>
      <div className="mt-2">
        <p>{t("infoTpmValue", { value: info.tpm_limit ?? t("infoUnlimited") })}</p>
        <p>{t("infoRpmValue", { value: info.rpm_limit ?? t("infoUnlimited") })}</p>
        <p>{t("infoTpdBatchValue", { value: info.tpd_limit ?? t("infoUnlimited") })}</p>
        {info.max_parallel_requests && <p>{t("infoMaxParallelRequests", { count: info.max_parallel_requests })}</p>}
        <ModelBadgesRow
          models={info.models}
          accessGroupModels={info.access_group_models || []}
          accessGroupDetails={info.access_group_details}
          t={t}
          accessGroupNames={accessGroupNames}
        />
        <p>
          {t("estimatedOutputTokens.estimatedOutputTokensValue", {
            value: info.metadata?.default_estimated_output_tokens ?? t("infoDefault"),
          })}
        </p>
        <p>
          {t("estimatedOutputTokens.estimatedOutputTokensPerModelValue", {
            value: info.metadata?.default_estimated_output_tokens_per_model
              ? JSON.stringify(info.metadata.default_estimated_output_tokens_per_model)
              : t("infoDefault"),
          })}
        </p>
      </div>
    </Card>
  );
}

function RequestSettingsCard(props: { info: any; t: ReturnType<typeof useTranslations> }) {
  const { info, t } = props;
  return (
    <Card className="block p-6">
      <p>{t("infoRequestSettings")}</p>
      <div className="mt-2">
        <p>
          {t("infoRequireTraceId", {
            state: info.metadata?.require_trace_id === true ? t("infoEnabled") : t("infoDisabled"),
          })}
        </p>
      </div>
    </Card>
  );
}

function VirtualKeysCard(props: { info: any; teamData: any; t: ReturnType<typeof useTranslations> }) {
  const { info, teamData, t } = props;
  return (
    <Card className="block p-6">
      <p className="font-semibold text-foreground">{t("infoVirtualKeys")}</p>
      <div className="mt-2">
        <p>{t("infoUserKeys", { value: teamData.keys.filter((key: any) => key.user_id).length })}</p>
        <p>{t("infoServiceAccountKeys", { value: teamData.keys.filter((key: any) => !key.user_id).length })}</p>
        <p className="text-muted-foreground">{t("infoTotal", { value: teamData.keys.length })}</p>
      </div>
    </Card>
  );
}

function GuardrailsCard(props: {
  info: any;
  t: ReturnType<typeof useTranslations>;
  canViewPolicies: boolean;
  globalGuardrailNames: ReadonlySet<string>;
  initialKillSwitchOn: boolean;
  policyGuardrails: Record<string, string[]>;
  loadingPolicies: boolean;
}) {
  const { info, t, canViewPolicies, globalGuardrailNames, initialKillSwitchOn, policyGuardrails, loadingPolicies } =
    props;
  return (
    <>
      <ObjectPermissionsView
        objectPermission={info.object_permission}
        inheritedMcpServers={info.inheritedMcpServers}
        inheritedAgents={info.inheritedAgents}
        inheritedSkills={info.inheritedSkills}
        unresolvedAccessGroupIds={info.unresolved_access_group_ids}
        variant="card"
        accessToken={info.accessToken}
      />
      <Card className="block p-6">
        <GuardrailSettingsView
          globalGuardrailNames={new Set(globalGuardrailNames)}
          teamGuardrails={Array.isArray(info.metadata?.guardrails) ? info.metadata.guardrails : []}
          optedOutGlobalGuardrails={
            Array.isArray(info.metadata?.opted_out_global_guardrails) ? info.metadata.opted_out_global_guardrails : []
          }
          killSwitchOn={initialKillSwitchOn}
          variant="inline"
        />
      </Card>
      <Card className="block p-6">
        <p className="font-semibold text-foreground mb-3">{t("listPolicies")}</p>
        {info.policies && info.policies.length > 0 ? (
          <div className="space-y-4">
            {info.policies.map((policy: string, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{policy}</Badge>
                  {loadingPolicies && <p className="text-xs text-muted-foreground">{t("infoLoadingGuardrails")}</p>}
                </div>
                {!loadingPolicies && policyGuardrails[policy] && policyGuardrails[policy].length > 0 && (
                  <div className="ml-4 pl-3 border-l-2 border-border">
                    <p className="text-xs text-muted-foreground mb-1">{t("infoResolvedGuardrails")}</p>
                    <div className="flex flex-wrap gap-1">
                      {policyGuardrails[policy].map((guardrail: string, gIndex: number) => (
                        <Badge key={gIndex} variant="secondary">
                          {guardrail}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{t("infoNoPoliciesConfigured")}</p>
        )}
      </Card>
      <LoggingSettingsView loggingConfigs={info.metadata?.logging || []} disabledCallbacks={[]} variant="card" />
    </>
  );
}

export function TeamInfoOverview({
  info,
  teamData,
  t,
  canViewPolicies,
  globalGuardrailNames,
  initialKillSwitchOn,
  inheritedMcpServers,
  inheritedAgents,
  inheritedSkills,
  policiesList,
  policyGuardrails,
  loadingPolicies,
  accessGroupNames,
  accessToken,
}: TeamInfoOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BudgetCard info={info} t={t} />
      <RateLimitsCard info={info} t={t} accessGroupNames={accessGroupNames} />
      <RequestSettingsCard info={info} t={t} />
      <VirtualKeysCard info={info} teamData={teamData} t={t} />
      <GuardrailsCard
        info={{ ...info, inheritedMcpServers, inheritedAgents, inheritedSkills, accessToken }}
        t={t}
        canViewPolicies={canViewPolicies}
        globalGuardrailNames={globalGuardrailNames}
        initialKillSwitchOn={initialKillSwitchOn}
        policyGuardrails={policyGuardrails}
        loadingPolicies={loadingPolicies}
      />
    </div>
  );
}
