export const ACTION_ITEMS = [
  { value: "BLOCK", labelKey: "filter.block" },
  { value: "MASK", labelKey: "filter.mask" },
] as const;

export const SEVERITY_ITEMS = [
  { value: "high", labelKey: "filter.sevHigh" },
  { value: "medium", labelKey: "filter.sevMedium" },
  { value: "low", labelKey: "filter.sevLow" },
] as const;
