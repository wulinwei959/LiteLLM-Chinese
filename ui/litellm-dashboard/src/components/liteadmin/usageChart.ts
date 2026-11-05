import { z } from "zod";
import type { LiteAdminTranslator } from "@/lib/i18n/translators";
import type { AriaAccess } from "./operations";

export const usageChartRequestSchema = z.strictObject({
  source_id: z.string().min(1).max(100),
  view: z.enum(["daily_spend", "model_spend", "provider_spend", "daily_requests", "daily_tokens", "token_breakdown"]),
});

type UsageChartView = z.infer<typeof usageChartRequestSchema>["view"];
export type ChartScopeKey = "chart.gatewayUsage" | "chart.allTeams" | "chart.allTags";
const metric = z.number().finite().nonnegative().nullish();
const metricFields = {
  spend: metric,
  api_requests: metric,
  total_tokens: metric,
  prompt_tokens: metric,
  completion_tokens: metric,
  cache_read_input_tokens: metric,
  cache_creation_input_tokens: metric,
};
const metrics = z.object(metricFields);
const usageReportSchema = z.object({
  daily: z.array(metrics.extend({ date: z.iso.date() })).max(367),
  top_models: z.array(metrics.extend({ name: z.string().nullish() })).max(20),
  top_providers: z.array(metrics.extend({ name: z.string().nullish() })).max(20),
});
const queryFields = {
  start_date: z.iso.date(),
  end_date: z.iso.date(),
  user_id: z.string().nullish(),
  team_ids: z.string().nullish(),
  tags: z.string().nullish(),
};
const usageQuerySchema = z.object(queryFields);

export interface UsageChartSource {
  report: z.infer<typeof usageReportSchema>;
  period: string;
  scope: string;
}

export interface UsageChart {
  kind: "bar" | "line";
  title: string;
  period: string;
  scope: string;
  unit: "usd" | "requests" | "tokens";
  total: number | null;
  data: { label: string; value: number | null }[];
  note?: string;
}

export interface UsageChartSourceInput {
  readonly value: unknown;
  readonly query: unknown;
  readonly access: AriaAccess;
  readonly defaultScopeKey?: ChartScopeKey;
}

export function usageChartSource(t: LiteAdminTranslator, input: UsageChartSourceInput): UsageChartSource | undefined {
  const { value, query, access, defaultScopeKey = "chart.gatewayUsage" } = input;
  const report = usageReportSchema.safeParse(value);
  const args = usageQuerySchema.safeParse(query);
  if (!report.success || !args.success) return undefined;
  const { start_date, end_date, user_id, team_ids, tags } = args.data;
  const filters = [
    user_id && t("chart.userScope", { userId: user_id }),
    team_ids && t("chart.teamsScope", { teamIds: team_ids }),
    tags && t("chart.tagsScope", { tags }),
  ].filter(Boolean);
  const scope =
    access.mode === "usage" && access.scope.type === "user"
      ? t("chart.yourUsage")
      : filters.join(" · ") || t(defaultScopeKey);
  return { report: report.data, period: t("chart.periodRange", { from: start_date, to: end_date }), scope };
}

function knownTotal(values: readonly (number | null | undefined)[]): number | null {
  if (values.length === 0 || values.some((value) => value == null)) return null;
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function rankedData(
  t: LiteAdminTranslator,
  source: UsageChartSource,
  dimension: "top_models" | "top_providers",
): { data: UsageChart["data"]; hasOther: boolean } {
  const ranked = [...source.report[dimension]].sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0));
  const shown = ranked
    .slice(0, 6)
    .map((row) => ({ label: row.name || t("chart.unknownModel"), value: row.spend ?? null }));
  const total = knownTotal(source.report.daily.map((day) => day.spend));
  const visibleTotal = knownTotal(shown.map((row) => row.value));
  const remainder = total == null || visibleTotal == null ? null : total - visibleTotal;
  if (remainder == null || remainder <= 1e-10) return { data: shown, hasOther: false };
  return { data: [...shown, { label: t("chart.other"), value: remainder }], hasOther: true };
}

const dailyViews = {
  daily_spend: { titleKey: "chart.dailySpend", metric: "spend", unit: "usd" },
  daily_requests: { titleKey: "chart.dailyRequests", metric: "api_requests", unit: "requests" },
  daily_tokens: { titleKey: "chart.dailyTokens", metric: "total_tokens", unit: "tokens" },
} as const satisfies Record<string, { titleKey: string; metric: string; unit: UsageChart["unit"] }>;

export function buildUsageChart(
  t: LiteAdminTranslator,
  source: UsageChartSource,
  view: UsageChartView,
): UsageChart | undefined {
  const base = { period: source.period, scope: source.scope };
  if (view === "model_spend" || view === "provider_spend") {
    const ranked = rankedData(t, source, view === "model_spend" ? "top_models" : "top_providers");
    if (ranked.data.length === 0) return undefined;
    return {
      ...base,
      kind: "bar",
      title: t(view === "model_spend" ? "chart.modelSpend" : "chart.providerSpend"),
      unit: "usd",
      total: knownTotal(source.report.daily.map((day) => day.spend)),
      data: ranked.data,
      note: ranked.hasOther ? t("chart.sixLeadingOther") : undefined,
    };
  }
  if (view === "token_breakdown") {
    if (source.report.daily.length === 0) return undefined;
    const tokenFields = [
      [t("chart.prompt"), "prompt_tokens"],
      [t("chart.completion"), "completion_tokens"],
      [t("chart.cacheRead"), "cache_read_input_tokens"],
      [t("chart.cacheCreation"), "cache_creation_input_tokens"],
    ] as const;
    return {
      ...base,
      kind: "bar",
      title: t("chart.tokenBreakdown"),
      unit: "tokens",
      total: knownTotal(source.report.daily.map((day) => day.total_tokens)),
      data: tokenFields.map(([label, field]) => ({
        label,
        value: knownTotal(source.report.daily.map((day) => day[field as "prompt_tokens"])),
      })),
      note: t("chart.cacheNote"),
    };
  }
  const config = dailyViews[view];
  const data = [...source.report.daily]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({ label: day.date, value: day[config.metric] ?? null }));
  if (data.length === 0) return undefined;
  return {
    ...base,
    kind: "line",
    title: t(config.titleKey),
    unit: config.unit,
    total: knownTotal(data.map((point) => point.value)),
    data,
  };
}

export function formatUsageChartValue(t: LiteAdminTranslator, value: number | null, unit: UsageChart["unit"]): string {
  if (value == null) return t("chart.unavailable");
  return unit === "usd"
    ? value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 })
    : value.toLocaleString("en-US");
}
