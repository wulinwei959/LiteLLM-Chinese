"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { ChevronDown, Info } from "lucide-react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";
import { MountedFormField, type MountedFormValues } from "../common_components/MountedFormField";
import AgentSelector from "../agent_management/AgentSelector";
import SkillSelector from "../skills/SkillSelector";
import KeyLifecycleSettings from "../common_components/KeyLifecycleSettings";
import ModelAliasManager from "../common_components/ModelAliasManager";
import PremiumLoggingSettings from "../common_components/PremiumLoggingSettings";
import SchemaFormFields from "../common_components/check_openapi_schema";
import RouterSettingsAccordion, {
  RouterSettingsAccordionRef,
  RouterSettingsAccordionValue,
} from "../common_components/RouterSettingsAccordion";
import { Team } from "../key_team_helpers/key_list";
import MCPServerSelector from "../mcp_server_management/MCPServerSelector";
import MCPToolPermissions from "../mcp_server_management/MCPToolPermissions";
import { proxyBaseUrl } from "../networking";

export const SECTION_HEADER_CLASS = "group/section flex w-full items-center justify-between px-4 py-3 text-left";
export const SECTION_CHEVRON_CLASS =
  "size-5 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]/section:rotate-180";

type McpSelectorValue = { servers: string[]; accessGroups: string[]; toolsets?: string[] };

type AgentSelectorValue = { agents: string[]; accessGroups: string[] };

interface McpToolPermissionsFieldProps {
  readonly accessToken: string;
  readonly control: Control<MountedFormValues>;
  readonly setValue: UseFormSetValue<MountedFormValues>;
}

const McpToolPermissionsField: React.FC<McpToolPermissionsFieldProps> = ({ accessToken, control, setValue }) => {
  const selection = useWatch({ control, name: "allowed_mcp_servers_and_groups" }) as
    | { servers?: string[]; accessGroups?: string[]; toolsets?: string[] }
    | undefined;
  const toolPermissions = useWatch({ control, name: "mcp_tool_permissions" }) as Record<string, string[]> | undefined;

  return (
    <div className="mt-6">
      <MCPToolPermissions
        accessToken={accessToken}
        selectedServers={selection?.servers || []}
        selectedAccessGroups={selection?.accessGroups || []}
        selectedToolsets={selection?.toolsets || []}
        toolPermissions={toolPermissions || {}}
        onChange={(toolPerms) => setValue("mcp_tool_permissions", toolPerms)}
      />
    </div>
  );
};

interface CreateKeyAdvancedPanelsProps {
  readonly accessToken: string;
  readonly selectedCreateKeyTeam: Team | null;
  readonly premiumUser: boolean | null;
  readonly loggingSettings: unknown[];
  readonly setLoggingSettings: (next: unknown[]) => void;
  readonly disabledCallbacks: string[];
  readonly setDisabledCallbacks: (next: string[]) => void;
  readonly routerSettings: RouterSettingsAccordionValue | null;
  readonly setRouterSettings: (next: RouterSettingsAccordionValue | null) => void;
  readonly routerSettingsRef: React.RefObject<RouterSettingsAccordionRef | null>;
  readonly routerSettingsKey: number;
  readonly userModels: string[];
  readonly modelAliases: { [key: string]: string };
  readonly setModelAliases: (next: { [key: string]: string }) => void;
  readonly autoRotationEnabled: boolean;
  readonly setAutoRotationEnabled: (next: boolean) => void;
  readonly rotationInterval: string;
  readonly setRotationInterval: (next: string) => void;
  readonly disableCustomApiKeys: boolean;
  readonly control: Control<MountedFormValues>;
  readonly setValue: UseFormSetValue<MountedFormValues>;
}

