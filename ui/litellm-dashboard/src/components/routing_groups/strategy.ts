import type { RoutingGroupsTranslator } from "@/lib/i18n/translators";

type StrategyLabelKey =
  | "strategySimpleShuffle"
  | "strategyLeastBusy"
  | "strategyUsageBased"
  | "strategyLatencyBased"
  | "strategyPriority";

const STRATEGY_LABEL_KEYS: Readonly<Record<string, StrategyLabelKey>> = {
  "simple-shuffle": "strategySimpleShuffle",
  "least-busy": "strategyLeastBusy",
  "usage-based-routing": "strategyUsageBased",
  "latency-based-routing": "strategyLatencyBased",
  priority: "strategyPriority",
};

export const formatStrategyLabel = (t: RoutingGroupsTranslator, strategy: string): string => {
  const key = STRATEGY_LABEL_KEYS[strategy];
  return key === undefined ? strategy : t(key);
};
