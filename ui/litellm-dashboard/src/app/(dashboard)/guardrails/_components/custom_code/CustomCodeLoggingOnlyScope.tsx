import React from "react";
import { useTranslations } from "next-intl";
import type { GuardrailsTranslator } from "@/lib/i18n/translators";
import {
  choiceToLoggingOnlyScope,
  effectiveLoggingOnlyContinue,
  getLoggingOnlyScopeOptions,
  LOGGING_ONLY_SCOPE_VALUES,
  getLoggingOnlyScopeUpdate,
  type LoggingOnlyScope,
  type LoggingOnlyScopeChoice,
} from "../guardrail_info_helpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loggingOnlyScopeItems = (t: GuardrailsTranslator) => getLoggingOnlyScopeOptions(true, t);
const LOGGING_ONLY_SCOPE_CHOICES: ReadonlySet<string> = new Set(LOGGING_ONLY_SCOPE_VALUES);

const isLoggingOnlyScopeChoice = (value: unknown): value is LoggingOnlyScopeChoice =>
  typeof value === "string" && LOGGING_ONLY_SCOPE_CHOICES.has(value);

export const CustomCodeLoggingOnlyScopeSelect: React.FC<{
  value: LoggingOnlyScopeChoice;
  onChange: (choice: LoggingOnlyScopeChoice) => void;
}> = ({ value, onChange }) => {
  const t = useTranslations("guardrails");
  const items = loggingOnlyScopeItems(t);
  return (
    <div className="w-[240px]">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("loggingOnlyScope.label")}</label>
      <Select
        items={items}
        value={value}
        onValueChange={(nextValue) => {
          if (isLoggingOnlyScopeChoice(nextValue)) onChange(nextValue);
        }}
      >
        <SelectTrigger className="w-full" aria-label={t("loggingOnlyScope.label")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const getCustomCodeLoggingOnlyScopeCreate = (
  mode: string[],
  choice: LoggingOnlyScopeChoice,
  continueOnInputFailure: boolean,
): { logging_only_scope?: LoggingOnlyScope; logging_only_continue_on_input_failure?: boolean } => {
  if (!mode.includes("logging_only")) return {};
  const scope = choiceToLoggingOnlyScope(choice);
  return {
    ...(scope === null ? {} : { logging_only_scope: scope }),
    ...(effectiveLoggingOnlyContinue(choice, continueOnInputFailure)
      ? { logging_only_continue_on_input_failure: true }
      : {}),
  };
};

export const getCustomCodeLoggingOnlyScopeUpdate = (
  mode: string[],
  litellmParams:
    | { logging_only_scope?: string | null; logging_only_continue_on_input_failure?: boolean | null }
    | null
    | undefined,
  choice: LoggingOnlyScopeChoice,
  continueOnInputFailure: boolean,
): { logging_only_scope?: LoggingOnlyScope | null; logging_only_continue_on_input_failure?: boolean } =>
  mode.includes("logging_only") ? getLoggingOnlyScopeUpdate(litellmParams, choice, continueOnInputFailure) : {};
