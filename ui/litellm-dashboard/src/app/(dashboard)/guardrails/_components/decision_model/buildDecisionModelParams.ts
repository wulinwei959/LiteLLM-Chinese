import type { GuardrailsTranslator } from "@/lib/i18n/translators";

export interface DecisionModelCheckDraft {
  id: string;
  name: string;
  instructions: string;
  action: "block" | "log";
  threshold: number;
}

export interface DecisionModelLitellmParams {
  decision_model: string;
  checks: Array<{
    name: string;
    instructions: string;
    action: "block" | "log";
    threshold: number;
  }>;
}

export function trimDecisionChecks(checks: readonly DecisionModelCheckDraft[]): readonly DecisionModelCheckDraft[] {
  return checks.map((check) => ({ ...check, name: check.name.trim(), instructions: check.instructions.trim() }));
}

export function duplicateDecisionCheckNames(checks: readonly DecisionModelCheckDraft[]): ReadonlySet<string> {
  const names = trimDecisionChecks(checks)
    .map((check) => check.name)
    .filter(Boolean);
  return new Set(names.filter((name, index) => names.indexOf(name) !== index));
}

export function decisionChecksProblem(
  checks: readonly DecisionModelCheckDraft[],
  t: GuardrailsTranslator,
): string | null {
  const trimmed = trimDecisionChecks(checks);
  if (trimmed.length === 0) return t("decisionModel.problemEmpty");
  if (trimmed.some((check) => !check.name || !check.instructions)) {
    return t("decisionModel.problemIncomplete");
  }
  if (duplicateDecisionCheckNames(checks).size > 0) return t("decisionModel.problemDuplicateName");
  return null;
}

const clampThreshold = (value: number): number => Math.min(1, Math.max(0, value));

export function buildDecisionModelParams(
  decisionModel: string,
  checks: readonly DecisionModelCheckDraft[],
): DecisionModelLitellmParams {
  return {
    decision_model: decisionModel,
    checks: trimDecisionChecks(checks).map((check) => ({
      name: check.name,
      instructions: check.instructions,
      action: check.action,
      threshold: clampThreshold(check.threshold),
    })),
  };
}
