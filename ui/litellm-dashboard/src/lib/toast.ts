import type { ReactNode } from "react";
import { toast as sonner } from "sonner";
import { ApiError, deriveErrorMessage, unwrapProxyErrorMessage } from "@/lib/http/client";

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

type ToastTitle = {
  readonly category: string;
  readonly label: string;
};

const DEFAULT_DURATION_MS: Readonly<Record<ToastKind, number>> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 6000,
};

const PROXY_TYPE_TITLES: Readonly<Record<string, ToastTitle>> = {
  budget_exceeded: { category: "budget", label: "Budget Exceeded" },
  no_db_connection: { category: "service", label: "Service Unavailable" },
  expired_key: { category: "auth", label: "Authentication Error" },
  token_not_found_in_db: { category: "auth", label: "Authentication Error" },
  team_member_permission_error: { category: "forbidden", label: "Access Denied" },
  not_found_error: { category: "not_found", label: "Not Found" },
  validation_error: { category: "validation", label: "Validation Error" },
  bad_request_error: { category: "request", label: "Request Error" },
  team_member_already_in_team: { category: "conflict", label: "Already Exists" },
};

const STATUS_TITLES: Readonly<Record<number, ToastTitle>> = {
  400: { category: "request", label: "Request Error" },
  401: { category: "auth", label: "Authentication Error" },
  403: { category: "forbidden", label: "Access Denied" },
  404: { category: "not_found", label: "Not Found" },
  409: { category: "conflict", label: "Already Exists" },
  422: { category: "validation", label: "Validation Error" },
  429: { category: "rate_limit", label: "Rate Limit Exceeded" },
  503: { category: "service", label: "Service Unavailable" },
};

const WARNING_CATEGORIES: ReadonlySet<string> = new Set(["budget", "rate_limit"]);

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

const titleForStatus = (status: number): ToastTitle => {
  const known = STATUS_TITLES[status];
  if (known !== undefined) return known;
  if (status >= 500) return { category: "server", label: "Server Error" };
  if (status >= 400) return { category: "request", label: "Request Error" };
  return { category: "generic", label: "Error" };
};

const titleFor = ({ status, proxyType }: ErrorFacts): ToastTitle => {
  if (proxyType?.endsWith("_access_denied")) return { category: "forbidden", label: "Access Denied" };
  const byType = proxyType === undefined ? undefined : PROXY_TYPE_TITLES[proxyType];
  if (byType !== undefined) return byType;
  return status === undefined ? { category: "generic", label: "Error" } : titleForStatus(status);
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
    const { category, label } = titleFor(facts);
    show(WARNING_CATEGORIES.has(category) ? "warning" : "error", label, { description: facts.text, ...options });
  },
  dismiss: (): void => {
    sonner.dismiss();
  },
} as const;
