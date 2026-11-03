"use client";
import { useTranslations } from "next-intl";
import React, { type ComponentProps } from "react";
import { useWatch, type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input as UIInput } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { labelWithDocsHint, labelWithHint } from "@/components/shared/form/LabelWithHint";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { TagsInput } from "@/app/(dashboard)/guardrails/_components/content_filter/TagsInput";
import { ChevronDown, CircleMinus, Plus, Save } from "lucide-react";
import { isProxyAdminRole } from "@/utils/roles";
import { useOrganizations } from "@/app/(dashboard)/hooks/organizations/useOrganizations";
import type { GuardrailListItem } from "@/app/(dashboard)/hooks/guardrails/useGuardrails";
import GuardrailsSelect from "./GuardrailsSelect";
import { NEVER_RESETS_BUDGET_DURATION } from "../common_components/budget_duration_dropdown";
import BudgetDurationDropdown from "../common_components/budget_duration_dropdown";
import { ModelMaxBudget, ModelMaxBudgetField } from "../key_team_helpers/ModelMaxBudgetEditor";
import MetadataKeyValueFields from "../common_components/MetadataKeyValueFields";
import ModelAliasManager from "../common_components/ModelAliasManager";
import AgentSelector from "../agent_management/AgentSelector";
import PassThroughRoutesSelector from "../common_components/PassThroughRoutesSelector";
import MCPServerSelector from "../mcp_server_management/MCPServerSelector";
import MCPToolPermissions from "../mcp_server_management/MCPToolPermissions";
import { ModelSelect } from "../ModelSelect/ModelSelect";
import type { estimateTooltips } from "../templates/estimatedOutputTokens";
import NumericalInput from "../shared/numerical_input";
import VectorStoreSelector from "../vector_store_management/VectorStoreSelector";
import SearchToolSelector from "../search_tools/SearchToolSelector";
import SkillSelector from "../skills/SkillSelector";
import EditLoggingSettings from "./EditLoggingSettings";
import RouterSettingsAccordion, { RouterSettingsAccordionRef } from "../common_components/RouterSettingsAccordion";
import AccessGroupSelector from "../common_components/AccessGroupSelector";
import type { TeamData, TeamInfoRecord, TeamUpdateFormValues } from "./TeamInfo";

interface TeamEditSettingsFormProps {
  readonly form: UseFormReturn<TeamUpdateFormValues>;
  readonly teamId: string;
  readonly accessToken: string | null;
  readonly userRole: string;
  readonly info: TeamInfoRecord;
  readonly teamData: TeamData | null;
  readonly premiumUser: boolean;
  readonly is_proxy_admin: boolean;
  readonly canEditAsProxyAdmin: boolean;
  readonly canViewPolicies: boolean;
  readonly canEditTeamEstimates: boolean;
  readonly teamEstimateTooltip: ReturnType<typeof estimateTooltips>;
  readonly perModelLimitModels: string[];
  readonly policiesList: string[];
  readonly globalGuardrails: GuardrailListItem[];
  readonly otherGuardrails: GuardrailListItem[];
  readonly globalGuardrailNames: ReadonlySet<string>;
  readonly teamModelAliases: Record<string, string>;
  readonly setTeamModelAliases: (next: Record<string, string>) => void;
  readonly teamModelMaxBudget: ModelMaxBudget;
  readonly setTeamModelMaxBudget: (next: ModelMaxBudget) => void;
  readonly teamMemberModelMaxBudget: ModelMaxBudget;
  readonly setTeamMemberModelMaxBudget: (next: ModelMaxBudget) => void;
  readonly teamMemberSettingsOpen: boolean;
  readonly setTeamMemberSettingsOpen: (next: boolean) => void;
  readonly searchToolSettingsOpen: boolean;
  readonly setSearchToolSettingsOpen: (next: boolean) => void;
  readonly modelLimits: UseFieldArrayReturn<TeamUpdateFormValues, "modelLimits", "id">;
  readonly memberBudgetAlerts: UseFieldArrayReturn<TeamUpdateFormValues, "team_member_max_budget_alert_emails", "id">;
  readonly routerSettingsRef: React.RefObject<RouterSettingsAccordionRef | null>;
  readonly teamMetadataSchemaFields: ComponentProps<typeof MetadataKeyValueFields>["schemaFields"];
  readonly isTeamMetadataSchemaLoading: boolean;
  readonly isTeamSaving: boolean;
  readonly onCancelEdit: () => void;
  readonly onSubmit: (values: TeamUpdateFormValues) => void;
}