export const CreateKeyAdvancedPanels: React.FC<CreateKeyAdvancedPanelsProps> = ({
  accessToken,
  selectedCreateKeyTeam,
  premiumUser,
  loggingSettings,
  setLoggingSettings,
  disabledCallbacks,
  setDisabledCallbacks,
  routerSettings,
  setRouterSettings,
  routerSettingsRef,
  routerSettingsKey,
  userModels,
  modelAliases,
  setModelAliases,
  autoRotationEnabled,
  setAutoRotationEnabled,
  rotationInterval,
  setRotationInterval,
  disableCustomApiKeys,
  control,
  setValue,
}) => {
  const t = useTranslations("virtualKeys");
  const ct = useTranslations("virtualKeys.createForm");
  const selectorT = useTranslations("agents.selector");

  return (
    <>
      <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <b>{ct("sectionMcp")}</b>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <MountedFormField
            label={
              <span>
                {ct("allowedMcpServers")}{" "}
                <SimpleTooltip content={ct("mcpServersHint")}>
                  <Info className="ml-1 inline size-3.5 align-text-bottom" />
                </SimpleTooltip>
              </span>
            }
            name="allowed_mcp_servers_and_groups"
            help={ct("mcpServersHelp")}
          >
            {(field) => (
              <MCPServerSelector
                onChange={field.onChange}
                value={field.value as McpSelectorValue | undefined}
                accessToken={accessToken}
                teamId={selectedCreateKeyTeam?.team_id ?? null}
                placeholder={t("editForm.selectMcpServers")}
                allowNoMcpServers
              />
            )}
          </MountedFormField>

          {/* Hidden field to register mcp_tool_permissions with the form */}
          <MountedFormField name="mcp_tool_permissions" bare>
            {(field) => <input type="hidden" id={field.id} name={field.name} />}
          </MountedFormField>

          <McpToolPermissionsField accessToken={accessToken} control={control} setValue={setValue} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <b>{ct("sectionAgents")}</b>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <MountedFormField
            label={
              <span>
                {ct("allowedAgents")}{" "}
                <SimpleTooltip content={ct("agentsHint")}>
                  <Info className="ml-1 inline size-3.5 align-text-bottom" />
                </SimpleTooltip>
              </span>
            }
            name="allowed_agents_and_groups"
            help={ct("agentsHelp")}
          >
            {(field) => (
              <AgentSelector
                onChange={field.onChange}
                value={field.value as AgentSelectorValue | undefined}
                accessToken={accessToken}
                placeholder={t("editForm.selectAgents")}
              />
            )}
          </MountedFormField>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <b>{ct("sectionSkills")}</b>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <MountedFormField
            label={
              <span>
                {ct("allowedSkills")}{" "}
                <SimpleTooltip content={ct("skillsHint")}>
                  <Info className="ml-1 inline size-3.5 align-text-bottom" />
                </SimpleTooltip>
              </span>
            }
            name="allowed_skills"
            help={ct("skillsHelp")}
          >
            {(field) => (
              <SkillSelector
                onChange={field.onChange}
                value={field.value as string[] | undefined}
                accessToken={accessToken}
                placeholder={ct("skillsPlaceholder")}
              />
            )}
          </MountedFormField>
        </CollapsibleContent>
      </Collapsible>

      {premiumUser ? (
        <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
          <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
            <b>{t("editForm.loggingSettings")}</b>
            <ChevronDown className={SECTION_CHEVRON_CLASS} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3">
            <div className="mt-4">
              <PremiumLoggingSettings
                value={loggingSettings}
                onChange={setLoggingSettings}
                premiumUser={true}
                disabledCallbacks={disabledCallbacks}
                onDisabledCallbacksChange={setDisabledCallbacks}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SimpleTooltip
          className="w-full"
          content={ct.rich("loggingEnterpriseNotice", {
            link: (chunks) => (
              <a href="https://www.litellm.ai/enterprise" target="_blank">
                {chunks}
              </a>
            ),
          })}
          side="top"
        >
          <div style={{ position: "relative" }}>
            <div style={{ opacity: 0.5 }}>
              <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
                <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
                  <b>{t("editForm.loggingSettings")}</b>
                  <ChevronDown className={SECTION_CHEVRON_CLASS} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-3">
                  <div className="mt-4">
                    <PremiumLoggingSettings
                      value={loggingSettings}
                      onChange={setLoggingSettings}
                      premiumUser={false}
                      disabledCallbacks={disabledCallbacks}
                      onDisabledCallbacksChange={setDisabledCallbacks}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <div style={{ position: "absolute", inset: 0, cursor: "not-allowed" }} />
          </div>
        </SimpleTooltip>
      )}

      <Collapsible
        key={`router-settings-accordion-${routerSettingsKey}`}
        className="mt-4 mb-4 overflow-hidden rounded-lg border"
      >
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <b>{t("info.routerSettingsLabel")}</b>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <div className="mt-4 w-full">
            <RouterSettingsAccordion
              key={routerSettingsKey}
              ref={routerSettingsRef}
              accessToken={accessToken || ""}
              value={routerSettings || undefined}
              onChange={setRouterSettings}
              modelData={
                userModels.length > 0 ? { data: userModels.map((model) => ({ model_name: model })) } : undefined
              }
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <b>{ct("sectionAliases")}</b>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">{ct("aliasDescription")}</p>
            <ModelAliasManager
              accessToken={accessToken}
              initialModelAliases={modelAliases}
              onAliasUpdate={setModelAliases}
              showExampleConfig={false}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <b>{ct("sectionLifecycle")}</b>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <div className="mt-4">
            <MountedFormField name="duration" bare>
              {(field) => (
                <KeyLifecycleSettings
                  id={field.id}
                  value={field.value as string | undefined}
                  onChange={field.onChange}
                  autoRotationEnabled={autoRotationEnabled}
                  onAutoRotationChange={setAutoRotationEnabled}
                  rotationInterval={rotationInterval}
                  onRotationIntervalChange={setRotationInterval}
                  isCreateMode={true}
                />
              )}
            </MountedFormField>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
          <div className="flex items-center gap-2">
            <b>{ct("sectionAdvanced")}</b>
            <SimpleTooltip
              content={ct.rich("advancedDocsHint", {
                link: (chunks) => (
                  <a
                    href={
                      proxyBaseUrl
                        ? `${proxyBaseUrl}/#/key%20management/generate_key_fn_key_generate_post`
                        : `/#/key%20management/generate_key_fn_key_generate_post`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:text-info/80"
                  >
                    {chunks}
                  </a>
                ),
              })}
            >
              <Info className="size-4 text-muted-foreground hover:text-foreground cursor-help" />
            </SimpleTooltip>
          </div>
          <ChevronDown className={SECTION_CHEVRON_CLASS} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <SchemaFormFields
            schemaComponent="GenerateKeyRequest"
            setValue={setValue}
            excludedFields={[
              "key_alias",
              "team_id",
              "organization_id",
              "models",
              "duration",
              "metadata",
              "tags",
              "guardrails",
              "max_budget",
              "budget_duration",
              "tpm_limit",
              "rpm_limit",
              "tpd_limit",
              ...(disableCustomApiKeys ? ["key"] : []),
            ]}
          />
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
