import type { AgentsTranslator } from "@/lib/i18n/translators";
import { parseIdentityForForm } from "./agent_identity";
/**
 * Shared configuration for agent form fields
 * Used across create, view, and update operations
 */

import {
  EMPTY_KILL_SWITCH_FORM,
  buildKillSwitchFromForm,
  parseKillSwitchForForm,
  type KillSwitchConfig,
  type KillSwitchFormValue,
} from "./kill_switch_config";

export type AgentsTextKey = Parameters<AgentsTranslator>[0];

export interface FieldConfig {
  name: string;
  labelKey: AgentsTextKey;
  type: "text" | "textarea" | "url" | "switch" | "list" | "select";
  required?: boolean;
  tooltipKey?: AgentsTextKey;
  placeholderKey?: AgentsTextKey;
  placeholder?: string;
  defaultValue?: any;
  rows?: number;
  validation?: any[];
  options?: string[];
  helpTextKey?: AgentsTextKey;
}

export interface SectionConfig {
  key: string;
  titleKey: AgentsTextKey;
  fields: FieldConfig[];
  defaultExpanded?: boolean;
}

export const AGENT_FORM_CONFIG: {
  basic: SectionConfig;
  skills: SectionConfig;
  capabilities: SectionConfig;
  optional: SectionConfig;
  litellm: SectionConfig;
  cost: SectionConfig;
  tracing: SectionConfig;
} = {
  basic: {
    key: "basic",
    titleKey: "panelBasicTitle",
    defaultExpanded: true,
    fields: [
      {
        name: "name",
        labelKey: "displayName",
        type: "text",
        required: true,
        placeholderKey: "phNameExample",
      },
      {
        name: "description",
        labelKey: "skillDescLabel",
        type: "textarea",
        required: false,
        placeholderKey: "phDesc",
        rows: 3,
      },
      {
        name: "url",
        labelKey: "url",
        type: "url",
        required: false,
        placeholderKey: "url",
        tooltipKey: "urlTooltip",
      },
      {
        name: "version",
        labelKey: "version",
        type: "text",
        placeholder: "1.0.0",
        defaultValue: "1.0.0",
      },
      {
        name: "protocolVersion",
        labelKey: "protocolVersion",
        type: "select",
        options: ["1.0", "0.3"],
        defaultValue: "1.0",
        tooltipKey: "protocolVersionTooltip",
        helpTextKey: "protocolVersionHelpText",
      },
    ],
  },
  skills: {
    key: "skills",
    titleKey: "panelSkillsTitle",
    fields: [
      {
        name: "skills",
        labelKey: "panelSkillsTitle",
        type: "list",
        defaultValue: [],
      },
    ],
  },
  capabilities: {
    key: "capabilities",
    titleKey: "panelCapabilitiesTitle",
    fields: [
      {
        name: "streaming",
        labelKey: "streaming",
        type: "switch",
        defaultValue: false,
      },
      {
        name: "pushNotifications",
        labelKey: "pushNotifications",
        type: "switch",
      },
      {
        name: "stateTransitionHistory",
        labelKey: "stateTransitionHistory",
        type: "switch",
      },
    ],
  },
  optional: {
    key: "optional",
    titleKey: "panelOptionalTitle",
    fields: [
      {
        name: "iconUrl",
        labelKey: "iconUrl",
        type: "url",
        placeholderKey: "phIcon",
      },
      {
        name: "documentationUrl",
        labelKey: "documentationUrl",
        type: "url",
        placeholderKey: "phDocs",
      },
      {
        name: "supportsAuthenticatedExtendedCard",
        labelKey: "supportsAuthExtendedCard",
        type: "switch",
      },
    ],
  },
  litellm: {
    key: "litellm",
    titleKey: "panelLitellmTitle",
    fields: [
      {
        name: "model",
        labelKey: "modelOptional",
        type: "text",
      },
      {
        name: "make_public",
        labelKey: "makePublic",
        type: "switch",
      },
    ],
  },
  cost: {
    key: "cost",
    titleKey: "costConfigTitle",
    fields: [
      {
        name: "cost_per_query",
        labelKey: "costPerQuery",
        type: "text",
        placeholder: "0.0",
        tooltipKey: "costPerQueryTooltip",
      },
      {
        name: "input_cost_per_token",
        labelKey: "inputCostPerToken",
        type: "text",
        placeholder: "0.000001",
        tooltipKey: "inputCostTooltip",
      },
      {
        name: "output_cost_per_token",
        labelKey: "outputCostPerToken",
        type: "text",
        placeholder: "0.000002",
        tooltipKey: "outputCostTooltip",
      },
    ],
  },
  tracing: {
    key: "tracing",
    titleKey: "panelTracingTitle",
    fields: [
      {
        name: "enable_tracing",
        labelKey: "enableTracing",
        type: "switch",
        defaultValue: false,
        tooltipKey: "enableTracingTooltip",
      },
    ],
  },
};

