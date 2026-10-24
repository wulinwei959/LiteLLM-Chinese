import type { Gate, Scorer } from "./runs/types";
import { lensTranslate } from "../../../host/lensTranslate";

export function scorerLabel(scorer: Scorer): string {
  switch (scorer.kind) {
    case "task_completed":
      return "task_completed";
    case "called_before":
      return lensTranslate("evals.value0BeforeValue1", { value0: scorer.first, value1: scorer.then });
    case "judge":
      return "judge";
  }
}

export function gateLabel(gate: Gate): string {
  const parts = [
    gate.regressions != null && lensTranslate("evals.regressionsValue0", { value0: gate.regressions }),
    gate.critical != null && lensTranslate("evals.criticalValue0", { value0: gate.critical }),
    gate.pass_rate != null && lensTranslate("evals.passValue0", { value0: Math.round(gate.pass_rate * 100) }),
    gate.cost_per_case != null && `$${gate.cost_per_case}/case`,
  ].filter((part): part is string => typeof part === "string");
  return parts.length ? parts.join(" · ") : lensTranslate("evals.noGate");
}
