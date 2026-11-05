import { createTranslator } from "next-intl";
import { zodFunction } from "openai/helpers/zod";
import { z } from "zod";
import enMessages from "@/messages/en.json";
import { apiClient } from "@/components/networking";
import { ApiError } from "@/lib/http/client";
import type { components } from "@/lib/http/schema";
import { generatedKey, projectToolResult, type ResultKind } from "./toolResults";
import {
  buildUsageChart,
  usageChartRequestSchema,
  usageChartSource,
  type ChartScopeKey,
  type UsageChart,
  type UsageChartSource,
} from "./usageChart";
import type { LiteAdminTranslator } from "@/lib/i18n/translators";

type ActionTitleKey =
  | "actions.keysList"
  | "actions.keyInfo"
  | "actions.keyCreate"
  | "actions.keyUpdate"
  | "actions.keyDetach"
  | "actions.keyDelete"
  | "actions.keyBlock"
  | "actions.keyUnblock"
  | "actions.teamsList"
  | "actions.teamInfo"
  | "actions.teamCreate"
  | "actions.teamUpdate"
  | "actions.teamDelete"
  | "actions.teamMemberAdd"
  | "actions.teamMemberUpdate"
  | "actions.teamMemberDelete"
  | "actions.usersList"
  | "actions.userInfo"
  | "actions.userCreate"
  | "actions.userUpdate"
  | "actions.userDelete"
  | "actions.budgetsList"
  | "actions.budgetInfo"
  | "actions.budgetCreate"
  | "actions.budgetUpdate"
  | "actions.budgetDelete"
  | "actions.spendReport"
  | "actions.teamSpendReport"
  | "actions.keySpendReport"
  | "actions.requestLogs"
  | "actions.usagePersonal"
  | "actions.usageGlobal"
  | "actions.usageTeam"
  | "actions.usageTag";

// Tool descriptions are sent to the model, so they stay English regardless of the UI locale.
let modelLocaleT: ((key: ActionTitleKey) => string) | undefined;
const modelLocaleTitle = (key: ActionTitleKey): string => {
  modelLocaleT ??= createTranslator({ locale: "en", messages: enMessages, namespace: "liteAdmin" });
  return modelLocaleT(key);
};

export interface LiteAdminAction {
  id: string;
  name: string;
  title: string;
  arguments: Record<string, unknown>;
  destructive: boolean;
}

export type ActionResult = { status: "completed"; key?: string } | { status: "unknown"; message: string };

export type AriaAccess =
  | { mode: "admin" }
  | { mode: "usage"; scope: { type: "global" } | { type: "user"; userId: string } };

export interface OperationContext {
  t: LiteAdminTranslator;
  access: AriaAccess;
  accessToken: string;
  signal: AbortSignal;
  assertCurrent: () => void;
  beforeTool: () => void;
  confirm: (action: LiteAdminAction) => Promise<boolean>;
  onResult: (action: LiteAdminAction, result: ActionResult) => void;
  onChart: (chart: UsageChart) => void;
}

type Schemas = components["schemas"];
const text = z.string().min(1).max(200);
const hash = z.string().regex(/^[a-f0-9]{64}$/i, "Use the key hash from a lookup, not a raw API key.");
const optional = <Schema extends z.ZodType<unknown>>(schema: Schema) => schema.nullable();
type NullsStripped<T> = { [K in keyof T]: Exclude<T[K], null> };
const stripNulls = <T extends Record<string, unknown>>(args: T): NullsStripped<T> =>
  Object.fromEntries(
    Object.entries(args).map(([key, value]) => [key, value === null ? undefined : value]),
  ) as NullsStripped<T>;