export const SKILL_FIELD_CONFIG: Record<
  string,
  { name: string; labelKey: AgentsTextKey; required?: boolean; placeholderKey?: AgentsTextKey; rows?: number }
> = {
  id: {
    name: "id",
    labelKey: "skillIdLabel",
    required: true,
    placeholderKey: "skillIdPlaceholder",
  },
  name: {
    name: "name",
    labelKey: "skillNameLabel",
    required: true,
    placeholderKey: "skillNamePlaceholder",
  },
  description: {
    name: "description",
    labelKey: "skillDescLabel",
    required: true,
    placeholderKey: "skillDescPlaceholder",
    rows: 2,
  },
  tags: {
    name: "tags",
    labelKey: "skillTagsLabel",
    required: true,
    placeholderKey: "skillTagsPlaceholder",
  },
  examples: {
    name: "examples",
    labelKey: "skillExamplesLabel",
    placeholderKey: "skillExamplesPlaceholder",
  },
};

/**
 * Get default form values from configuration
 */
export const getDefaultFormValues = () => {
  const defaults: any = {
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
    kill_switch: { ...EMPTY_KILL_SWITCH_FORM },
  };

  Object.values(AGENT_FORM_CONFIG).forEach((section) => {
    section.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    });
  });

  return defaults;
};

/**
 * Build agent data from form values according to AgentConfig spec
 */
export const buildAgentDataFromForm = (values: any, existingAgent?: any) => {
  const agentData: any = {
    agent_name: values.agent_name,
    agent_card_params: {
      protocolVersion: values.protocolVersion || "1.0",
      name: values.name || values.agent_name,
      description: values.description || "",
      url: values.url || "",
      version: values.version || "1.0.0",
      defaultInputModes: existingAgent?.agent_card_params?.defaultInputModes || ["text"],
      defaultOutputModes: existingAgent?.agent_card_params?.defaultOutputModes || ["text"],
      capabilities: {
        streaming: values.streaming === true,
        ...(values.pushNotifications !== undefined && { pushNotifications: values.pushNotifications }),
        ...(values.stateTransitionHistory !== undefined && { stateTransitionHistory: values.stateTransitionHistory }),
      },
      skills: values.skills || [],
      ...(values.iconUrl && { iconUrl: values.iconUrl }),
      ...(values.documentationUrl && { documentationUrl: values.documentationUrl }),
      ...(values.supportsAuthenticatedExtendedCard !== undefined && {
        supportsAuthenticatedExtendedCard: values.supportsAuthenticatedExtendedCard,
      }),
    },
  };

  const params: Record<string, any> = {};

  if (values.model) params.model = values.model;
  if (values.make_public !== undefined) params.make_public = values.make_public;
  if (values.cost_per_query) params.cost_per_query = parseFloat(values.cost_per_query);
  if (values.input_cost_per_token) params.input_cost_per_token = parseFloat(values.input_cost_per_token);
  if (values.output_cost_per_token) params.output_cost_per_token = parseFloat(values.output_cost_per_token);

  if (Object.keys(params).length > 0) {
    agentData.litellm_params = params;
  }

  if (values.tpm_limit != null) agentData.tpm_limit = values.tpm_limit;
  if (values.rpm_limit != null) agentData.rpm_limit = values.rpm_limit;
  if (values.session_tpm_limit != null) agentData.session_tpm_limit = values.session_tpm_limit;
  if (values.session_rpm_limit != null) agentData.session_rpm_limit = values.session_rpm_limit;
  // static_headers: convert [{header, value}, ...] → {header: value, ...}
  if (Array.isArray(values.static_headers) && values.static_headers.length > 0) {
    const staticHeaders: Record<string, string> = {};
    values.static_headers.forEach((entry: { header?: string; value?: string }) => {
      const key = entry?.header?.trim();
      if (key) staticHeaders[key] = entry?.value ?? "";
    });
    if (Object.keys(staticHeaders).length > 0) {
      agentData.static_headers = staticHeaders;
    }
  }

  // extra_headers: already an array of strings from Select tags
  if (Array.isArray(values.extra_headers) && values.extra_headers.length > 0) {
    agentData.extra_headers = values.extra_headers;
  }

  applyKillSwitchToPayload(agentData, values.kill_switch, existingAgent);

  return agentData;
};

