import { compareSteps, firstTrial } from "./steps";
import type { RunCase } from "./types";
import { lensTranslate } from "../../../../host/lensTranslate";

export interface Diagnosis {
  readonly headline: string;
  readonly details: readonly string[];
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

function failedChecks(runCase: RunCase): string[] {
  const failures = new Map<string, number>();
  for (const trial of runCase.trials)
    for (const check of trial.checks)
      if (!check.passed)
        failures.set(check.scorer, (failures.get(check.scorer) ?? 0) + 1);
  return [...failures].map(
    ([scorer, count]) =>
      lensTranslate("evals.value0FailedValue1Value2", { value0: scorer, value1: count, value2: runCase.trials.length }),
  );
}

function stepChanges(candidate: RunCase, baseline: RunCase | null): string[] {
  const candidateSteps = firstTrial(candidate.trials)?.steps ?? [];
  const baselineSteps = baseline
    ? firstTrial(baseline.trials)?.steps ?? []
    : [];
  if (!baseline) return [];
  const compared = compareSteps(baselineSteps, candidateSteps);
  const skipped = compared.baseline
    .filter((step) => step.change === "skipped")
    .map((step) => step.step.tool_name);
  const added = compared.candidate
    .filter((step) => step.change === "added")
    .map((step) => step.step.tool_name);
  return [
    ...(skipped.length
      ? [lensTranslate("evals.neverCalledValue0Main", { value0: [...new Set(skipped)].join(", ") })]
      : []),
    ...(added.length
      ? [lensTranslate("evals.calledValue0MainDid", { value0: [...new Set(added)].join(", ") })]
      : []),
  ];
}

export function diagnose(
  candidate: RunCase,
  baseline: RunCase | null,
): Diagnosis {
  const errors = candidate.trials.filter((trial) => trial.error !== null);
  const failed = failedChecks(candidate);
  const changes = stepChanges(candidate, baseline);
  const failedTools = candidate.trials.flatMap((trial) =>
    trial.steps.filter((step) => !step.ok).map((s) => s.tool_name),
  );
  const details = [
    ...failed,
    ...changes,
    ...(failedTools.length
      ? [lensTranslate("evals.toolErrorsValue0", { value0: [...new Set(failedTools)].join(", ") })]
      : []),
    ...(errors.length
      ? [lensTranslate("evals.value0ErroredValue1", { value0: plural(errors.length, "trial"), value1: errors[0]?.error })]
      : []),
  ];
  const headline =
    candidate.passed === false
      ? [changes[0], failed[0]].filter(Boolean).join(" · ") ||
        details[0] ||
        lensTranslate("evals.failedJudgeScorer")
      : candidate.passed
        ? lensTranslate("evals.passesNow") + (changes.length ? ` · ${changes[0]}` : "")
        : lensTranslate("evals.stillScoring");
  return { headline, details };
}
