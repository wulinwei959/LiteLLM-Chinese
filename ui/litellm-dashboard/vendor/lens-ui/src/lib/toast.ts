import type { ReactNode } from "react";
import { toast as sonner } from "sonner";
import { ApiError, deriveErrorMessage, unwrapProxyErrorMessage } from "./http/client";
import { lensTranslate } from "../host/lensTranslate";

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

const PROXY_TYPE_TITLES: Readonly<Record<string, string>> = {
  get budget_exceeded() { return lensTranslate("lib.budgetExceeded"); },
  get no_db_connection() { return lensTranslate("lib.serviceUnavailable"); },
  get expired_key() { return lensTranslate("lib.authenticationError"); },
  get token_not_found_in_db() { return lensTranslate("lib.authenticationError"); },
  get team_member_permission_error() { return lensTranslate("lib.accessDenied"); },
  get not_found_error() { return lensTranslate("lib.found"); },
  get validation_error() { return lensTranslate("lib.validationError"); },
  get bad_request_error() { return lensTranslate("lib.requestError"); },
  get team_member_already_in_team() { return lensTranslate("lib.alreadyExists"); },
};

const STATUS_TITLES: Readonly<Record<number, string>> = {
  get ["400"]() { return lensTranslate("lib.requestError"); },
  get ["401"]() { return lensTranslate("lib.authenticationError"); },
  get ["403"]() { return lensTranslate("lib.accessDenied"); },
  get ["404"]() { return lensTranslate("lib.found"); },
  get ["409"]() { return lensTranslate("lib.alreadyExists"); },
  get ["422"]() { return lensTranslate("lib.validationError"); },
  get ["429"]() { return lensTranslate("lib.rateLimitExceeded"); },
  get ["503"]() { return lensTranslate("lib.serviceUnavailable"); },
};

const isWarning = ({ status, proxyType }: ErrorFacts): boolean =>
  proxyType === "budget_exceeded" || status === 429;

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

const titleForStatus = (status: number): string => {
  const known = STATUS_TITLES[status];
  if (known !== undefined) return known;
  if (status >= 500) return lensTranslate("lib.serverError");
  if (status >= 400) return lensTranslate("lib.requestError");
  return lensTranslate("lib.error");
};

const titleFor = ({ status, proxyType }: ErrorFacts): string => {
  if (proxyType?.endsWith("_access_denied")) return lensTranslate("lib.accessDenied");
  const byType = proxyType === undefined ? undefined : PROXY_TYPE_TITLES[proxyType];
  if (byType !== undefined) return byType;
  return status === undefined ? lensTranslate("lib.error") : titleForStatus(status);
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
    const title = titleFor(facts);
    show(isWarning(facts) ? "warning" : "error", title, { description: facts.text, ...options });
  },
  dismiss: (): void => {
    sonner.dismiss();
  },
} as const;