export const applyKillSwitchToPayload = (
  agentData: { kill_switch?: KillSwitchConfig | null },
  form: KillSwitchFormValue | undefined,
  existingAgent?: { kill_switch?: KillSwitchConfig | null },
) => {
  const killSwitch = buildKillSwitchFromForm(form);
  if (killSwitch !== undefined && (killSwitch !== null || existingAgent?.kill_switch)) {
    agentData.kill_switch = killSwitch;
  }
};

export const parseAccessGroupIdsForForm = (agent: { access_group_ids?: string[] | null }) => ({
  access_group_ids: agent.access_group_ids ?? [],
});

export const parseMcpPermissionsForForm = (agent: any) => ({
  ...parseIdentityForForm(agent),
  allowed_mcp_servers_and_groups: {
    servers: agent.object_permission?.mcp_servers ?? [],
    accessGroups: agent.object_permission?.mcp_access_groups ?? [],
    toolsets: agent.object_permission?.mcp_toolsets ?? [],
  },
  mcp_tool_permissions: agent.object_permission?.mcp_tool_permissions ?? {},
});

/**
 * Always includes every MCP key (empty when cleared) so removals persist;
 * the proxy merges object_permission per key, leaving non-MCP grants untouched.
 */
export const buildMcpObjectPermission = (values: any) => ({
  mcp_servers: values.allowed_mcp_servers_and_groups?.servers ?? [],
  mcp_access_groups: values.allowed_mcp_servers_and_groups?.accessGroups ?? [],
  mcp_toolsets: values.allowed_mcp_servers_and_groups?.toolsets ?? [],
  mcp_tool_permissions: values.mcp_tool_permissions ?? {},
});

/**
 * Parse agent data for form fields
 */
export const parseAgentForForm = (agent: any) => {
  const card = agent.agent_card_params ?? {};
  const skills =
    card.skills?.map((skill: any) => ({
      ...skill,
      tags: skill.tags,
      examples: skill.examples || [],
    })) || [];

  return {
    agent_name: agent.agent_name,
    name: card.name || agent.agent_name,
    description: card.description,
    url: card.url,
    version: card.version,
    protocolVersion: card.protocolVersion,
    streaming: card.capabilities?.streaming,
    pushNotifications: card.capabilities?.pushNotifications,
    stateTransitionHistory: card.capabilities?.stateTransitionHistory,
    skills: skills,
    iconUrl: card.iconUrl,
    documentationUrl: card.documentationUrl,
    supportsAuthenticatedExtendedCard: card.supportsAuthenticatedExtendedCard,
    model: agent.litellm_params?.model,
    make_public: agent.litellm_params?.make_public,
    cost_per_query: agent.litellm_params?.cost_per_query,
    input_cost_per_token: agent.litellm_params?.input_cost_per_token,
    output_cost_per_token: agent.litellm_params?.output_cost_per_token,
    tpm_limit: agent.tpm_limit,
    rpm_limit: agent.rpm_limit,
    session_tpm_limit: agent.session_tpm_limit,
    session_rpm_limit: agent.session_rpm_limit,
    // static_headers: {key: value} → [{header, value}, ...]
    static_headers: agent.static_headers
      ? Object.entries(agent.static_headers as Record<string, string>).map(([header, value]) => ({
          header,
          value,
        }))
      : [],
    // extra_headers: already an array of strings
    extra_headers: agent.extra_headers ?? [],
    kill_switch: parseKillSwitchForForm(agent.kill_switch),
    ...parseMcpPermissionsForForm(agent),
    ...parseAccessGroupIdsForForm(agent),
  };
};

