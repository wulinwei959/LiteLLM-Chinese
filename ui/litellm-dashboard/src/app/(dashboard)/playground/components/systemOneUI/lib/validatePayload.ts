import { z } from "zod";
import type { SystemOneTranslator } from "@/lib/i18n/translators";
import { issueLabel } from "./issueLabel";
import { buildOpenAIDecisionsRequestSchema, type OpenAIDecisionsRequest } from "./openAIDecisions";
import {
  buildDecisionsRequestSchema,
  buildSystemOneRequestSchema,
  type DecisionEndpoint,
  type PlaygroundRequest,
} from "./schemas";

const RECOMMENDED_MAX_SCORE_LEVELS = 10;

export interface SystemOnePayloadIssue {
  path: string;
  label: string;
  message: string;
  severity: "error" | "warning";
}

export interface PayloadValidation<T> {
  isValid: boolean;
  payload?: T;
  issues: SystemOnePayloadIssue[];
}

export type SystemOnePayloadValidation = PayloadValidation<PlaygroundRequest>;

export const errorCount = (validation: PayloadValidation<unknown>): number =>
  validation.issues.filter((issue) => issue.severity === "error").length;

const error = (path: readonly PropertyKey[], message: string, t: SystemOneTranslator): SystemOnePayloadIssue => ({
  path: path.length > 0 ? path.join(".") : "root",
  label: issueLabel(path, t),
  message,
  severity: "error",
});

const toIssue = (path: PropertyKey[], message: string, t: SystemOneTranslator): SystemOnePayloadIssue =>
  path[0] === "questions" && path[1] === ""
    ? error(["questions"], t("validation.giveQuestionName"), t)
    : error(path, message, t);

const invalid = (path: string, message: string, t: SystemOneTranslator) => ({
  isValid: false,
  issues: [error([path], message, t)],
});

export function parseJson(raw: string): { ok: true; value: unknown } | { ok: false; message: string } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (cause: unknown) {
    return { ok: false, message: cause instanceof Error ? cause.message : String(cause) };
  }
}

const scoreLevelWarnings = (payload: PlaygroundRequest, t: SystemOneTranslator): SystemOnePayloadIssue[] =>
  Object.entries(payload.questions)
    .filter(([, question]) => question.type === "score" && question.criteria.length > RECOMMENDED_MAX_SCORE_LEVELS)
    .map(([id]) => ({
      path: `questions.${id}.criteria`,
      label: issueLabel(["questions", id, "criteria"], t),
      message: t("validation.tooManyScoreLevels", { count: RECOMMENDED_MAX_SCORE_LEVELS }),
      severity: "warning",
    }));

function validatePayload<T>(raw: string, schema: z.ZodType<T>, t: SystemOneTranslator): PayloadValidation<T> {
  if (!raw.trim()) {
    return invalid("root", t("validation.emptyPayload"), t);
  }

  const json = parseJson(raw);
  if (!json.ok) {
    return invalid("syntax", t("validation.invalidJson", { message: json.message }), t);
  }

  const result = schema.safeParse(json.value);
  if (!result.success) {
    return {
      isValid: false,
      issues: result.error.issues.map((issue) => toIssue(issue.path, issue.message, t)),
    };
  }

  return { isValid: true, payload: result.data, issues: [] };
}

const isBlankContext = (context: unknown): boolean =>
  (typeof context === "string" && context.trim() === "") || (Array.isArray(context) && context.length === 0);

const isMissingContext = (raw: string, path: "state" | "input"): boolean => {
  const json = parseJson(raw);
  if (!json.ok || typeof json.value !== "object" || json.value === null) {
    return false;
  }
  return isBlankContext((json.value as Record<string, unknown>)[path]);
};

const requireContext = <T>(
  raw: string,
  path: "state" | "input",
  result: PayloadValidation<T>,
  t: SystemOneTranslator,
): PayloadValidation<T> =>
  isMissingContext(raw, path)
    ? {
        ...result,
        isValid: false,
        issues: [error([path], t("validation.addTextToDecide"), t)],
      }
    : result;

export function validateSystemOnePayload(
  raw: string,
  t: SystemOneTranslator,
  endpoint: DecisionEndpoint = "/typesafe/v1/systemone",
): SystemOnePayloadValidation {
  const schema = endpoint === "/v1/systemone" ? buildDecisionsRequestSchema(t) : buildSystemOneRequestSchema(t);
  const result = validatePayload<PlaygroundRequest>(raw, schema, t);
  return requireContext(
    raw,
    "state",
    result.payload ? { ...result, issues: scoreLevelWarnings(result.payload, t) } : result,
    t,
  );
}

export function validateOpenAIDecisionsPayload(
  raw: string,
  t: SystemOneTranslator,
): PayloadValidation<OpenAIDecisionsRequest> {
  const result = validatePayload<OpenAIDecisionsRequest>(raw, buildOpenAIDecisionsRequestSchema(t), t);
  return requireContext(raw, "input", result, t);
}
