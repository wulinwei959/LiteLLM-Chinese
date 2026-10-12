import type { GuardrailsMonitorTranslator } from "@/lib/i18n/translators";
import { formatNumberWithCommas, getSpendString } from "@/utils/dataUtils";

export type UsageUnits = Readonly<Record<string, number>>;

export const formatCost = (cost: number | null | undefined): string => {
  if (cost == null) return "—";
  return cost === 0 ? `$${formatNumberWithCommas(0, 4)}` : getSpendString(cost, 4);
};

export const totalUnits = (units: UsageUnits): number => Object.values(units).reduce((sum, n) => sum + n, 0);

type CounterLabelKey =
  | "counters.automatedReasoningPolicy"
  | "counters.contentPolicy"
  | "counters.contentPolicyImage"
  | "counters.contextualGroundingPolicy"
  | "counters.sensitiveInformationPolicy"
  | "counters.sensitiveInformationPolicyFree"
  | "counters.textRecords"
  | "counters.topicPolicy"
  | "counters.wordPolicy";

const COUNTER_KEYS: Readonly<Record<string, CounterLabelKey>> = {
  automatedReasoningPolicyUnits: "counters.automatedReasoningPolicy",
  contentPolicyUnits: "counters.contentPolicy",
  contentPolicyImageUnits: "counters.contentPolicyImage",
  contextualGroundingPolicyUnits: "counters.contextualGroundingPolicy",
  sensitiveInformationPolicyUnits: "counters.sensitiveInformationPolicy",
  sensitiveInformationPolicyFreeUnits: "counters.sensitiveInformationPolicyFree",
  text_records: "counters.textRecords",
  topicPolicyUnits: "counters.topicPolicy",
  wordPolicyUnits: "counters.wordPolicy",
};

const derivedCounterLabel = (counter: string): string =>
  counter
    .replace(/Units$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

export const counterLabel = (t: GuardrailsMonitorTranslator, counter: string): string => {
  const known = COUNTER_KEYS[counter];
  return known === undefined ? derivedCounterLabel(counter) : t(known);
};

export const unpricedSummary = (t: GuardrailsMonitorTranslator, untracked: UsageUnits): string | null => {
  const total = totalUnits(untracked);
  return total > 0 ? t("unpriced.summary", { count: total }) : null;
};

export interface CounterMath {
  readonly counter: string;
  readonly units: number;
  readonly unpriced: number;
  readonly cost: number | null;
}

export const pricedUnits = ({ units, unpriced }: Pick<CounterMath, "units" | "unpriced">): number =>
  Math.max(units - unpriced, 0);

export const unitPrice = (row: CounterMath): number | null => {
  const priced = pricedUnits(row);
  return row.cost != null && priced > 0 ? row.cost / priced : null;
};

export const formatUnitPrice = (price: number): string => {
  const fixed = price.toFixed(6).replace(/\.?0+$/, "");
  return price > 0 && Number(fixed) === 0 ? "< $0.000001" : `$${fixed}`;
};

export interface MathRow {
  readonly label: string;
  readonly parts: readonly string[];
  readonly note: string | null;
}

export const counterMathRow = (t: GuardrailsMonitorTranslator, row: CounterMath): MathRow => {
  const label = counterLabel(t, row.counter);
  const price = unitPrice(row);
  if (price == null) {
    return { label, parts: [row.units.toLocaleString(), "× —", "= —"], note: t("breakdown.costNoteNoPrice") };
  }
  return {
    label,
    parts: [pricedUnits(row).toLocaleString(), `× ${formatUnitPrice(price)}`, `= ${formatCost(row.cost)}`],
    note: row.unpriced > 0 ? t("breakdown.costNoteUnpriced", { count: row.unpriced }) : null,
  };
};

export const unitsMathRows = (t: GuardrailsMonitorTranslator, units: UsageUnits): readonly MathRow[] =>
  Object.entries(units).map(([counter, n]) => ({
    label: counterLabel(t, counter),
    parts: [n.toLocaleString()],
    note: null,
  }));

export const pricingIssueUrl = (unpriced: UsageUnits, provider?: string): string => {
  const subject = provider ? `${provider} guardrail` : "guardrail";
  const params = new URLSearchParams({
    template: "feature_request.yml",
    title: `[Feature]: add ${subject} pricing to the cost map`,
    "the-feature": `LiteLLM has no price for these ${subject} usage units, so the Guardrails Monitor leaves them out of the cost: ${Object.keys(unpriced).join(", ")}`,
  });
  return `https://github.com/BerriAI/litellm/issues/new?${params.toString()}`;
};