// Backend-supplied credential fields arrive with English label/tooltip/placeholder text;
// this table maps the known ones onto agents message keys so the form renders Chinese.
const FIELD_TEXT_KEYS: Record<string, string> = {
  "Agent Name": "agentName",
  "Unique identifier for the agent": "nameFieldHint",
  "Display Name": "displayName",
  URL: "url",
  Version: "version",
  "Protocol Version": "protocolVersion",
  "The A2A protocol version LiteLLM serves to clients for this agent. LiteLLM converts the upstream agent's responses to this version, so clients always see the version you pick here regardless of the original agent's version.":
    "protocolVersionTooltip",
  "LiteLLM serves this version to clients and converts the upstream agent's responses to match it, regardless of the original agent's version.":
    "protocolVersionHelpText",
  "Skill ID": "skillIdLabel",
  "Skill Name": "skillNameLabel",
  Description: "skillDescLabel",
  Tags: "skillTagsLabel",
  Examples: "skillExamplesLabel",
  "e.g., hello_world": "skillIdPlaceholder",
  "e.g., Returns hello world": "skillNamePlaceholder",
  "What this skill does": "skillDescPlaceholder",
  "Type a tag and press Enter": "skillTagsPlaceholder",
  "Type an example and press Enter": "skillExamplesPlaceholder",
  Streaming: "streaming",
  "Push Notifications": "pushNotifications",
  "State Transition History": "stateTransitionHistory",
  "Icon URL": "iconUrl",
  "Documentation URL": "documentationUrl",
  "Supports Authenticated Extended Card": "supportsAuthExtendedCard",
  "Model (Optional)": "modelOptional",
  "Make Public": "makePublic",
  "Cost Per Query ($)": "costPerQuery",
  "Input Cost Per Token ($)": "inputCostPerToken",
  "Output Cost Per Token ($)": "outputCostPerToken",
  "Enable Tracing": "enableTracing",
  "Base URL where the agent is hosted (optional)": "urlTooltip",
  "Fixed cost per query": "costPerQueryTooltip",
  "Cost per input token": "inputCostTooltip",
  "Cost per output token": "outputCostTooltip",
  "Enable request tracing for this agent": "enableTracingTooltip",
  "e.g., Customer Support Agent": "phNameExample",
  "Describe what this agent does...": "phDesc",
  "http://localhost:9999/": "url",
  "https://example.com/icon.png": "phIcon",
  "https://docs.example.com": "phDocs",
  "Basic Information": "panelBasicTitle",
  Skills: "panelSkillsTitle",
  Capabilities: "panelCapabilitiesTitle",
  "Optional Settings": "panelOptionalTitle",
  "LiteLLM Parameters": "panelLitellmTitle",
  "Cost Configuration": "costConfigTitle",
  Tracing: "panelTracingTitle",
};

export const serverFieldText = (t: AgentsTranslator, text?: string | null): string =>
  text && FIELD_TEXT_KEYS[text] ? t(FIELD_TEXT_KEYS[text] as AgentsTextKey) : text ?? "";

export const fieldPlaceholderText = (
  t: AgentsTranslator,
  field: { placeholderKey?: AgentsTextKey; placeholder?: string },
): string | undefined => (field.placeholderKey ? t(field.placeholderKey) : field.placeholder);
