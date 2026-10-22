import type { useTranslations } from "next-intl";

export type ErrorsTranslator = ReturnType<typeof useTranslations<"usage.errors">>;

export interface RequestErrorDailyEntry {
  date: string;
  successful_requests: number;
  failed_requests: number;
  client_errors: number;
  server_errors: number;
  by_status_code: { status_code: number; failed_requests: number }[];
}

export interface RequestErrorEntityEntry {
  id: string;
  label: string | null;
  api_requests: number;
  failed_requests: number;
  top_status_code: number | null;
  top_status_code_requests: number;
}

export interface RequestErrorActivity {
  total_successful_requests: number;
  total_failed_requests: number;
  by_date: RequestErrorDailyEntry[];
  by_status_code: { status_code: number; failed_requests: number }[];
  by_key: RequestErrorEntityEntry[];
  by_team: RequestErrorEntityEntry[];
  by_user: RequestErrorEntityEntry[];
  by_model: RequestErrorEntityEntry[];
}

export const ERROR_ENTITY_KINDS = ["key", "team", "user", "model"] as const;
export type ErrorEntityKind = (typeof ERROR_ENTITY_KINDS)[number];

export const errorEntityLabel = (kind: ErrorEntityKind, t: ErrorsTranslator): { singular: string; plural: string } =>
  ({
    key: { singular: t("entity.key.singular"), plural: t("entity.key.plural") },
    team: { singular: t("entity.team.singular"), plural: t("entity.team.plural") },
    user: { singular: t("entity.user.singular"), plural: t("entity.user.plural") },
    model: { singular: t("entity.model.singular"), plural: t("entity.model.plural") },
  })[kind];

const STATUS_LABEL_KEY: Record<number, string> = {
  400: "status.badRequest",
  401: "status.unauthorized",
  402: "status.paymentRequired",
  403: "status.forbidden",
  404: "status.notFound",
  408: "status.requestTimeout",
  413: "status.payloadTooLarge",
  422: "status.unprocessableEntity",
  429: "status.rateLimited",
  500: "status.internalServerError",
  502: "status.badGateway",
  503: "status.serviceUnavailable",
  504: "status.gatewayTimeout",
};

export const statusCodeLabel = (code: number, t: ErrorsTranslator): string => {
  if (code === 0) return t("status.notRecorded");
  const known = STATUS_LABEL_KEY[code];
  if (known) return t(known as Parameters<ErrorsTranslator>[0]);
  if (code >= 500) return t("status.serverError");
  if (code >= 400) return t("status.clientError");
  return t("status.error");
};

export const errorRate = (failed: number, total: number): number | null => (total > 0 ? (failed / total) * 100 : null);

export const formatRate = (rate: number | null): string => {
  if (rate === null) return "—";
  if (rate > 0 && rate < 0.1) return "<0.1%";
  return `${rate.toFixed(1)}%`;
};

export interface ErrorSummary {
  requests: number;
  failed: number;
  rate: number | null;
  clientErrors: number;
  serverErrors: number;
  rateLimited: number;
  authFailures: number;
}

export const errorSummary = (activity: RequestErrorActivity): ErrorSummary => {
  const requests = activity.total_successful_requests + activity.total_failed_requests;
  const byCode = (predicate: (code: number) => boolean) =>
    activity.by_status_code
      .filter((row) => predicate(row.status_code))
      .reduce((sum, row) => sum + row.failed_requests, 0);
  return {
    requests,
    failed: activity.total_failed_requests,
    rate: errorRate(activity.total_failed_requests, requests),
    clientErrors: byCode((code) => code >= 400 && code <= 499),
    serverErrors: byCode((code) => code >= 500 && code <= 599),
    rateLimited: byCode((code) => code === 429),
    authFailures: byCode((code) => code === 401 || code === 403),
  };
};

export interface ErrorSeriesRow extends Record<string, unknown> {
  date: string;
  requests: number;
  failed: number;
  rate: number;
}

export interface ErrorSeries {
  rows: ErrorSeriesRow[];
  codes: string[];
}

export const ERROR_SERIES_MAX_CODES = 6;

const seriesKey = (code: number, t: ErrorsTranslator): string => (code === 0 ? t("status.noStatus") : String(code));

