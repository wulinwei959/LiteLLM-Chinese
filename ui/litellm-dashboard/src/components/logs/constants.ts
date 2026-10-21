export type LogsTimeRangeKey =
  | "timeRange.lastMinute"
  | "timeRange.lastOneMinute"
  | "timeRange.last15Minutes"
  | "timeRange.lastHour"
  | "timeRange.last4Hours"
  | "timeRange.last24Hours"
  | "timeRange.last7Days";

export type LogsErrorCodeKey =
  | "filters.errorCodes.code400"
  | "filters.errorCodes.code401"
  | "filters.errorCodes.code403"
  | "filters.errorCodes.code404"
  | "filters.errorCodes.code408"
  | "filters.errorCodes.code422"
  | "filters.errorCodes.code429"
  | "filters.errorCodes.code500"
  | "filters.errorCodes.code502"
  | "filters.errorCodes.code503"
  | "filters.errorCodes.code529";

export type ErrorCodeOption = {
  readonly labelKey: LogsErrorCodeKey;
  readonly value: string;
};

export const ERROR_CODE_OPTIONS: readonly ErrorCodeOption[] = [
  { labelKey: "filters.errorCodes.code400", value: "400" },
  { labelKey: "filters.errorCodes.code401", value: "401" },
  { labelKey: "filters.errorCodes.code403", value: "403" },
  { labelKey: "filters.errorCodes.code404", value: "404" },
  { labelKey: "filters.errorCodes.code408", value: "408" },
  { labelKey: "filters.errorCodes.code422", value: "422" },
  { labelKey: "filters.errorCodes.code429", value: "429" },
  { labelKey: "filters.errorCodes.code500", value: "500" },
  { labelKey: "filters.errorCodes.code502", value: "502" },
  { labelKey: "filters.errorCodes.code503", value: "503" },
  { labelKey: "filters.errorCodes.code529", value: "529" },
];

/** Call types that represent MCP tool invocations (shared across columns, index, drawer). */
export const MCP_CALL_TYPES = ["call_mcp_tool", "list_mcp_tools"];

/** Call types that represent agent/A2A requests (e.g. asend_message). */
export const AGENT_CALL_TYPES = ["asend_message"];

/** Call types that represent Batch API operations (creation and retrieval, sync and async). */
export const BATCH_CALL_TYPES = ["acreate_batch", "create_batch", "aretrieve_batch", "retrieve_batch"];

export type LogsSpanTypeKey =
  | "filters.options.llm"
  | "filters.options.agent"
  | "filters.options.mcp"
  | "filters.options.batch";

export type LogsCredentialKey = "filters.options.clientOAuthToken" | "filters.options.configuredKey";

export const SPAN_TYPE_LABEL_KEYS: Readonly<Record<string, LogsSpanTypeKey>> = {
  llm: "filters.options.llm",
  agent: "filters.options.agent",
  mcp: "filters.options.mcp",
  batch: "filters.options.batch",
};

export const KUBERNETES_POD_ROUTING_LABEL_KEYS = {
  round_robin: "podRouting.roundRobin",
  session_affinity: "podRouting.sessionAffinity",
  session_affinity_retry: "podRouting.sessionAffinityRetry",
} as const;

export const CREDENTIAL_LABEL_KEYS: Readonly<Record<string, LogsCredentialKey>> = {
  true: "filters.options.clientOAuthToken",
  false: "filters.options.configuredKey",
};

export type QuickSelectOption = {
  readonly labelKey: LogsTimeRangeKey;
  readonly value: number;
  readonly unit: string;
};

export const QUICK_SELECT_OPTIONS: readonly QuickSelectOption[] = [
  { labelKey: "timeRange.lastMinute", value: 1, unit: "minutes" },
  { labelKey: "timeRange.last15Minutes", value: 15, unit: "minutes" },
  { labelKey: "timeRange.lastHour", value: 1, unit: "hours" },
  { labelKey: "timeRange.last4Hours", value: 4, unit: "hours" },
  { labelKey: "timeRange.last24Hours", value: 24, unit: "hours" },
  { labelKey: "timeRange.last7Days", value: 7, unit: "days" },
];