export const TeamEditSettingsForm: React.FC<TeamEditSettingsFormProps> = ({
  form,
  teamId,
  accessToken,
  userRole,
  info,
  teamData,
  premiumUser,
  is_proxy_admin,
  canEditAsProxyAdmin,
  canViewPolicies,
  canEditTeamEstimates,
  teamEstimateTooltip,
  perModelLimitModels,
  policiesList,
  globalGuardrails,
  otherGuardrails,
  globalGuardrailNames,
  teamModelAliases,
  setTeamModelAliases,
  teamModelMaxBudget,
  setTeamModelMaxBudget,
  teamMemberModelMaxBudget,
  setTeamMemberModelMaxBudget,
  teamMemberSettingsOpen,
  setTeamMemberSettingsOpen,
  searchToolSettingsOpen,
  setSearchToolSettingsOpen,
  modelLimits,
  memberBudgetAlerts,
  routerSettingsRef,
  teamMetadataSchemaFields,
  isTeamMetadataSchemaLoading,
  isTeamSaving,
  onCancelEdit,
  onSubmit,
}) => {
  const t = useTranslations("teams");
  const durationT = useTranslations("common.budgetDuration");
  const { fields: modelLimitRows, append: appendModelLimit, remove: removeModelLimit } = modelLimits;
  const {
    fields: memberBudgetAlertRows,
    append: appendMemberBudgetAlertRow,
    remove: removeMemberBudgetAlertRow,
  } = memberBudgetAlerts;
  const watchedModels = useWatch({ control: form.control, name: "models" });
  const killSwitchOn = useWatch({ control: form.control, name: "disable_global_guardrails" });
  const watchedMcpSelection = useWatch({ control: form.control, name: "mcp_servers_and_groups" });
  const watchedToolPermissions = useWatch({ control: form.control, name: "mcp_tool_permissions" });
  const { data: userOrganizations = [] } = useOrganizations();

  const applyKillSwitchToGuardrails = (checked: boolean) => {
    const current = form.getValues("guardrails") ?? [];
    const nonGlobals = current.filter((name) => !globalGuardrailNames.has(name));
    form.setValue("guardrails", checked ? nonGlobals : [...Array.from(globalGuardrailNames), ...nonGlobals]);
  };

  const passThroughRoutesLabel = (): React.ReactNode => {
    if (!premiumUser) {
      return labelWithHint(t("listAllowedPassThroughRoutes"), t("listAllowedPassThroughRoutesPremiumHint"));
    }
    if (!is_proxy_admin) {
      return labelWithHint(t("listAllowedPassThroughRoutes"), t("listAllowedPassThroughRoutesAdminHint"));
    }
    return t("listAllowedPassThroughRoutes");
  };

  return (
    <TooltipProvider>
      <form onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <FieldGroup>
          <FormField control={form.control} name="team_alias" label={t("infoTeamName")}>
            {({ ref, value, ...field }) => <UIInput {...field} ref={ref} value={value ?? ""} />}
          </FormField>

          <FormField control={form.control} name="models" label={t("models")} description={t("listModelsHint")}>
            {({ id, value, onChange }) => (
              <ModelSelect
                id={id}
                value={value ?? []}
                onChange={onChange}
                teamID={teamId}
                organizationID={teamData?.team_info?.organization_id || undefined}
                options={{
                  includeSpecialOptions: true,
                  includeUserModels: !teamData?.team_info?.organization_id,
                  showAllProxyModelsOverride: isProxyAdminRole(userRole) && !teamData?.team_info?.organization_id,
                }}
                context="team"
                dataTestId="models-select"
              />
            )}
          </FormField>

          <Field>
            <FieldLabel>{labelWithHint(t("listModelAliases"), t("infoModelAliasesHint"))}</FieldLabel>
            <ModelAliasManager
              accessToken={accessToken || ""}
              initialModelAliases={teamModelAliases}
              onAliasUpdate={setTeamModelAliases}
              showExampleConfig={false}
            />
          </Field>

          <FormField control={form.control} name="max_budget" label={t("listMaxBudgetUsd")}>
            {({ ref, value, ...field }) => (
              <NumericalInput {...field} ref={ref} value={value ?? ""} step={0.01} precision={2} />
            )}
          </FormField>

          <FormField control={form.control} name="soft_budget" label={t("infoSoftBudgetUsd")}>
            {({ ref, value, ...field }) => (
              <NumericalInput {...field} ref={ref} value={value ?? ""} step={0.01} precision={2} />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="soft_budget_alerting_emails"
            label={labelWithHint(t("infoSoftBudgetAlertingEmails"), t("infoSoftBudgetAlertingEmailsHint"))}
          >
            {({ ref, value, ...field }) => (
              <UIInput
                {...field}
                ref={ref}
                value={typeof value === "string" ? value : ""}
                placeholder={t("infoMemberEmailPlaceholder")}
              />
            )}
          </FormField>

          <Collapsible
            open={teamMemberSettingsOpen}
            onOpenChange={setTeamMemberSettingsOpen}
            className="mt-4 mb-4 overflow-hidden rounded-lg border"
          >
            <CollapsibleTrigger className="group/section flex w-full items-center justify-between px-4 py-3 text-left">
              <b>{t("infoTeamMemberSettings")}</b>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]/section:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-3">
              <p className="mb-4 text-xs text-muted-foreground">{t("infoMemberDefaultsHint")}</p>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="default_team_member_models"
                  label={labelWithHint(t("defaultMemberModelsLabel"), t("defaultMemberModelsHint"))}
                >
                  {({ id, value, onChange }) => (
                    <MultiSelect
                      id={id}
                      value={value ?? []}
                      onValueChange={onChange}
                      options={(watchedModels ?? info.models ?? []).map((model) => ({
                        label: model,
                        value: model,
                      }))}
                      placeholder={t("infoLeaveEmptyAllTeamModels")}
                    />
                  )}
                </FormField>
                <FormField
                  control={form.control}
                  name="team_member_budget"
                  label={labelWithHint(t("infoDefaultBudgetUsd"), t("infoDefaultBudgetUsdHint"))}
                >
                  {({ ref, value, ...field }) => (
                    <NumericalInput {...field} ref={ref} value={value ?? ""} step={0.01} precision={2} />
                  )}
                </FormField>
                <FormField
                  control={form.control}
                  name="team_member_budget_duration"
                  label={t("infoDefaultBudgetDuration")}
                >
                  {({ id, value, onChange }) => (
                    <BudgetDurationDropdown
                      id={id}
                      showNeverResets
                      placeholder={t("infoInheritTeamResetPeriod")}
                      value={value === null ? NEVER_RESETS_BUDGET_DURATION : value}
                      onChange={(next) => onChange(next === NEVER_RESETS_BUDGET_DURATION ? null : next ?? undefined)}
                    />
                  )}
                </FormField>
                <ModelMaxBudgetField
                  label={t("infoDefaultPerModelBudgetLabel")}
                  premiumUser={premiumUser}
                  value={teamMemberModelMaxBudget}
                  onChange={setTeamMemberModelMaxBudget}
                  availableModels={perModelLimitModels}
                  hint={t("infoDefaultPerModelBudgetHint")}
                />
                <FormField
                  control={form.control}
                  name="team_member_key_duration"
                  label={labelWithHint(t("infoDefaultKeyDuration"), t("listTeamMemberKeyDurationHint"))}
                >
                  {({ ref, value, ...field }) => (
                    <UIInput
                      {...field}
                      ref={ref}
                      value={value ?? ""}
                      placeholder={t("listTeamMemberKeyDurationPlaceholder")}
                    />
                  )}
                </FormField>
                <FormField
                  control={form.control}
                  name="team_member_tpm_limit"
                  label={labelWithHint(t("infoDefaultTpmLimit"), t("infoDefaultTpmLimitHint"))}
                >
                  {({ ref, value, ...field }) => (
                    <NumericalInput
                      {...field}
                      ref={ref}
                      value={value ?? ""}
                      step={1}
                      placeholder={t("infoPlaceholderEg1000")}
                    />
                  )}
                </FormField>
                <FormField
                  control={form.control}
                  name="team_member_rpm_limit"
                  label={labelWithHint(t("infoDefaultRpmLimit"), t("infoDefaultRpmLimitHint"))}
                >
                  {({ ref, value, ...field }) => (
                    <NumericalInput
                      {...field}
                      ref={ref}
                      value={value ?? ""}
                      step={1}
                      placeholder={t("infoPlaceholderEg100")}
                    />
                  )}
                </FormField>
                <Field>
                  <FieldLabel>
                    {labelWithHint(
                      t("infoBudgetAlertThresholds"),
                      "Email each member when their spend reaches a percentage of their team member budget. The member is always notified; add comma-separated addresses to notify others as well. Requires email alerting to be configured on the proxy.",
                    )}
                  </FieldLabel>
                  {memberBudgetAlertRows.map((row, index) => (
                    <div key={row.id} className="mb-2 flex items-start gap-2">
                      <FormField
                        control={form.control}
                        name={`team_member_max_budget_alert_emails.${index}.threshold`}
                        className="w-32"
                      >
                        {({ ref, value, onChange, ...field }) => (
                          <NumericalInput
                            {...field}
                            ref={ref}
                            value={value ?? ""}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              onChange(event.target.value === "" ? null : Number(event.target.value))
                            }
                            placeholder={t("infoPlaceholderPercentOfBudget")}
                            min={1}
                            max={100}
                            step={1}
                          />
                        )}
                      </FormField>
                      <FormField
                        control={form.control}
                        name={`team_member_max_budget_alert_emails.${index}.emails`}
                        className="flex-1"
                      >
                        {({ ref, value, ...field }) => (
                          <UIInput
                            {...field}
                            ref={ref}
                            value={value ?? ""}
                            placeholder={t("infoPlaceholderAdditionalRecipients")}
                          />
                        )}
                      </FormField>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={t("infoRemoveBudgetAlertThreshold")}
                        className="mt-1 text-destructive"
                        onClick={() => removeMemberBudgetAlertRow(index)}
                      >
                        <CircleMinus className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => appendMemberBudgetAlertRow({ threshold: null, emails: "" })}
                  >
                    <Plus className="size-4" />
                    {t("infoAddBudgetAlertThreshold")}
                  </Button>
                </Field>
              </FieldGroup>
            </CollapsibleContent>
          </Collapsible>

          <FormField control={form.control} name="budget_duration" label={t("listResetBudget")}>
            {({ id, value, onChange }) => (
              <BudgetDurationDropdown
                id={id}
                placeholder={durationT("neverResets")}
                value={value}
                onChange={(next) => onChange(next ?? null)}
              />
            )}
          </FormField>

          <ModelMaxBudgetField
            premiumUser={premiumUser}
            value={teamModelMaxBudget}
            onChange={setTeamModelMaxBudget}
            availableModels={perModelLimitModels}
            usage={info.model_max_budget_usage}
            hint={t("listModelMaxBudgetHint")}
          />

          <FormField control={form.control} name="tpm_limit" label={t("infoTpmLimitLabel")}>
            {({ ref, value, ...field }) => <NumericalInput {...field} ref={ref} value={value ?? ""} step={1} />}
          </FormField>

          <FormField control={form.control} name="rpm_limit" label={t("listRpmLimit")}>
            {({ ref, value, ...field }) => <NumericalInput {...field} ref={ref} value={value ?? ""} step={1} />}
          </FormField>

          <FormField
            control={form.control}
            name="tpd_limit"
            label={labelWithHint(t("listTpdLimit"), t("listTpdLimitHint"))}
          >
            {({ ref, value, ...field }) => <NumericalInput {...field} ref={ref} value={value ?? ""} step={1} />}
          </FormField>

          <Field>
            <FieldLabel>{t("listMetadata")}</FieldLabel>
            <MetadataKeyValueFields
              control={form.control}
              getValues={form.getValues}
              name="metadata"
              schemaFields={teamMetadataSchemaFields}
              schemaLoading={isTeamMetadataSchemaLoading}
            />
            <FieldDescription>{t("infoMetadataDescription", { example: '{"region": "us"}' })}</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>
              {labelWithHint(t("infoModelSpecificRateLimits"), t("infoModelSpecificRateLimitsHint"))}
            </FieldLabel>
            {modelLimitRows.map((row, index) => (
              <div key={row.id} className="mb-2 flex items-start gap-2">
                <FormField control={form.control} name={`modelLimits.${index}.model`} className="min-w-60">
                  {({ id, value, onChange }) => (
                    <SearchSelect
                      inputId={id}
                      value={value ?? ""}
                      onValueChange={onChange}
                      options={perModelLimitModels.map((model) => ({
                        label: model,
                        value: model,
                      }))}
                      placeholder={t("infoSelectModel")}
                    />
                  )}
                </FormField>
                <FormField control={form.control} name={`modelLimits.${index}.tpm`}>
                  {({ ref, value, onChange, ...field }) => (
                    <NumericalInput
                      {...field}
                      ref={ref}
                      value={value ?? ""}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                      placeholder={t("infoTpmLimitPlaceholder")}
                      min={0}
                      step={1}
                    />
                  )}
                </FormField>
                <FormField control={form.control} name={`modelLimits.${index}.rpm`}>
                  {({ ref, value, onChange, ...field }) => (
                    <NumericalInput
                      {...field}
                      ref={ref}
                      value={value ?? ""}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                      placeholder={t("infoRpmLimitPlaceholder")}
                      min={0}
                      step={1}
                    />
                  )}
                </FormField>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("infoRemoveModelLimit")}
                  className="mt-1 text-destructive"
                  onClick={() => removeModelLimit(index)}
                >
                  <CircleMinus className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => appendModelLimit({ model: "", tpm: null, rpm: null })}
            >
              <Plus className="size-4" />
              {t("infoAddModelLimit")}
            </Button>
          </Field>

          <FormField
            control={form.control}
            name="default_estimated_output_tokens"
            label={labelWithHint(t("estimatedOutputTokens.estimatedOutputTokens"), teamEstimateTooltip.estimate)}
          >
            {({ ref, value, ...field }) => (
              <NumericalInput
                {...field}
                ref={ref}
                value={value ?? ""}
                min={1}
                step={1}
                disabled={!canEditTeamEstimates}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="default_estimated_output_tokens_per_model"
            label={labelWithHint(t("infoEstimatedOutputTokensPerModel"), teamEstimateTooltip.perModel)}
          >
            {({ ref, value, ...field }) => (
              <Textarea
                {...field}
                ref={ref}
                value={value ?? ""}
                rows={4}
                placeholder='{"gpt-4": 4096}'
                disabled={!canEditTeamEstimates}
              />
            )}
          </FormField>

          <Field>
            <FieldLabel>{t("listRouterSettings")}</FieldLabel>
            <RouterSettingsAccordion
              ref={routerSettingsRef}
              accessToken={accessToken || ""}
              teamId={teamId}
              value={info.router_settings ? { router_settings: info.router_settings } : undefined}
            />
          </Field>

          <FormField
            control={form.control}
            name="guardrails"
            label={labelWithDocsHint(
              t("listGuardrails"),
              t("infoGuardrailsHint"),
              "https://docs.litellm.ai/docs/proxy/guardrails/quick_start",
            )}
          >
            {({ id, value, onChange }) => (
              <GuardrailsSelect
                id={id}
                value={value ?? []}
                onValueChange={onChange}
                globalGuardrails={globalGuardrails.map((g) => ({
                  name: g.guardrail_name,
                  disabled: Boolean(killSwitchOn),
                }))}
                otherGuardrails={otherGuardrails.map((g) => ({
                  name: g.guardrail_name,
                  disabled: false,
                }))}
                globalGuardrailNames={globalGuardrailNames}
              />
            )}
          </FormField>

          {is_proxy_admin && (
            <FormField
              control={form.control}
              name="disable_global_guardrails"
              label={labelWithHint(t("infoDisableGlobalGuardrails"), t("infoDisableGlobalGuardrailsHint"))}
            >
              {({ id, value, onChange }) => (
                <Switch
                  id={id}
                  checked={value === true}
                  onCheckedChange={(checked) => {
                    onChange(checked);
                    applyKillSwitchToGuardrails(checked);
                  }}
                />
              )}
            </FormField>
          )}

          {canEditAsProxyAdmin && (
            <FormField
              control={form.control}
              name="require_trace_id"
              label={labelWithHint(
                "Require Trace ID",
                "Reject LLM, MCP and agent requests from this team that do not send a trace ID (x-litellm-trace-id header, LLM requests can also use traceparent or metadata.trace_id)",
              )}
            >
              {({ id, value, onChange }) => <Switch id={id} checked={value === true} onCheckedChange={onChange} />}
            </FormField>
          )}

          {canViewPolicies && (
            <FormField
              control={form.control}
              name="policies"
              label={labelWithDocsHint(
                t("listPolicies"),
                t("listPoliciesHint"),
                "https://docs.litellm.ai/docs/proxy/guardrails/guardrail_policies",
              )}
            >
              {({ id, value, onChange }) => (
                <TagsInput
                  id={id}
                  value={value ?? []}
                  onValueChange={onChange}
                  options={policiesList.map((name) => ({ value: name, label: name }))}
                  placeholder={t("listPoliciesPlaceholder")}
                />
              )}
            </FormField>
          )}

          <FormField
            control={form.control}
            name="access_group_ids"
            label={labelWithHint(t("listAccessGroups"), t("listAccessGroupsHint"))}
          >
            {({ value, onChange }) => (
              <AccessGroupSelector value={value} onChange={onChange} placeholder={t("listAccessGroupsPlaceholder")} />
            )}
          </FormField>

          <FormField control={form.control} name="vector_stores" label={t("infoVectorStores")}>
            {({ value, onChange }) => (
              <VectorStoreSelector
                onChange={onChange}
                value={value}
                accessToken={accessToken || ""}
                placeholder={t("infoSelectVectorStores")}
              />
            )}
          </FormField>

          <FormField control={form.control} name="allowed_passthrough_routes" label={passThroughRoutesLabel()}>
            {({ value, onChange }) => (
              <PassThroughRoutesSelector
                value={value}
                onChange={onChange}
                accessToken={accessToken || ""}
                placeholder={t("infoSelectPassThroughRoutes")}
                disabled={!premiumUser || !is_proxy_admin}
              />
            )}
          </FormField>

          <FormField control={form.control} name="mcp_servers_and_groups" label={t("infoMcpServersAccessGroups")}>
            {({ value, onChange }) => (
              <MCPServerSelector
                onChange={onChange}
                value={value}
                accessToken={accessToken || ""}
                placeholder={t("listAllowedMcpServersPlaceholder")}
                allowAllProxyMcpServers={is_proxy_admin}
              />
            )}
          </FormField>

          <div className="mb-6">
            <MCPToolPermissions
              accessToken={accessToken || ""}
              selectedServers={watchedMcpSelection?.servers || []}
              selectedAccessGroups={watchedMcpSelection?.accessGroups || []}
              selectedToolsets={watchedMcpSelection?.toolsets || []}
              toolPermissions={watchedToolPermissions || {}}
              onChange={(toolPerms) => form.setValue("mcp_tool_permissions", toolPerms)}
            />
          </div>

          <FormField control={form.control} name="agents_and_groups" label={t("infoAgentsAccessGroups")}>
            {({ value, onChange }) => (
              <AgentSelector
                onChange={onChange}
                value={value}
                accessToken={accessToken || ""}
                placeholder={t("listAllowedAgentsPlaceholder")}
              />
            )}
          </FormField>

          <Collapsible
            open={searchToolSettingsOpen}
            onOpenChange={setSearchToolSettingsOpen}
            className="mt-4 mb-4 overflow-hidden rounded-lg border"
          >
            <CollapsibleTrigger className="group/section flex w-full items-center justify-between px-4 py-3 text-left">
              <b>{t("listSearchToolSettings")}</b>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]/section:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-3">
              <FormField
                control={form.control}
                name="object_permission_search_tools"
                label={labelWithHint(t("listAllowedSearchTools"), t("listAllowedSearchToolsHint"))}
              >
                {({ value, onChange }) => (
                  <SearchToolSelector
                    onChange={onChange}
                    value={value}
                    accessToken={accessToken || ""}
                    placeholder={t("listAllowedSearchToolsPlaceholder")}
                  />
                )}
              </FormField>
            </CollapsibleContent>
          </Collapsible>

          <FormField
            control={form.control}
            name="object_permission_skills"
            label={labelWithHint(t("infoSkills"), t("listAllowedSkillsHint"))}
          >
            {({ value, onChange }) => (
              <SkillSelector
                onChange={onChange}
                value={value}
                accessToken={accessToken || ""}
                placeholder={t("listAllowedSkillsPlaceholder")}
              />
            )}
          </FormField>

          <FormField control={form.control} name="organization_id" label={t("listOrganization")}>
            {({ id, value, onChange }) => (
              <SearchSelect
                inputId={id}
                value={value ?? ""}
                onValueChange={onChange}
                options={userOrganizations.map((org) => ({
                  value: org.organization_id ?? "",
                  label: org.organization_alias || org.organization_id || "",
                }))}
                placeholder={t("infoSelectOrganization")}
                emptyText={t("infoNoMatchingOrganizations")}
              />
            )}
          </FormField>

          <FormField control={form.control} name="logging_settings" label={t("listLoggingSettings")}>
            {({ value, onChange }) => <EditLoggingSettings value={(value as unknown[]) ?? []} onChange={onChange} />}
          </FormField>

          <FormField
            control={form.control}
            name="secret_manager_settings"
            label={t("listSecretManagerSettings")}
            description={premiumUser ? t("listSecretManagerDescription") : t("listSecretManagerPremiumDescription")}
          >
            {({ ref, value, ...field }) => (
              <Textarea
                {...field}
                ref={ref}
                value={value ?? ""}
                rows={6}
                placeholder='{"namespace": "admin", "mount": "secret", "path_prefix": "litellm"}'
                disabled={!premiumUser}
              />
            )}
          </FormField>
        </FieldGroup>

        <div className="sticky z-chrome -inset-x-6 -bottom-6 border-t border-border bg-card p-4 pr-0">
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isTeamSaving}>
              {t("infoCancel")}
            </Button>
            <Button type="submit" disabled={isTeamSaving}>
              {isTeamSaving ? <UiLoadingSpinner className="size-4" /> : <Save className="size-4" />}
              {t("infoSaveChanges")}
            </Button>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
};