const optionalText = optional(text);
const amount = optional(z.number().finite().nonnegative());
const limit = optional(z.number().int().nonnegative());
const models = optional(z.array(text).max(50));
const page = z.number().int().min(1);
const pageSize = z.number().int().min(1).max(50);
const limits = { max_budget: amount, budget_duration: optionalText, rpm_limit: limit, tpm_limit: limit };
const keyFields = {
  key_alias: optionalText,
  team_id: optionalText,
  user_id: optionalText,
  models,
  ...limits,
  budget_id: optionalText,
  duration: optionalText,
};
const teamFields = { team_alias: optionalText, organization_id: optionalText, models, ...limits };
const userFields = {
  user_email: optional(z.email().max(200)),
  user_alias: optionalText,
  user_role: optional(z.enum(["proxy_admin", "proxy_admin_viewer", "internal_user", "internal_user_viewer"])),
  models,
  ...limits,
};
const object = <Shape extends z.ZodRawShape>(shape: Shape) => z.strictObject(shape);
const dated = <Shape extends z.ZodRawShape>(shape: Shape) =>
  object({ start_date: z.iso.date(), end_date: z.iso.date(), ...shape }).refine((value: Record<string, unknown>) => {
    if (typeof value.start_date !== "string" || typeof value.end_date !== "string") return false;
    const days = (Date.parse(value.end_date) - Date.parse(value.start_date)) / 86_400_000;
    return days >= 0 && days <= 366;
  }, "Choose an ordered date range of at most 366 days.");

const keysListFields = {
  page,
  page_size: pageSize,
  search: optionalText,
  team_id: optionalText,
  user_id: optionalText,
};
const teamsListFields = { page, page_size: pageSize, search: optionalText, organization_id: optionalText };
const teamMemberAddFields = {
  team_id: text,
  member: object({ user_id: text, role: z.enum(["admin", "user"]) }),
  max_budget_in_team: amount,
  budget_duration: optionalText,
};
const teamMemberUpdateFields = {
  team_id: text,
  user_id: text,
  role: optional(z.enum(["admin", "user"])),
  max_budget_in_team: amount,
  budget_duration: optionalText,
  rpm_limit: limit,
  tpm_limit: limit,
};
const spendReportFields = {
  group_by: z.enum(["team", "customer", "api_key"]),
  api_key: optional(hash),
  team_id: optionalText,
  internal_user_id: optionalText,
  customer_id: optionalText,
};
const requestLogsFields = {
  page,
  page_size: pageSize,
  request_id: optionalText,
  team_id: optionalText,
  user_id: optionalText,
  model: optionalText,
  status_filter: optional(z.enum(["success", "failure"])),
};