export const errorSeries = (activity: RequestErrorActivity, t: ErrorsTranslator): ErrorSeries => {
  const other = t("other");
  const ranked = [...activity.by_status_code]
    .filter((row) => row.failed_requests > 0)
    .sort((a, b) => b.failed_requests - a.failed_requests || a.status_code - b.status_code);
  const shown = ranked.slice(0, ERROR_SERIES_MAX_CODES).map((row) => row.status_code);
  const codes = shown.map((code) => seriesKey(code, t));
  const needsOther = ranked.length > shown.length || activity.by_date.some(hasUnrecordedFailures);
  const rows = [...activity.by_date]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => {
      const requests = day.successful_requests + day.failed_requests;
      const counts: Record<string, number> = Object.fromEntries(
        shown.map((code) => [
          seriesKey(code, t),
          day.by_status_code.find((entry) => entry.status_code === code)?.failed_requests ?? 0,
        ]),
      );
      const recorded = Object.values(counts).reduce((sum, count) => sum + count, 0);
      const otherCounts: Record<string, number> = needsOther
        ? { [other]: Math.max(0, day.failed_requests - recorded) }
        : {};
      return {
        date: day.date,
        requests,
        failed: day.failed_requests,
        rate: errorRate(day.failed_requests, requests) ?? 0,
        ...counts,
        ...otherCounts,
      };
    });
  return { rows, codes: needsOther ? [...codes, other] : codes };
};

export type ErrorRateView = "total" | "status";

export const errorRateViewOptions = (t: ErrorsTranslator): readonly { value: ErrorRateView; label: string }[] => [
  { value: "total", label: t("view.total") },
  { value: "status", label: t("view.byStatusCode") },
];

export const rateByStatusRows = (series: ErrorSeries): ErrorSeriesRow[] =>
  series.rows.map((row) => ({
    date: row.date,
    requests: row.requests,
    failed: row.failed,
    rate: row.rate,
    ...Object.fromEntries(series.codes.map((code) => [code, errorRate(Number(row[code] ?? 0), row.requests) ?? 0])),
  }));

const hasUnrecordedFailures = (day: RequestErrorDailyEntry): boolean =>
  day.failed_requests > day.by_status_code.reduce((sum, entry) => sum + entry.failed_requests, 0);

export interface StatusCodeRow {
  status_code: number;
  label: string;
  failed_requests: number;
  share: number;
}

export const statusCodeRows = (activity: RequestErrorActivity, t: ErrorsTranslator): StatusCodeRow[] => {
  const recorded = activity.by_status_code.reduce((sum, row) => sum + row.failed_requests, 0);
  const notRecorded = Math.max(0, activity.total_failed_requests - recorded);
  const recordedRows = activity.by_status_code
    .filter((row) => row.failed_requests > 0)
    .map((row) => ({
      status_code: row.status_code,
      label: statusCodeLabel(row.status_code, t),
      failed_requests: row.failed_requests,
    }));
  const unrecordedRows =
    notRecorded > 0 ? [{ status_code: 0, label: statusCodeLabel(0, t), failed_requests: notRecorded }] : [];
  const total = activity.total_failed_requests || 1;
  return [...recordedRows, ...unrecordedRows]
    .sort((a, b) => b.failed_requests - a.failed_requests || a.status_code - b.status_code)
    .map((row) => ({ ...row, share: (row.failed_requests / total) * 100 }));
};

export interface ErrorEntityRow {
  id: string;
  name: string;
  requests: number;
  failed: number;
  rate: number | null;
  topStatus: string | null;
}

export const entityRows = (
  activity: RequestErrorActivity,
  kind: ErrorEntityKind,
  t: ErrorsTranslator,
): ErrorEntityRow[] => {
  const source = { key: activity.by_key, team: activity.by_team, user: activity.by_user, model: activity.by_model }[
    kind
  ];
  return source.map((entry) => ({
    id: entry.id,
    name: entry.label ?? entry.id,
    requests: entry.api_requests,
    failed: entry.failed_requests,
    rate: errorRate(entry.failed_requests, entry.api_requests),
    topStatus:
      entry.top_status_code === null
        ? null
        : `${entry.top_status_code === 0 ? t("status.noStatus") : entry.top_status_code} · ${entry.top_status_code_requests.toLocaleString()}`,
  }));
};
