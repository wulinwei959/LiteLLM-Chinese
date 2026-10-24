import type { EvalRun, Summary } from "./types";
import { lensTranslate } from "../../../../host/lensTranslate";

export type GateTone = "passed" | "failed" | "pending" | "errored";

export const gateTone = (run: EvalRun): GateTone => {
  if (run.status === "failed") return "errored";
  if (run.summary === null) return "pending";
  return run.summary.gate.passed ? "passed" : "failed";
};

export const passedLabel = (summary: Summary): string =>
  `${summary.passed}/${summary.total}`;

export const deltaLabel = (summary: Summary): string => {
  if (summary.baseline_run_id === null) return lensTranslate("evals.noBaseline");
  if (summary.regressions.length === 0 && summary.fixed.length === 0)
    return lensTranslate("evals.change");
  const parts = [];
  if (summary.regressions.length)
    parts.push(lensTranslate("evals.value0Regressed", { value0: summary.regressions.length }));
  if (summary.fixed.length) parts.push(lensTranslate("evals.value0Fixed", { value0: summary.fixed.length }));
  return parts.join(" · ");
};

export const deltaTone = (summary: Summary | null): string => {
  if (!summary || summary.baseline_run_id === null)
    return "text-muted-foreground";
  if (summary.regressions.length) return "text-destructive";
  return summary.fixed.length ? "text-success" : "text-muted-foreground";
};

export const costPerCase = (summary: Summary): string => {
  if (summary.total === 0) return "–";
  const each = summary.cost_per_case;
  return `$${each.toFixed(each > 0 && each < 0.01 ? 4 : 2)}`;
};

export const shortSha = (sha: string): string => sha.slice(0, 7);

export interface RunGroups {
  readonly main: readonly EvalRun[];
  readonly pulls: readonly EvalRun[];
}

export const groupRuns = (runs: readonly EvalRun[]): RunGroups => ({
  main: runs.filter((run) => run.pr === null),
  pulls: runs.filter((run) => run.pr !== null),
});