export function createLiteAdminOperations(context: OperationContext) {
  const usageSources = new Map<string, UsageChartSource>();
  const active = () => {
    context.signal.throwIfAborted();
    context.assertCurrent();
  };
  const auth = { accessToken: context.accessToken, signal: context.signal };
  const chartDefinition = {
    name: "render_usage_chart",
    description:
      "Show one chart with the answer using the source_id of a successful usage lookup in this turn. Choose daily_spend for spend over time, model_spend or provider_spend for cost comparisons, daily_requests or daily_tokens for trends, or token_breakdown for input/output/cache analysis. Values come directly from that lookup. Follow with a short explanation, not a duplicate table. A later chart replaces the earlier chart for this answer. Read-only.",
    parameters: usageChartRequestSchema,
    function: (rawArgs: unknown) => {
      active();
      context.beforeTool();
      const args = usageChartRequestSchema.parse(rawArgs);
      const source = usageSources.get(args.source_id);
      if (!source) return { success: false, message: "Fetch usage first and use the source_id from that result." };
      const chart = buildUsageChart(context.t, source, args.view);
      if (!chart)
        return { success: false, message: "No recorded data is available for this chart. Explain that in text." };
      context.onChart(chart);
      return { success: true, chart };
    },
  };
  const renderChart = zodFunction(chartDefinition);
  const operation =
    (mode: "read" | "write" | "delete", kind: ResultKind, extraArguments?: Record<string, unknown>) =>
    <Schema extends z.ZodType<Record<string, unknown>>>(
      name: string,
      titleKey: ActionTitleKey,
      schema: Schema,
      execute: (args: NullsStripped<z.output<Schema>>) => Promise<unknown>,
    ) => {
      const definition = {
        name,
        description: `${modelLocaleTitle(titleKey)}. Null means omitted or unchanged. ${mode === "read" ? "Read-only." : "Requires the administrator to review and confirm the change."}`,
        parameters: schema,
        function: async (rawArgs: unknown) => {
          const args = stripNulls(rawArgs as z.output<Schema>);
          active();
          context.beforeTool();
          const action: LiteAdminAction | undefined =
            mode === "read"
              ? undefined
              : {
                  id: crypto.randomUUID(),
                  name,
                  title: context.t(titleKey),
                  arguments: {
                    ...Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined)),
                    ...extraArguments,
                  },
                  destructive: mode === "delete",
                };
          if (action) {
            const approved = await context.confirm(action);
            active();
            if (!approved) throw new Error(context.t("errors.actionCancelled"));
          }
          const outcome = await Promise.resolve()
            .then(() => {
              active();
              return execute({ ...args, ...extraArguments } as NullsStripped<z.output<Schema>>);
            })
            .then(
              (value) => ({ ok: true, value }) as const,
              (error: unknown) => ({ ok: false, error }) as const,
            );
          active();
          if (!outcome.ok) {
            if (action) {
              const result: ActionResult = {
                status: "unknown",
                message: context.t("errors.changeUnverified"),
              };
              context.onResult(action, result);
              throw new Error(result.message);
            }
            return {
              operation: name,
              success: false,
              status: outcome.error instanceof ApiError ? outcome.error.status : undefined,
              message: context.t("errors.lookupFailed"),
            };
          }
          const key = name === "key_create" || name === "user_create" ? generatedKey(outcome.value) : undefined;
          if (action) context.onResult(action, { status: "completed", ...(key ? { key } : {}) });
          const result = projectToolResult(kind, outcome.value, [context.accessToken, ...(key ? [key] : [])]);
          let reportScope: ChartScopeKey = "chart.gatewayUsage";
          if (name === "get_team_usage_data") reportScope = "chart.allTeams";
          if (name === "get_tag_usage_data") reportScope = "chart.allTags";
          const chartInput = {
            value: result,
            query: args,
            access: context.access,
            defaultScopeKey: reportScope,
          };
          const source = kind === "usage" ? usageChartSource(context.t, chartInput) : undefined;
          const sourceId = source ? crypto.randomUUID() : undefined;
          if (source && sourceId) usageSources.set(sourceId, source);
          return {
            operation: name,
            success: true,
            result,
            ...(sourceId ? { source_id: sourceId } : {}),
          };
        },
      };
      return zodFunction(definition);
    };

  if (context.access.mode === "usage" && context.access.scope.type === "user") {
    const userId = context.access.scope.userId;
    return [
      renderChart,
      operation("read", "usage")("get_usage_data", "actions.usagePersonal", dated({}), (a) => {
        if (!userId.trim()) throw new Error(context.t("errors.signedInRequired"));
        return apiClient.get<unknown>("/user/daily/activity/aggregated", {
          ...auth,
          query: { ...a, user_id: userId, api_key_limit: 20 },
        });
      }),
    ];
  }

  const usageOperations = [
    renderChart,
    operation("read", "usage")("get_usage_data", "actions.usageGlobal", dated({ user_id: optionalText }), (a) =>
      apiClient.get<unknown>("/user/daily/activity/aggregated", { ...auth, query: { ...a, api_key_limit: 20 } }),
    ),
    operation("read", "usage")("get_team_usage_data", "actions.usageTeam", dated({ team_ids: optionalText }), (a) =>
      apiClient.get<unknown>("/team/daily/activity/aggregated", { ...auth, query: { ...a, api_key_limit: 20 } }),
    ),
    operation("read", "usage")("get_tag_usage_data", "actions.usageTag", dated({ tags: optionalText }), (a) =>
      apiClient.get<unknown>("/tag/daily/activity/aggregated", { ...auth, query: { ...a, api_key_limit: 20 } }),
    ),
  ];
  if (context.access.mode === "usage") return usageOperations;

  return [
    operation("read", "key")("keys_list", "actions.keysList", object(keysListFields), (a) =>
      apiClient.get<unknown>("/key/list", {
        ...auth,
        query: {
          page: a.page,
          size: a.page_size,
          search: a.search,
          team_id: a.team_id,
          user_id: a.user_id,
          return_full_object: true,
        },
      }),
    ),
    operation("read", "key")("key_info", "actions.keyInfo", object({ key: hash }), (a) =>
      apiClient.get<unknown>("/key/info", { ...auth, query: a }),
    ),
    operation("write", "key")("key_create", "actions.keyCreate", object(keyFields), (a) =>
      apiClient.post<unknown>("/key/generate", { ...auth, body: a satisfies Partial<Schemas["GenerateKeyRequest"]> }),
    ),
    operation("write", "key")("key_update", "actions.keyUpdate", object({ key: hash, ...keyFields }), (a) =>
      apiClient.post<unknown>("/key/update", { ...auth, body: a satisfies Partial<Schemas["UpdateKeyRequest"]> }),
    ),
    operation("write", "key", { team_id: null })(
      "key_detach_from_team",
      "actions.keyDetach",
      object({ key: hash }),
      (a) =>
        apiClient.post<unknown>("/key/update", { ...auth, body: a satisfies Partial<Schemas["UpdateKeyRequest"]> }),
    ),
    operation("delete", "key")("key_delete", "actions.keyDelete", object({ keys: z.array(hash).min(1).max(20) }), (a) =>
      apiClient.post<unknown>("/key/delete", { ...auth, body: a satisfies Schemas["KeyRequest"] }),
    ),
    operation("write", "key")("key_block", "actions.keyBlock", object({ key: hash }), (a) =>
      apiClient.post<unknown>("/key/block", { ...auth, body: a satisfies Schemas["BlockKeyRequest"] }),
    ),
    operation("write", "key")("key_unblock", "actions.keyUnblock", object({ key: hash }), (a) =>
      apiClient.post<unknown>("/key/unblock", { ...auth, body: a satisfies Schemas["BlockKeyRequest"] }),
    ),
    operation("read", "team")("teams_list", "actions.teamsList", object(teamsListFields), (a) =>
      apiClient.get<unknown>("/v2/team/list", { ...auth, query: a }),
    ),
    operation("read", "team")("team_info", "actions.teamInfo", object({ team_id: text }), (a) =>
      apiClient.get<unknown>("/team/info", { ...auth, query: { ...a, key_limit: 20 } }),
    ),
    operation("write", "team")("team_create", "actions.teamCreate", object(teamFields), (a) =>
      apiClient.post<unknown>("/team/new", { ...auth, body: a satisfies Partial<Schemas["NewTeamRequest"]> }),
    ),
    operation("write", "team")("team_update", "actions.teamUpdate", object({ team_id: text, ...teamFields }), (a) =>
      apiClient.post<unknown>("/team/update", { ...auth, body: a satisfies Schemas["UpdateTeamRequest"] }),
    ),
    operation("delete", "team")(
      "team_delete",
      "actions.teamDelete",
      object({ team_ids: z.array(text).min(1).max(20) }),
      (a) => apiClient.post<unknown>("/team/delete", { ...auth, body: a satisfies Schemas["DeleteTeamRequest"] }),
    ),
    operation("write", "team")("team_member_add", "actions.teamMemberAdd", object(teamMemberAddFields), (a) =>
      apiClient.post<unknown>("/team/member_add", { ...auth, body: a satisfies Schemas["TeamMemberAddRequest"] }),
    ),
    operation("write", "team")("team_member_update", "actions.teamMemberUpdate", object(teamMemberUpdateFields), (a) =>
      apiClient.post<unknown>("/team/member_update", {
        ...auth,
        body: a satisfies Schemas["TeamMemberUpdateRequest"],
      }),
    ),
    operation("delete", "team")(
      "team_member_delete",
      "actions.teamMemberDelete",
      object({ team_id: text, user_id: text }),
      (a) =>
        apiClient.post<unknown>("/team/member_delete", {
          ...auth,
          body: a satisfies Schemas["TeamMemberDeleteRequest"],
        }),
    ),
    operation("read", "user")(
      "users_list",
      "actions.usersList",
      object({ page, page_size: pageSize, search: optionalText }),
      (a) => apiClient.get<unknown>("/user/list", { ...auth, query: a }),
    ),
    operation("read", "user")("user_info", "actions.userInfo", object({ user_id: text }), (a) =>
      apiClient.get<unknown>("/v2/user/info", { ...auth, query: a }),
    ),
    operation("write", "user", { auto_create_key: false })(
      "user_create",
      "actions.userCreate",
      object({ user_id: optionalText, ...userFields }),
      (a) => apiClient.post<unknown>("/user/new", { ...auth, body: a satisfies Partial<Schemas["NewUserRequest"]> }),
    ),
    operation("write", "user")("user_update", "actions.userUpdate", object({ user_id: text, ...userFields }), (a) =>
      apiClient.post<unknown>("/user/update", { ...auth, body: a satisfies Partial<Schemas["UpdateUserRequest"]> }),
    ),
    operation("delete", "user")(
      "user_delete",
      "actions.userDelete",
      object({ user_ids: z.array(text).min(1).max(20) }),
      (a) => apiClient.post<unknown>("/user/delete", { ...auth, body: a satisfies Schemas["DeleteUserRequest"] }),
    ),
    operation("read", "budget")(
      "budgets_list",
      "actions.budgetsList",
      object({ page, page_size: pageSize, search: optionalText }),
      (a) =>
        apiClient.get<unknown>("/management/v1/budgets", {
          ...auth,
          query: { page: a.page, page_size: a.page_size, q: a.search },
        }),
    ),
    operation("read", "budget")(
      "budget_info",
      "actions.budgetInfo",
      object({ budgets: z.array(text).min(1).max(20) }),
      (a) => apiClient.post<unknown>("/budget/info", { ...auth, body: a satisfies Schemas["BudgetRequest"] }),
    ),
    operation("write", "budget")(
      "budget_create",
      "actions.budgetCreate",
      object({ budget_id: optionalText, ...limits }),
      (a) => apiClient.post<unknown>("/budget/new", { ...auth, body: a satisfies Schemas["BudgetNewRequest"] }),
    ),
    operation("write", "budget")("budget_update", "actions.budgetUpdate", object({ budget_id: text, ...limits }), (a) =>
      apiClient.post<unknown>("/budget/update", { ...auth, body: a satisfies Schemas["BudgetNewRequest"] }),
    ),
    operation("delete", "budget")("budget_delete", "actions.budgetDelete", object({ id: text }), (a) =>
      apiClient.post<unknown>("/budget/delete", { ...auth, body: a satisfies Schemas["BudgetDeleteRequest"] }),
    ),
    operation("read", "spend")("spend_report", "actions.spendReport", dated(spendReportFields), (a) =>
      apiClient.get<unknown>("/global/spend/report", { ...auth, query: a }),
    ),
    operation("read", "spend")("team_spend_report", "actions.teamSpendReport", dated({ team_id: text }), (a) =>
      apiClient.get<unknown>("/team/spend/report", { ...auth, query: a }),
    ),
    operation("read", "spend")("key_spend_report", "actions.keySpendReport", dated({ api_key: hash }), (a) =>
      apiClient.get<unknown>("/key/spend/report", { ...auth, query: a }),
    ),
    ...usageOperations,
    operation("read", "log")("request_logs", "actions.requestLogs", dated(requestLogsFields), (a) =>
      apiClient.get<unknown>("/spend/logs/ui", {
        ...auth,
        query: { ...a, start_date: `${a.start_date} 00:00:00`, end_date: `${a.end_date} 23:59:59` },
      }),
    ),
  ];
}
