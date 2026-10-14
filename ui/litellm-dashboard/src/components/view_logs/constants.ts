export type LogsTimeRangeKey =
  | "timeRange.lastMinute"
  | "timeRange.lastOneMinute"
  | "timeRange.last15Minutes"
  | "timeRange.lastHour"
  | "timeRange.last4Hours"
  | "timeRange.last24Hours"
  | "timeRange.last7Days";

export const ERROR_CODE_OPTIONS: { label: string; value: string }[] = [
  { label: "400 - Bad Request", value: "400" },
  { label: "401 - Invalid Authentication", value: "401" },
  { label: "403 - Permission Denied", value: "403" },
  { label: "404 - Not Found", value: "404" },
  { label: "408 - Request Timeout", value: "408" },
  { label: "422 - Unprocessable Entity", value: "422" },
  { label: "429 - Rate Limited", value: "429" },
  { label: "500 - Internal Server Error", value: "500" },
  { label: "502 - Bad Gateway", value: "502" },
  { label: "503 - Service Unavailable", value: "503" },
  { label: "529 - Overloaded", value: "529" },
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
