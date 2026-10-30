import type { PoliciesTranslator } from "@/lib/i18n/translators";

const ACTION_LABEL_KEYS: Record<string, "flow.allow" | "flow.block" | "flow.next" | "flow.customResponse"> = {
  allow: "flow.allow",
  block: "flow.block",
  next: "flow.next",
  modify_response: "flow.customResponse",
};

export const actionLabel = (t: PoliciesTranslator, value: string | null | undefined): string => {
  if (value == null) return "";
  return value in ACTION_LABEL_KEYS ? t(ACTION_LABEL_KEYS[value]) : value;
};
