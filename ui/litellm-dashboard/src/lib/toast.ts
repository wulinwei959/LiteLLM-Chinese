import type { ReactNode } from "react";
import { toast as sonner } from "sonner";
import { ApiError, deriveErrorMessage, unwrapProxyErrorMessage } from "@/lib/http/client";
import { DEFAULT_UI_LOCALE, isUiLocale, type UiLocale } from "@/lib/i18n/locales";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh-CN.json";

export type ToastKind = "success" | "info" | "warning" | "error";

export type ToastOptions = {
  readonly description?: ReactNode;
  readonly durationMs?: number;
};

type ErrorFacts = {
  readonly status: number | undefined;
  readonly proxyType: string | undefined;
  readonly text: string;
};

const DEFAULT_DURATION_MS: Readonly<Record<ToastKind, number>> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 6000,
};

const ERROR_TITLE_CATALOG: Readonly<Record<UiLocale, Readonly<Record<string, string>>>> = {
  en: enMessages.toast,
  "zh-CN": zhMessages.toast,
};

const currentUiLocale = (): UiLocale =>
  typeof document !== "undefined" && isUiLocale(document.documentElement.lang)
    ? document.documentElement.lang
    : DEFAULT_UI_LOCALE;

const errorTitle = (category: string): string =>
  ERROR_TITLE_CATALOG[currentUiLocale()][category] ?? ERROR_TITLE_CATALOG[DEFAULT_UI_LOCALE][category] ?? category;

const PROXY_TYPE_CATEGORIES: Readonly<Record<string, string>> = {
  budget_exceeded: "budget",
  no_db_connection: "service",
  expired_key: "auth",
  token_not_found_in_db: "auth",
  team_member_permission_error: "forbidden",
  not_found_error: "notFound",
  validation_error: "validation",
  bad_request_error: "request",
  team_member_already_in_team: "conflict",
};

const STATUS_CATEGORIES: Readonly<Record<number, string>> = {
  400: "request",
  401: "auth",
  403: "forbidden",
  404: "notFound",
  409: "conflict",
  422: "validation",
  429: "rateLimit",
  503: "service",
};

const WARNING_CATEGORIES: ReadonlySet<string> = new Set(["budget", "rateLimit"]);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" ? (value as Record<string, unknown>) : undefined;

const parseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

const toStatus = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && /^\d{3}$/.test(value)) return Number(value);
  return undefined;
};

const proxyEnvelope = (payload: unknown): Record<string, unknown> | undefined => {
  const record = asRecord(payload);
  return asRecord(record?.error) ?? record;
};

const proxyTypeOf = (payload: unknown): string | undefined => {
  const type = proxyEnvelope(payload)?.type;
  return typeof type === "string" ? type : undefined;
};

const EMBEDDED_JSON = /\{[\s\S]*\}/;

const describeText = (text: string): ErrorFacts => {
  const embedded = text.match(EMBEDDED_JSON)?.[0];
  const parsed = embedded === undefined ? undefined : parseJson(embedded);
  if (embedded === undefined || asRecord(parsed) === undefined) {
    return { status: undefined, proxyType: undefined, text: unwrapProxyErrorMessage(text) };
  }
  return {
    status: toStatus(proxyEnvelope(parsed)?.code),
    proxyType: proxyTypeOf(parsed),
    text: text.replace(embedded, unwrapProxyErrorMessage(deriveErrorMessage(parsed))).trim(),
  };
};

const describeError = (input: unknown): ErrorFacts => {
  if (input instanceof ApiError) {
    return { status: input.status, proxyType: proxyTypeOf(input.body), text: unwrapProxyErrorMessage(input.message) };
  }
  if (input instanceof Error || typeof input === "string") {
    return describeText(input instanceof Error ? input.message : input);
  }
  const record = asRecord(input) ?? {};
  const response = asRecord(record.response);
  const payload = asRecord(response?.data) ?? record;
  return {
    status:
      toStatus(response?.status) ??
      toStatus(record.status_code) ??
      toStatus(record.code) ??
      toStatus(proxyEnvelope(payload)?.code),
    proxyType: proxyTypeOf(payload),
    text: unwrapProxyErrorMessage(deriveErrorMessage(payload)),
  };
};

const categoryForStatus = (status: number): string => {
  const known = STATUS_CATEGORIES[status];
  if (known !== undefined) return known;
  if (status >= 500) return "server";
  if (status >= 400) return "request";
  return "generic";
};

const categoryFor = ({ status, proxyType }: ErrorFacts): string => {
  if (proxyType?.endsWith("_access_denied")) return "forbidden";
  const byType = proxyType === undefined ? undefined : PROXY_TYPE_CATEGORIES[proxyType];
  if (byType !== undefined) return byType;
  return status === undefined ? "generic" : categoryForStatus(status);
};

const show = (kind: ToastKind, message: ReactNode, options?: ToastOptions): void => {
  sonner[kind](message, {
    description: options?.description,
    duration: options?.durationMs ?? DEFAULT_DURATION_MS[kind],
  });
};

export const toast = {
  success: (message: ReactNode, options?: ToastOptions): void => show("success", message, options),
  info: (message: ReactNode, options?: ToastOptions): void => show("info", message, options),
  warning: (message: ReactNode, options?: ToastOptions): void => show("warning", message, options),
  error: (message: ReactNode, options?: ToastOptions): void => show("error", message, options),
  fromError: (input: unknown, options?: ToastOptions): void => {
    const facts = describeError(input);
    const category = categoryFor(facts);
    show(WARNING_CATEGORIES.has(category) ? "warning" : "error", errorTitle(category), {
      description: facts.text,
      ...options,
    });
  },
  dismiss: (): void => {
    sonner.dismiss();
  },
} as const;
